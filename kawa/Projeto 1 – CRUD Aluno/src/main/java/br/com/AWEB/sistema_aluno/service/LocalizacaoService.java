// Local: src/main/java/br/com/AWEB/sistema_aluno/service/LocalizacaoService.java
package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Localizacao;
import br.com.AWEB.sistema_aluno.repository.LocalizacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LocalizacaoService {

    @Autowired
    private LocalizacaoRepository localizacaoRepository;

    public List<Localizacao> findAll() {
        return localizacaoRepository.findAll();
    }

    public Localizacao findById(Integer id) {
        return localizacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Localização não encontrada com o id: " + id));
    }

    public Localizacao save(Localizacao localizacao) {
        return localizacaoRepository.save(localizacao);
    }

    public Localizacao update(Integer id, Localizacao localizacaoDetails) {
        Localizacao localizacao = findById(id);
        localizacao.setCodigo(localizacaoDetails.getCodigo());
        localizacao.setDescricao(localizacaoDetails.getDescricao());
        return localizacaoRepository.save(localizacao);
    }

    public void deleteById(Integer id) {
        if (!localizacaoRepository.existsById(id)) {
            throw new RuntimeException("Localização não encontrada com o id: " + id);
        }
        localizacaoRepository.deleteById(id);
    }
}