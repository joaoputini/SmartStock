// Local: src/main/java/br/com/AWEB/sistema_aluno/service/EstoqueService.java
package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Estoque;
import br.com.AWEB.sistema_aluno.repository.EstoqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EstoqueService {

    @Autowired
    private EstoqueRepository estoqueRepository;

    public List<Estoque> findAll() {
        return estoqueRepository.findAll();
    }

    public Estoque findById(Integer id) {
        return estoqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de estoque não encontrado com o id: " + id));
    }

    public Estoque save(Estoque estoque) {
        estoque.setDataUltimaAtualizacao(LocalDateTime.now());
        return estoqueRepository.save(estoque);
    }

    public Estoque update(Integer id, Estoque estoqueDetails) {
        Estoque estoque = findById(id);
        estoque.setProduto(estoqueDetails.getProduto());
        estoque.setLocalizacao(estoqueDetails.getLocalizacao());
        estoque.setQuantidade(estoqueDetails.getQuantidade());
        estoque.setDataUltimaAtualizacao(LocalDateTime.now());
        return estoqueRepository.save(estoque);
    }

    public void deleteById(Integer id) {
        if (!estoqueRepository.existsById(id)) {
            throw new RuntimeException("Registro de estoque não encontrado com o id: " + id);
        }
        estoqueRepository.deleteById(id);
    }
}