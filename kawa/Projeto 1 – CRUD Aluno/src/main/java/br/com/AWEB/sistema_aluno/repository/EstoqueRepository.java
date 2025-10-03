package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstoqueRepository extends JpaRepository<Estoque, Integer> {
}