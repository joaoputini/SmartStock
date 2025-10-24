// Local: src/main/java/br/com/AWEB/sistema_aluno/service/LogSistemaService.java
package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.LogSistema;
import br.com.AWEB.sistema_aluno.repository.LogSistemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogSistemaService {

    @Autowired
    private LogSistemaRepository logSistemaRepository;

    public List<LogSistema> findAll() {
        return logSistemaRepository.findAll();
    }

    // Logs são apenas para leitura e criação, não devem ser alterados.
    public LogSistema save(LogSistema log) {
        log.setTimestamp(LocalDateTime.now());
        return logSistemaRepository.save(log);
    }
}