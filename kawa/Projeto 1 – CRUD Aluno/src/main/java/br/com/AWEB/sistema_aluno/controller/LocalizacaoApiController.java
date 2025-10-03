// Local: src/main/java/br/com/AWEB/sistema_aluno/controller/LocalizacaoApiController.java
package br.com.AWEB.sistema_aluno.controller;

import br.com.AWEB.sistema_aluno.model.Localizacao;
import br.com.AWEB.sistema_aluno.service.LocalizacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/localizacoes")
public class LocalizacaoApiController {

    @Autowired
    private LocalizacaoService localizacaoService;

    @GetMapping
    public List<Localizacao> getAllLocalizacoes() {
        return localizacaoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Localizacao> getLocalizacaoById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(localizacaoService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Localizacao> createLocalizacao(@RequestBody Localizacao localizacao) {
        return new ResponseEntity<>(localizacaoService.save(localizacao), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Localizacao> updateLocalizacao(@PathVariable Integer id, @RequestBody Localizacao localizacaoDetails) {
        try {
            return ResponseEntity.ok(localizacaoService.update(id, localizacaoDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocalizacao(@PathVariable Integer id) {
        try {
            localizacaoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}