package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);

    // Alterado de findByNomeIgnoreCase para findFirstByNomeContainingIgnoreCase
    Optional<Usuario> findFirstByNomeContainingIgnoreCase(String nomeUsuario);
}