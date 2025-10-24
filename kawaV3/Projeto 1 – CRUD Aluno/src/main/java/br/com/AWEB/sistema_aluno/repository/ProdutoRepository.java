package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    List<Produto> findAllByCategoriaNomeIgnoreCase(String nomeCategoria);

    // ADICIONE ESTE NOVO MÉTODO
    // Ele irá procurar todos os produtos onde o nome do fornecedor contenha o texto fornecido.
    List<Produto> findAllByFornecedorNomeContainingIgnoreCase(String nomeFornecedor);

    @Query("SELECT p FROM Produto p JOIN Estoque e ON p.id = e.produto.id WHERE e.quantidade <= p.pontoRessuprimento")
    List<Produto> findProdutosComEstoqueBaixo();
}