package br.com.AWEB.sistema_aluno.controller;

import br.com.AWEB.sistema_aluno.model.Localizacao;
import br.com.AWEB.sistema_aluno.model.Movimentacao;
import br.com.AWEB.sistema_aluno.model.Produto;
import br.com.AWEB.sistema_aluno.model.Usuario;
import br.com.AWEB.sistema_aluno.service.LocalizacaoService;
import br.com.AWEB.sistema_aluno.service.MovimentacaoService;
import br.com.AWEB.sistema_aluno.service.ProdutoService;
import br.com.AWEB.sistema_aluno.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/movimentacoes")
public class MovimentacaoApiController {

    @Autowired
    private MovimentacaoService movimentacaoService;
    @Autowired
    private ProdutoService produtoService;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private LocalizacaoService localizacaoService;

    @GetMapping
    public List<Movimentacao> getAllMovimentacoes() {
        return movimentacaoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movimentacao> getMovimentacaoById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(movimentacaoService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ESTE É O MÉTODO QUE PRECISAVA SER CORRIGIDO
    @PostMapping
    public ResponseEntity<?> createMovimentacao(
            @RequestBody Movimentacao movimentacao, 
            @RequestParam(required = false) Integer localizacaoId
    ) {
        try {
            // 1. Busca os objetos completos no banco
            Produto produto = produtoService.findById(movimentacao.getProduto().getId());
            Usuario usuario = usuarioService.findById(movimentacao.getUsuario().getId());

            Movimentacao movimentacaoSalva;

            // 2. Verifica se é Entrada ou Saída para atualizar o ESTOQUE corretamente
            if (movimentacao.getTipo() == Movimentacao.TipoMovimentacao.ENTRADA) {
                if (localizacaoId == null) {
                    return ResponseEntity.badRequest().body("Erro: Selecione a localização para dar entrada.");
                }
                Localizacao localizacao = localizacaoService.findById(localizacaoId);
                
                // Chama a lógica que soma no estoque
                movimentacaoSalva = movimentacaoService.registrarEntrada(
                        produto, 
                        movimentacao.getQuantidade(), 
                        localizacao, 
                        usuario
                );
            } else {
                // Chama a lógica que subtrai do estoque
                movimentacaoSalva = movimentacaoService.registrarSaida(
                        produto, 
                        movimentacao.getQuantidade(), 
                        usuario
                );
            }

            return new ResponseEntity<>(movimentacaoSalva, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            // Retorna erro se tentar tirar mais do que tem no estoque
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}