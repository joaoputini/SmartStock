package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}