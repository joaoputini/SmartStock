package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Localizacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LocalizacaoRepository extends JpaRepository<Localizacao, Integer> {

    Optional<Localizacao> findByCodigoIgnoreCase(String codigo);
}