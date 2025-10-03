// Local: src/main/java/br/com/AWEB/sistema_aluno/service/MovimentacaoService.java
package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Movimentacao;
import br.com.AWEB.sistema_aluno.repository.MovimentacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimentacaoService {

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    public List<Movimentacao> findAll() {
        return movimentacaoRepository.findAll();
    }

    public Movimentacao findById(Integer id) {
        return movimentacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada com o id: " + id));
    }

    public Movimentacao save(Movimentacao movimentacao) {
        // Regra de negócio: sempre registrar a data e hora atuais ao salvar
        movimentacao.setDataHora(LocalDateTime.now());
        return movimentacaoRepository.save(movimentacao);
    }

    // Geralmente, movimentações não são atualizadas ou deletadas para manter a integridade
    // do histórico. Mas, se necessário, os métodos podem ser implementados.
    
    // public void deleteById(Integer id) { ... }
}