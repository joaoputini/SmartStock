package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Integer> {
}