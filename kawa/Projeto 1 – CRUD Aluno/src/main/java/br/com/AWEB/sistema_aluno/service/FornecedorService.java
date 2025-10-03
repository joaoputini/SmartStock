// Local: src/main/java/br/com/AWEB/sistema_aluno/service/FornecedorService.java
package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Fornecedor;
import br.com.AWEB.sistema_aluno.repository.FornecedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    public List<Fornecedor> findAll() {
        return fornecedorRepository.findAll();
    }

    public Fornecedor findById(Integer id) {
        return fornecedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado com o id: " + id));
    }

    public Fornecedor save(Fornecedor fornecedor) {
        return fornecedorRepository.save(fornecedor);
    }

    public Fornecedor update(Integer id, Fornecedor fornecedorDetails) {
        Fornecedor fornecedor = findById(id);
        fornecedor.setNome(fornecedorDetails.getNome());
        fornecedor.setCnpj(fornecedorDetails.getCnpj());
        fornecedor.setContatoEmail(fornecedorDetails.getContatoEmail());
        fornecedor.setContatoTelefone(fornecedorDetails.getContatoTelefone());
        return fornecedorRepository.save(fornecedor);
    }

    public void deleteById(Integer id) {
        if (!fornecedorRepository.existsById(id)) {
            throw new RuntimeException("Fornecedor não encontrado com o id: " + id);
        }
        fornecedorRepository.deleteById(id);
    }
}