package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Integer> {

    Optional<Movimentacao> findTopByOrderByDataHoraDesc();

    List<Movimentacao> findTop5ByProdutoNomeIgnoreCaseOrderByDataHoraDesc(String nomeProduto);

    List<Movimentacao> findAllByUsuarioNomeIgnoreCaseOrderByDataHoraDesc(String nomeUsuario);
}