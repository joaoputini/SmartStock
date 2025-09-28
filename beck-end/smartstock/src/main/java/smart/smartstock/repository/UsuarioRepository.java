package smart.smartstock.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import smart.smartstock.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByLogin(String login);
}