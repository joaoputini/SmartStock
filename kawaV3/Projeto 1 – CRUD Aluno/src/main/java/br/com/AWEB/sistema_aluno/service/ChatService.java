package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.*;
import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.*;
import com.google.cloud.vertexai.generativeai.ChatSession;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import com.google.protobuf.Struct;
import com.google.protobuf.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    // Injeção de todos os serviços necessários
    @Autowired private MovimentacaoService movimentacaoService;
    @Autowired private EstoqueService estoqueService;
    @Autowired private ProdutoService produtoService;
    @Autowired private AlertaService alertaService;
    @Autowired private FornecedorService fornecedorService;
    @Autowired private UsuarioService usuarioService;
    @Autowired private LocalizacaoService localizacaoService;

    @org.springframework.beans.factory.annotation.Value("${google.project.id}")
    private String projectId;

    @org.springframework.beans.factory.annotation.Value("${google.location}")
    private String location;

    // Definição de todas as ferramentas disponíveis para a IA
    private static final Tool tool = Tool.newBuilder()
            .addFunctionDeclarations(buildGetEstoquePorProduto())
            .addFunctionDeclarations(buildListarProdutosComEstoqueBaixo())
            .addFunctionDeclarations(buildListarProdutosPorCategoria())
            .addFunctionDeclarations(buildListarProdutosPorFornecedor()) 
            .addFunctionDeclarations(buildGetUltimaMovimentacao())
            .addFunctionDeclarations(buildListarUltimasMovimentacoesDeProduto())
            .addFunctionDeclarations(buildListarAlertasAtivos())
            .addFunctionDeclarations(buildGetInformacoesFornecedor())
            .addFunctionDeclarations(buildRegistrarEntradaEstoque())
            .addFunctionDeclarations(buildRegistrarSaidaEstoque())
            .build();
    
    // Método principal que processa a pergunta do usuário
    public String generateResponse(String textPrompt) throws IOException {
        try (VertexAI vertexAi = new VertexAI(projectId, location)) {
            GenerativeModel model = new GenerativeModel("gemini-2.5-pro", vertexAi).withTools(List.of(tool));
            ChatSession chat = model.startChat();

            // *** INÍCIO DA ALTERAÇÃO ***
            // Adicionamos uma instrução de sistema para que a IA corrija o input do usuário.
            String promptComInstrucao = "Aja como um assistente de sistema de estoque. Se o utilizador cometer pequenos erros de digitação ou usar plural/singular de forma incorreta ao se referir a entidades como produtos, fornecedores ou categorias, corrija para o nome mais provável que encontrar no sistema antes de escolher uma ferramenta para executar. A pergunta do utilizador é: \"" + textPrompt + "\"";
            
            System.out.println("Enviando para o Gemini: " + promptComInstrucao);
            Content initialContent = Content.newBuilder()
            .setRole("user")
            .addParts(Part.newBuilder().setText(promptComInstrucao))
            .build();
            // *** FIM DA ALTERAÇÃO ***

            GenerateContentResponse response = chat.sendMessage(initialContent);

            Part responsePart = response.getCandidates(0).getContent().getParts(0);

            if (responsePart.hasFunctionCall()) {
                FunctionCall functionCall = responsePart.getFunctionCall();
                System.out.println("Gemini solicitou a chamada da função: " + functionCall.getName());
                
                Part functionResponsePart = executeFunction(functionCall);

                if (functionResponsePart != null) {
                    Content functionResponseContent = Content.newBuilder().addParts(functionResponsePart).build();
                    response = chat.sendMessage(functionResponseContent);
                }
            }
            
            return ResponseHandler.getText(response);
        } catch (Exception e) {
            e.printStackTrace();
            String causeMessage = e.getCause() != null ? e.getCause().getMessage() : e.getMessage();
            return "Ocorreu um erro ao processar sua solicitação: " + causeMessage;
        }
    }

    // O resto do ficheiro permanece exatamente igual...
    // Roteador que executa a função correta com base no nome
    private Part executeFunction(FunctionCall functionCall) {
        String functionName = functionCall.getName();
        Struct args = functionCall.getArgs();
        Struct.Builder responseBuilder = Struct.newBuilder();

        try {
            switch (functionName) {
                case "getEstoquePorProduto":
                    responseBuilder = handleGetEstoquePorProduto(args);
                    break;
                case "listarProdutosComEstoqueBaixo":
                    responseBuilder = handleListarProdutosComEstoqueBaixo();
                    break;
                case "listarProdutosPorCategoria":
                    responseBuilder = handleListarProdutosPorCategoria(args);
                    break;
                case "listarProdutosPorFornecedor": // NOVO CASE AQUI
                    responseBuilder = handleListarProdutosPorFornecedor(args);
                    break;
                case "getUltimaMovimentacao":
                    responseBuilder = handleGetUltimaMovimentacao();
                    break;
                case "listarUltimasMovimentacoesDeProduto":
                    responseBuilder = handleListarUltimasMovimentacoesDeProduto(args);
                    break;
                case "listarAlertasAtivos":
                    responseBuilder = handleListarAlertasAtivos();
                    break;
                case "getInformacoesFornecedor":
                    responseBuilder = handleGetInformacoesFornecedor(args);
                    break;
                case "registrarEntradaEstoque":
                    responseBuilder = handleRegistrarEntradaEstoque(args);
                    break;
                case "registrarSaidaEstoque":
                    responseBuilder = handleRegistrarSaidaEstoque(args);
                    break;
                default:
                    throw new IllegalArgumentException("Função não implementada: " + functionName);
            }
        } catch (Exception e) {
            responseBuilder.putFields("erro", Value.newBuilder().setStringValue(e.getMessage()).build());
        }

        return Part.newBuilder()
                .setFunctionResponse(FunctionResponse.newBuilder()
                        .setName(functionName)
                        .setResponse(responseBuilder.build())
                        .build())
                .build();
    }

    // Métodos "Handler" para cada ferramenta
    private Struct.Builder handleGetEstoquePorProduto(Struct args) {
        String nomeProduto = args.getFieldsOrThrow("nomeProduto").getStringValue();
        Estoque estoque = estoqueService.findByProdutoNome(nomeProduto);
        return Struct.newBuilder()
            .putFields("produtoNome", asValue(estoque.getProduto().getNome()))
            .putFields("quantidade", asValue(estoque.getQuantidade().doubleValue()))
            .putFields("localizacao", asValue(estoque.getLocalizacao().getCodigo()));
    }

    private Struct.Builder handleListarProdutosComEstoqueBaixo() {
        List<Produto> produtos = produtoService.findProdutosComEstoqueBaixo();
        String nomes = produtos.stream().map(Produto::getNome).collect(Collectors.joining(", "));
        return Struct.newBuilder().putFields("produtos", asValue(nomes.isEmpty() ? "Nenhum" : nomes));
    }

    private Struct.Builder handleListarProdutosPorCategoria(Struct args) {
        String nomeCategoria = args.getFieldsOrThrow("nomeCategoria").getStringValue();
        List<Produto> produtos = produtoService.findAllByCategoriaNome(nomeCategoria);
        String nomes = produtos.stream().map(Produto::getNome).collect(Collectors.joining(", "));
        return Struct.newBuilder().putFields("produtos", asValue(nomes.isEmpty() ? "Nenhum" : nomes));
    }
    
    private Struct.Builder handleGetUltimaMovimentacao() {
        Movimentacao mov = movimentacaoService.findLast();
        return Struct.newBuilder()
            .putFields("produtoNome", asValue(mov.getProduto().getNome()))
            .putFields("tipo", asValue(mov.getTipo().toString()))
            .putFields("quantidade", asValue(mov.getQuantidade().doubleValue()))
            .putFields("dataHora", asValue(mov.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm"))))
            .putFields("usuarioNome", asValue(mov.getUsuario().getNome()));
    }

    private Struct.Builder handleListarUltimasMovimentacoesDeProduto(Struct args) {
        String nomeProduto = args.getFieldsOrThrow("nomeProduto").getStringValue();
        List<Movimentacao> movimentacoes = movimentacaoService.findLast5ByProduto(nomeProduto);
        String relatorio = movimentacoes.stream()
            .map(m -> String.format("%s: %s de %.2f unidades em %s por %s", 
                m.getTipo(), m.getProduto().getNome(), m.getQuantidade(), 
                m.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yy")), m.getUsuario().getNome()))
            .collect(Collectors.joining("; "));
        return Struct.newBuilder().putFields("relatorio", asValue(relatorio.isEmpty() ? "Nenhuma movimentação encontrada." : relatorio));
    }

    private Struct.Builder handleListarAlertasAtivos() {
        List<Alerta> alertas = alertaService.findAllAtivos();
        String mensagens = alertas.stream().map(Alerta::getMensagem).collect(Collectors.joining("; "));
        return Struct.newBuilder().putFields("alertas", asValue(mensagens.isEmpty() ? "Nenhum alerta ativo." : mensagens));
    }

    private Struct.Builder handleGetInformacoesFornecedor(Struct args) {
        String nomeFornecedor = args.getFieldsOrThrow("nomeFornecedor").getStringValue();
        Fornecedor f = fornecedorService.findByNome(nomeFornecedor);
        return Struct.newBuilder()
            .putFields("nome", asValue(f.getNome()))
            .putFields("cnpj", asValue(f.getCnpj()))
            .putFields("email", asValue(f.getContatoEmail()))
            .putFields("telefone", asValue(f.getContatoTelefone()));
    }

    private Struct.Builder handleRegistrarEntradaEstoque(Struct args) {
        String nomeProduto = args.getFieldsOrThrow("nomeProduto").getStringValue();
        BigDecimal quantidade = BigDecimal.valueOf(args.getFieldsOrThrow("quantidade").getNumberValue());
        String codigoLocalizacao = args.getFieldsOrThrow("codigoLocalizacao").getStringValue();
        String nomeUsuario = args.getFieldsOrThrow("nomeUsuario").getStringValue();

        Produto produto = produtoService.findAll().stream().filter(p -> p.getNome().equalsIgnoreCase(nomeProduto)).findFirst().orElseThrow();
        Localizacao localizacao = localizacaoService.findByCodigo(codigoLocalizacao);
        Usuario usuario = usuarioService.findByNome(nomeUsuario);
        
        movimentacaoService.registrarEntrada(produto, quantidade, localizacao, usuario);
        return Struct.newBuilder().putFields("status", asValue("Entrada de " + quantidade + " unidades de " + nomeProduto + " registrada com sucesso."));
    }
    
    private Struct.Builder handleRegistrarSaidaEstoque(Struct args) {
        String nomeProduto = args.getFieldsOrThrow("nomeProduto").getStringValue();
        BigDecimal quantidade = BigDecimal.valueOf(args.getFieldsOrThrow("quantidade").getNumberValue());
        String nomeUsuario = args.getFieldsOrThrow("nomeUsuario").getStringValue();

        Produto produto = produtoService.findAll().stream().filter(p -> p.getNome().equalsIgnoreCase(nomeProduto)).findFirst().orElseThrow();
        Usuario usuario = usuarioService.findByNome(nomeUsuario);

        movimentacaoService.registrarSaida(produto, quantidade, usuario);
        return Struct.newBuilder().putFields("status", asValue("Saída de " + quantidade + " unidades de " + nomeProduto + " registrada com sucesso."));
    }

    private Struct.Builder handleListarProdutosPorFornecedor(Struct args) {
        String nomeFornecedor = args.getFieldsOrThrow("nomeFornecedor").getStringValue();
        List<Produto> produtos = produtoService.findAllByFornecedorNome(nomeFornecedor);
        String nomes = produtos.stream().map(Produto::getNome).collect(Collectors.joining(", "));
        return Struct.newBuilder().putFields("produtos", asValue(nomes.isEmpty() ? "Nenhum produto encontrado para este fornecedor." : nomes));
    }

    // Métodos utilitários para construir as declarações de função e os valores
    private static Value asValue(String s) { return Value.newBuilder().setStringValue(s).build(); }
    private static Value asValue(double d) { return Value.newBuilder().setNumberValue(d).build(); }

    private static FunctionDeclaration buildGetEstoquePorProduto() {
        return FunctionDeclaration.newBuilder()
            .setName("getEstoquePorProduto")
            .setDescription("Busca a quantidade em estoque e a localização de um produto específico pelo seu nome.")
            .setParameters(Schema.newBuilder().setType(Type.OBJECT).putProperties("nomeProduto", Schema.newBuilder().setType(Type.STRING).setDescription("O nome do produto a ser buscado.").build()).addRequired("nomeProduto").build())
            .build();
    }
    
    private static FunctionDeclaration buildListarProdutosComEstoqueBaixo() {
        return FunctionDeclaration.newBuilder().setName("listarProdutosComEstoqueBaixo").setDescription("Lista todos os produtos cuja quantidade em estoque está abaixo do seu ponto de ressuprimento.").build();
    }

    private static FunctionDeclaration buildListarProdutosPorCategoria() {
        return FunctionDeclaration.newBuilder().setName("listarProdutosPorCategoria").setDescription("Retorna uma lista de todos os produtos que pertencem a uma categoria específica.").setParameters(Schema.newBuilder().setType(Type.OBJECT).putProperties("nomeCategoria", Schema.newBuilder().setType(Type.STRING).setDescription("O nome da categoria a ser buscada.").build()).addRequired("nomeCategoria").build()).build();
    }

    private static FunctionDeclaration buildGetUltimaMovimentacao() {
        return FunctionDeclaration.newBuilder().setName("getUltimaMovimentacao").setDescription("Busca a movimentação de estoque mais recente no sistema (última entrada ou saída).").build();
    }

    private static FunctionDeclaration buildListarUltimasMovimentacoesDeProduto() {
        return FunctionDeclaration.newBuilder().setName("listarUltimasMovimentacoesDeProduto").setDescription("Lista as últimas 5 movimentações (entradas e saídas) de um produto específico.").setParameters(Schema.newBuilder().setType(Type.OBJECT).putProperties("nomeProduto", Schema.newBuilder().setType(Type.STRING).setDescription("O nome do produto para buscar o histórico.").build()).addRequired("nomeProduto").build()).build();
    }

    private static FunctionDeclaration buildListarAlertasAtivos() {
        return FunctionDeclaration.newBuilder().setName("listarAlertasAtivos").setDescription("Mostra todos os alertas do sistema que ainda não foram resolvidos (status 'NOVO').").build();
    }

    private static FunctionDeclaration buildGetInformacoesFornecedor() {
        return FunctionDeclaration.newBuilder().setName("getInformacoesFornecedor").setDescription("Busca informações de contato (email, telefone, CNPJ) de um fornecedor específico.").setParameters(Schema.newBuilder().setType(Type.OBJECT).putProperties("nomeFornecedor", Schema.newBuilder().setType(Type.STRING).setDescription("O nome do fornecedor a ser buscado.").build()).addRequired("nomeFornecedor").build()).build();
    }

    private static FunctionDeclaration buildRegistrarEntradaEstoque() {
        return FunctionDeclaration.newBuilder().setName("registrarEntradaEstoque").setDescription("Registra a entrada de uma certa quantidade de um produto em uma localização específica, realizado por um usuário.").setParameters(Schema.newBuilder().setType(Type.OBJECT)
            .putProperties("nomeProduto", Schema.newBuilder().setType(Type.STRING).setDescription("Nome do produto que está entrando.").build())
            .putProperties("quantidade", Schema.newBuilder().setType(Type.NUMBER).setDescription("A quantidade de unidades que está entrando.").build())
            .putProperties("codigoLocalizacao", Schema.newBuilder().setType(Type.STRING).setDescription("O código da localização onde o produto será armazenado (ex: A01-P01).").build())
            .putProperties("nomeUsuario", Schema.newBuilder().setType(Type.STRING).setDescription("O nome do usuário que está realizando a operação.").build())
            .addRequired("nomeProduto").addRequired("quantidade").addRequired("codigoLocalizacao").addRequired("nomeUsuario")
            .build()).build();
    }
    
    private static FunctionDeclaration buildRegistrarSaidaEstoque() {
        return FunctionDeclaration.newBuilder().setName("registrarSaidaEstoque").setDescription("Registra a saída de uma certa quantidade de um produto, realizado por um usuário.").setParameters(Schema.newBuilder().setType(Type.OBJECT)
            .putProperties("nomeProduto", Schema.newBuilder().setType(Type.STRING).setDescription("Nome do produto que está saindo.").build())
            .putProperties("quantidade", Schema.newBuilder().setType(Type.NUMBER).setDescription("A quantidade de unidades que está saindo.").build())
            .putProperties("nomeUsuario", Schema.newBuilder().setType(Type.STRING).setDescription("O nome do usuário que está realizando a operação.").build())
            .addRequired("nomeProduto").addRequired("quantidade").addRequired("nomeUsuario")
            .build()).build();
    }

    private static FunctionDeclaration buildListarProdutosPorFornecedor() {
        return FunctionDeclaration.newBuilder()
            .setName("listarProdutosPorFornecedor")
            .setDescription("Retorna uma lista de todos os produtos fornecidos por uma empresa específica.")
            .setParameters(Schema.newBuilder().setType(Type.OBJECT)
                .putProperties("nomeFornecedor", Schema.newBuilder().setType(Type.STRING).setDescription("O nome do fornecedor a ser buscado.").build())
                .addRequired("nomeFornecedor").build())
            .build();
    }
}