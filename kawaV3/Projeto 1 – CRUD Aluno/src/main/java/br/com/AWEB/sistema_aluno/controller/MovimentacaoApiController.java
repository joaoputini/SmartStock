// Local: src/main/java/br/com/AWEB/sistema_aluno/controller/MovimentacaoApiController.java
package br.com.AWEB.sistema_aluno.controller;

import br.com.AWEB.sistema_aluno.model.Movimentacao;
import br.com.AWEB.sistema_aluno.service.MovimentacaoService;
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

    // Endpoint para LISTAR TODAS as movimentações
    @GetMapping
    public List<Movimentacao> getAllMovimentacoes() {
        return movimentacaoService.findAll();
    }

    // Endpoint para BUSCAR UMA movimentação por ID
    @GetMapping("/{id}")
    public ResponseEntity<Movimentacao> getMovimentacaoById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(movimentacaoService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para CRIAR (registrar) uma nova movimentação
    @PostMapping
    public ResponseEntity<Movimentacao> createMovimentacao(@RequestBody Movimentacao movimentacao) {
        return new ResponseEntity<>(movimentacaoService.save(movimentacao), HttpStatus.CREATED);
    }
}