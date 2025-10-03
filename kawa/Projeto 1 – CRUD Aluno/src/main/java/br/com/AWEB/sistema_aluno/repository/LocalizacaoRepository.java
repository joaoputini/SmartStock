package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Localizacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalizacaoRepository extends JpaRepository<Localizacao, Integer> {
}