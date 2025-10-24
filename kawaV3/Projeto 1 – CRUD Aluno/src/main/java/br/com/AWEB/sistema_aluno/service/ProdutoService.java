// Local: src/main/java/br/com/AWEB/sistema_aluno/service/ProdutoService.java
package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Produto;
import br.com.AWEB.sistema_aluno.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }

    public Produto findById(Integer id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com o id: " + id));
    }

    public Produto save(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Produto update(Integer id, Produto produtoDetails) {
        Produto produto = findById(id);
        produto.setSku(produtoDetails.getSku());
        produto.setNome(produtoDetails.getNome());
        produto.setDescricao(produtoDetails.getDescricao());
        produto.setCategoria(produtoDetails.getCategoria());
        produto.setFornecedor(produtoDetails.getFornecedor());
        produto.setPontoRessuprimento(produtoDetails.getPontoRessuprimento());
        produto.setUnidadeMedida(produtoDetails.getUnidadeMedida());
        return produtoRepository.save(produto);
    }

    public void deleteById(Integer id) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado com o id: " + id);
        }
        produtoRepository.deleteById(id);
    }

    public List<Produto> findProdutosComEstoqueBaixo() {
        return produtoRepository.findProdutosComEstoqueBaixo();
    }

    public List<Produto> findAllByCategoriaNome(String nomeCategoria) {
        return produtoRepository.findAllByCategoriaNomeIgnoreCase(nomeCategoria);
    }

    public List<Produto> findAllByFornecedorNome(String nomeFornecedor) {
        return produtoRepository.findAllByFornecedorNomeContainingIgnoreCase(nomeFornecedor);
    }
}