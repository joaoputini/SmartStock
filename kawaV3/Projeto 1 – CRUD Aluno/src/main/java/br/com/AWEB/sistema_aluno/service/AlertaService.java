// Local: src/main/java/br/com/AWEB/sistema_aluno/service/AlertaService.java
package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Alerta;
import br.com.AWEB.sistema_aluno.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

    public List<Alerta> findAll() {
        return alertaRepository.findAll();
    }

    public Alerta findById(Integer id) {
        return alertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerta não encontrado com o id: " + id));
    }

    public Alerta save(Alerta alerta) {
        alerta.setDataCriacao(LocalDateTime.now());
        // Regra de negócio: todo novo alerta começa com o status NOVO
        if (alerta.getStatus() == null) {
            alerta.setStatus(Alerta.StatusAlerta.NOVO);
        }
        return alertaRepository.save(alerta);
    }

    public Alerta updateStatus(Integer id, Alerta.StatusAlerta novoStatus) {
        Alerta alerta = findById(id);
        alerta.setStatus(novoStatus);
        return alertaRepository.save(alerta);
    }

     public List<Alerta> findAllAtivos() {
        return alertaRepository.findAllByStatus(Alerta.StatusAlerta.NOVO);
    }
}