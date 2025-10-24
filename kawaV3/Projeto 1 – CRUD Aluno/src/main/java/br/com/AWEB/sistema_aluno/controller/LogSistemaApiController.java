// Local: src/main/java/br/com/AWEB/sistema_aluno/controller/LogSistemaApiController.java
package br.com.AWEB.sistema_aluno.controller;

import br.com.AWEB.sistema_aluno.model.LogSistema;
import br.com.AWEB.sistema_aluno.service.LogSistemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/logs")
public class LogSistemaApiController {

    @Autowired
    private LogSistemaService logSistemaService;

    // Endpoint para LISTAR TODOS os logs (somente leitura)
    @GetMapping
    public List<LogSistema> getAllLogs() {
        return logSistemaService.findAll();
    }
    
    // Endpoint para CRIAR (registrar) um novo log
    @PostMapping
    public ResponseEntity<LogSistema> createLog(@RequestBody LogSistema log) {
        return new ResponseEntity<>(logSistemaService.save(log), HttpStatus.CREATED);
    }
}