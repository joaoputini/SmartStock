package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
}