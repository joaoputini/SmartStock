package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EstoqueRepository extends JpaRepository<Estoque, Integer> {

    // Alterado de findByProdutoNomeIgnoreCase para findFirstByProdutoNomeContainingIgnoreCase
    Optional<Estoque> findFirstByProdutoNomeContainingIgnoreCase(String nomeProduto);
    
    Optional<Estoque> findByProdutoIdAndLocalizacaoId(Integer produtoId, Integer localizacaoId);
}