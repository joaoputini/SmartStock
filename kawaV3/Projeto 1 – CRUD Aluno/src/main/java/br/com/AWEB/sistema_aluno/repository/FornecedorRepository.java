package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Integer> {

    // Alterado de findByNomeIgnoreCase para findFirstByNomeContainingIgnoreCase
    // "findFirst" garante que retornamos apenas um resultado, mesmo que haja múltiplos matches
    Optional<Fornecedor> findFirstByNomeContainingIgnoreCase(String nomeFornecedor);
}