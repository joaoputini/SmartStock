package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Movimentacao;
import br.com.AWEB.sistema_aluno.repository.EstoqueRepository;
import br.com.AWEB.sistema_aluno.repository.MovimentacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.AWEB.sistema_aluno.model.Estoque;
import br.com.AWEB.sistema_aluno.model.Localizacao;
import br.com.AWEB.sistema_aluno.model.Produto;
import br.com.AWEB.sistema_aluno.model.Usuario;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional; // Certifique-se de que este import está presente

@Service
public class MovimentacaoService {

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;
    @Autowired
    private EstoqueService estoqueService;
    @Autowired
    private EstoqueRepository estoqueRepository; // Usado para salvar o estoque
    /**
     * Retorna todas as movimentações do banco de dados.
     * @return uma lista de todas as movimentações.
     */
    public List<Movimentacao> findAll() {
        return movimentacaoRepository.findAll();
    }

    /**
     * Busca uma movimentação pelo seu ID.
     * @param id o ID da movimentação a ser buscada.
     * @return a movimentação encontrada.
     * @throws RuntimeException se nenhuma movimentação for encontrada com o ID fornecido.
     */
    public Movimentacao findById(Integer id) {
        return movimentacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada com o id: " + id));
    }

    /**
     * Salva uma nova movimentação no banco de dados.
     * Define a data e hora atuais para a movimentação antes de salvar.
     * @param movimentacao o objeto Movimentacao a ser salvo.
     * @return a movimentação salva com o ID gerado.
     */
    public Movimentacao save(Movimentacao movimentacao) {
        movimentacao.setDataHora(LocalDateTime.now());
        return movimentacaoRepository.save(movimentacao);
    }
    
    /**
     * Busca a última movimentação registrada no sistema.
     * @return a movimentação mais recente.
     * @throws RuntimeException se não houver nenhuma movimentação no banco de dados.
     */
    public Movimentacao findLast() {
        Optional<Movimentacao> ultimaMovimentacao = movimentacaoRepository.findTopByOrderByDataHoraDesc();
        if (ultimaMovimentacao.isPresent()) {
            return ultimaMovimentacao.get();
        }
        throw new RuntimeException("Nenhuma movimentação foi encontrada no sistema.");
    }

    public List<Movimentacao> findLast5ByProduto(String nomeProduto) {
        return movimentacaoRepository.findTop5ByProdutoNomeIgnoreCaseOrderByDataHoraDesc(nomeProduto);
    }

    public List<Movimentacao> findByUsuario(String nomeUsuario) {
        return movimentacaoRepository.findAllByUsuarioNomeIgnoreCaseOrderByDataHoraDesc(nomeUsuario);
    }

    @Transactional
    public Movimentacao registrarEntrada(Produto produto, BigDecimal quantidade, Localizacao localizacao, Usuario usuario) {
        // 1. Atualiza ou cria o registro de estoque
        Estoque estoque = estoqueService.findByProdutoIdAndLocalizacaoId(produto.getId(), localizacao.getId());
        if (estoque == null) {
            estoque = new Estoque();
            estoque.setProduto(produto);
            estoque.setLocalizacao(localizacao);
            estoque.setQuantidade(quantidade);
        } else {
            estoque.setQuantidade(estoque.getQuantidade().add(quantidade));
        }
        estoque.setDataUltimaAtualizacao(LocalDateTime.now());
        estoqueRepository.save(estoque);

        // 2. Cria a movimentação de entrada
        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setProduto(produto);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setTipo(Movimentacao.TipoMovimentacao.ENTRADA);
        movimentacao.setUsuario(usuario);
        
        return save(movimentacao); // Reutiliza o método save que já define a data/hora
    }

    @Transactional
    public Movimentacao registrarSaida(Produto produto, BigDecimal quantidade, Usuario usuario) {
        // Assume que a saída pode ser de qualquer localização, então busca o primeiro registro de estoque.
        // Uma lógica mais complexa poderia especificar a localização de saída.
        Estoque estoque = estoqueService.findByProdutoNome(produto.getNome());
        if (estoque.getQuantidade().compareTo(quantidade) < 0) {
            throw new RuntimeException("Quantidade de saída (" + quantidade + ") é maior que o estoque atual (" + estoque.getQuantidade() + ").");
        }

        // 1. Atualiza o estoque
        estoque.setQuantidade(estoque.getQuantidade().subtract(quantidade));
        estoque.setDataUltimaAtualizacao(LocalDateTime.now());
        estoqueRepository.save(estoque);

        // 2. Cria a movimentação de saída
        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setProduto(produto);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setTipo(Movimentacao.TipoMovimentacao.SAIDA);
        movimentacao.setUsuario(usuario);
        
        return save(movimentacao);
    }

    // Nota: Geralmente, registros de histórico como movimentações não são atualizados ou deletados
    // para garantir a integridade e a rastreabilidade dos dados. Por isso, os métodos
    // de update e delete não são implementados aqui, mas poderiam ser se o requisito do negócio mudasse.
}