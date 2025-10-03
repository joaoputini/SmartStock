package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertaRepository extends JpaRepository<Alerta, Integer> {
}
