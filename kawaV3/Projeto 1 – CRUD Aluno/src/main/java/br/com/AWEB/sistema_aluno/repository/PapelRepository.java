package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Papel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PapelRepository extends JpaRepository<Papel, Integer> {
}