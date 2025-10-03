// Local: src/main/java/br/com/AWEB/sistema_aluno/service/CategoriaService.java
package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Categoria;
import br.com.AWEB.sistema_aluno.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }

    public Categoria findById(Integer id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com o id: " + id));
    }

    public Categoria save(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria update(Integer id, Categoria categoriaDetails) {
        Categoria categoria = findById(id);
        categoria.setNome(categoriaDetails.getNome());
        categoria.setDescricao(categoriaDetails.getDescricao());
        return categoriaRepository.save(categoria);
    }

    public void deleteById(Integer id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoria não encontrada com o id: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}