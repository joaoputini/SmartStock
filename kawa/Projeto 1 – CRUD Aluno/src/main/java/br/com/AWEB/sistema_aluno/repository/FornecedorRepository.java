package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Integer> {
}