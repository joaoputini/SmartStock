// Local: src/main/java/br/com/AWEB/sistema_aluno/controller/EstoqueApiController.java
package br.com.AWEB.sistema_aluno.controller;

import br.com.AWEB.sistema_aluno.model.Estoque;
import br.com.AWEB.sistema_aluno.service.EstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/estoques")
public class EstoqueApiController {

    @Autowired
    private EstoqueService estoqueService;

    @GetMapping
    public List<Estoque> getAllEstoques() {
        return estoqueService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estoque> getEstoqueById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(estoqueService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Estoque> createEstoque(@RequestBody Estoque estoque) {
        return new ResponseEntity<>(estoqueService.save(estoque), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estoque> updateEstoque(@PathVariable Integer id, @RequestBody Estoque estoqueDetails) {
        try {
            return ResponseEntity.ok(estoqueService.update(id, estoqueDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstoque(@PathVariable Integer id) {
        try {
            estoqueService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}