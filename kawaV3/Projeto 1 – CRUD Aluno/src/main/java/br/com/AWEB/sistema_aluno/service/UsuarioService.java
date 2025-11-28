// Local: src/main/java/br/com/AWEB/sistema_aluno/service/UsuarioService.java

package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Usuario;
import br.com.AWEB.sistema_aluno.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Import necessário
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Instancia o codificador de senhas (BCrypt)
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Usuario findById(Integer id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            return usuario.get();
        }
        throw new RuntimeException("Usuário não encontrado com o id: " + id);
    }
    
    public Usuario update(Integer id, Usuario usuarioDetails) {
        Usuario usuario = findById(id);
        
        // Atualiza os campos do usuário existente com os novos detalhes
        usuario.setNome(usuarioDetails.getNome());
        usuario.setEmail(usuarioDetails.getEmail());
        usuario.setAtivo(usuarioDetails.isAtivo());
        usuario.setPapel(usuarioDetails.getPapel());
        
        // A senha só deve ser atualizada se uma nova for fornecida
        if (usuarioDetails.getSenhaHash() != null && !usuarioDetails.getSenhaHash().isEmpty()) {
            // IMPLEMENTAÇÃO BCRYPT: Criptografa a nova senha antes de salvar
            String senhaCriptografada = passwordEncoder.encode(usuarioDetails.getSenhaHash());
            usuario.setSenhaHash(senhaCriptografada);
        }
        
        return usuarioRepository.save(usuario);
    }

    public void deleteById(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com o id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    /**
     * Salva um novo usuário.
     * A senha é criptografada automaticamente antes de salvar.
     */
    public Usuario save(Usuario usuario) {
        if (usuario.getId() == null) {
            usuario.setDataCriacao(LocalDateTime.now());
        }
        
        // IMPLEMENTAÇÃO BCRYPT: Verifica se a senha foi informada e criptografa
        if (usuario.getSenhaHash() != null && !usuario.getSenhaHash().isEmpty()) {
            String senhaCriptografada = passwordEncoder.encode(usuario.getSenhaHash());
            usuario.setSenhaHash(senhaCriptografada);
        }
        
        return usuarioRepository.save(usuario);
    }

    /**
     * Autentica um usuário com base no email e senha.
     * Retorna true se as credenciais forem válidas.
     */
    public boolean autenticarUsuario(String email, String senhaPura) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        // Verifica se o usuário com o email fornecido existe
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();

            // IMPLEMENTAÇÃO BCRYPT: Verifica a senha
            // O método matches compara a senha "texto puro" (que veio do login)
            // com o Hash gravado no banco de dados.
            return passwordEncoder.matches(senhaPura, usuario.getSenhaHash());
        }

        // Retorna false se o usuário não for encontrado
        return false;
    }

    public Usuario findByNome(String nomeUsuario) {
        return usuarioRepository.findFirstByNomeContainingIgnoreCase(nomeUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado contendo o termo: " + nomeUsuario));
    }
}