// Local: src/main/java/br/com/AWEB/sistema_aluno/repository/UsuarioRepository.java
package br.com.AWEB.sistema_aluno.repository;

import br.com.AWEB.sistema_aluno.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Importe a classe Optional

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Spring Data JPA cria a implementação deste método automaticamente
    // Ele buscará um usuário pelo campo 'email'.
    Optional<Usuario> findByEmail(String email);
}