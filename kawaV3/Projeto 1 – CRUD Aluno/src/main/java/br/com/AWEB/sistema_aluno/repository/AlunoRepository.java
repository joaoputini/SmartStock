package br.com.AWEB.sistema_aluno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.AWEB.sistema_aluno.model.Aluno;
import java.util.List;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    List<Aluno> findByNomeContainingIgnoreCase(String nome);
}