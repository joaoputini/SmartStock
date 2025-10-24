package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertaRepository extends JpaRepository<Alerta, Integer> {

    List<Alerta> findAllByStatus(Alerta.StatusAlerta status);
}