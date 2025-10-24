package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.LogSistema;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogSistemaRepository extends JpaRepository<LogSistema, Integer> {
}