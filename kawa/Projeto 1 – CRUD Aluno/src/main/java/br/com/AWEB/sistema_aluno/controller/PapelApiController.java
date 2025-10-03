// Local: src/main/java/br/com/AWEB/sistema_aluno/controller/PapelApiController.java

package br.com.AWEB.sistema_aluno.controller;

import br.com.AWEB.sistema_aluno.model.Papel;
import br.com.AWEB.sistema_aluno.service.PapelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/papeis")
public class PapelApiController {

    @Autowired
    private PapelService papelService;

    // Endpoint para LISTAR TODOS os papéis (GET /api/v1/papeis)
    @GetMapping
    public List<Papel> getAllPapeis() {
        return papelService.findAll();
    }

    // Endpoint para BUSCAR UM papel por ID (GET /api/v1/papeis/1)
    @GetMapping("/{id}")
    public ResponseEntity<Papel> getPapelById(@PathVariable Integer id) {
        try {
            Papel papel = papelService.findById(id);
            return ResponseEntity.ok(papel);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para CRIAR um novo papel (POST /api/v1/papeis)
    @PostMapping
    public ResponseEntity<Papel> createPapel(@RequestBody Papel papel) {
        Papel novoPapel = papelService.save(papel);
        return new ResponseEntity<>(novoPapel, HttpStatus.CREATED);
    }

    // Endpoint para ATUALIZAR um papel existente (PUT /api/v1/papeis/1)
    @PutMapping("/{id}")
    public ResponseEntity<Papel> updatePapel(@PathVariable Integer id, @RequestBody Papel papelDetails) {
        try {
            Papel papelAtualizado = papelService.update(id, papelDetails);
            return ResponseEntity.ok(papelAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para DELETAR um papel (DELETE /api/v1/papeis/1)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePapel(@PathVariable Integer id) {
        try {
            papelService.deleteById(id);
            return ResponseEntity.noContent().build(); // Retorna status 204
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}