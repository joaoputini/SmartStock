// Local: src/main/java/br/com/AWEB/sistema_aluno/controller/AlertaApiController.java
package br.com.AWEB.sistema_aluno.controller;

import br.com.AWEB.sistema_aluno.model.Alerta;
import br.com.AWEB.sistema_aluno.service.AlertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/alertas")
public class AlertaApiController {

    @Autowired
    private AlertaService alertaService;

    @GetMapping
    public List<Alerta> getAllAlertas() {
        return alertaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alerta> getAlertaById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(alertaService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Alerta> createAlerta(@RequestBody Alerta alerta) {
        return new ResponseEntity<>(alertaService.save(alerta), HttpStatus.CREATED);
    }
    
    // Endpoint específico para atualizar apenas o status de um alerta
    @PatchMapping("/{id}/status")
    public ResponseEntity<Alerta> updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            Alerta.StatusAlerta novoStatus = Alerta.StatusAlerta.valueOf(body.get("status").toUpperCase());
            Alerta alertaAtualizado = alertaService.updateStatus(id, novoStatus);
            return ResponseEntity.ok(alertaAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Status inválido
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Alerta não encontrado
        }
    }
}