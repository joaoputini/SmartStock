// Local: src/main/java/br/com/AWEB/sistema_aluno/service/UsuarioService.java

package br.com.AWEB.sistema_aluno.service;

import br.com.AWEB.sistema_aluno.model.Usuario;
import br.com.AWEB.sistema_aluno.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

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
            // Lembre-se de criptografar a senha na vida real!
            usuario.setSenhaHash(usuarioDetails.getSenhaHash());
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
     * Em um cenário real, a senha deve ser criptografada ANTES de salvar.
     */
    public Usuario save(Usuario usuario) {
        if (usuario.getId() == null) {
            usuario.setDataCriacao(LocalDateTime.now());
        }
        
        // !! ALERTA DE SEGURANÇA !!
        // Em um projeto real, você NUNCA deve salvar a senha em texto puro.
        // Use uma biblioteca de hashing como BCrypt do Spring Security.
        // Exemplo: usuario.setSenhaHash(passwordEncoder.encode(usuario.getSenhaHash()));
        
        return usuarioRepository.save(usuario);
    }

    /**
     * Autentica um usuário com base no email e senha.
     * Retorna true se as credenciais forem válidas, caso contrário, false.
     */
    public boolean autenticarUsuario(String email, String senha) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        // Verifica se o usuário com o email fornecido existe
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();

            // !! ALERTA DE SEGURANÇA !!
            // Esta é uma comparação de texto simples, que só funciona se a senha
            // NÃO estiver criptografada. Em um cenário real, você usaria um
            // método para verificar a senha criptografada.
            // Exemplo: return passwordEncoder.matches(senha, usuario.getSenhaHash());
            
            // Compara a senha fornecida com a senha armazenada no banco
            return senha.equals(usuario.getSenhaHash());
        }

        // Retorna false se o usuário não for encontrado
        return false;
    }

    public Usuario findByNome(String nomeUsuario) {
        // Altere a chamada para o novo método
        return usuarioRepository.findFirstByNomeContainingIgnoreCase(nomeUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado contendo o termo: " + nomeUsuario));
    }
}