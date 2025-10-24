// Local: src/main/java/br/com/AWEB/sistema_aluno/service/PapelService.java

package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Papel;
import br.com.AWEB.sistema_aluno.repository.PapelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PapelService {

    @Autowired
    private PapelRepository papelRepository;

    public List<Papel> findAll() {
        return papelRepository.findAll();
    }

    public Papel findById(Integer id) {
        Optional<Papel> papel = papelRepository.findById(id);
        if (papel.isPresent()) {
            return papel.get();
        }
        throw new RuntimeException("Papel não encontrado com o id: " + id);
    }

    public Papel save(Papel papel) {
        return papelRepository.save(papel);
    }

    public Papel update(Integer id, Papel papelDetails) {
        Papel papel = findById(id);
        papel.setNome(papelDetails.getNome());
        papel.setDescricao(papelDetails.getDescricao());
        return papelRepository.save(papel);
    }

    public void deleteById(Integer id) {
        if (!papelRepository.existsById(id)) {
            throw new RuntimeException("Papel não encontrado com o id: " + id);
        }
        papelRepository.deleteById(id);
    }
}