// Local: src/main/java/br/com/AWEB/sistema_aluno/controller/UsuarioApiController.java

package br.com.AWEB.sistema_aluno.controller;

import br.com.AWEB.sistema_aluno.model.Usuario;
import br.com.AWEB.sistema_aluno.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Permite acesso de qualquer origem (ideal para desenvolvimento)
@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioApiController {

    @Autowired
    private UsuarioService usuarioService;

    // Endpoint para LISTAR TODOS os usuários (GET /api/v1/usuarios)
    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.findAll();
    }

    // Endpoint para BUSCAR UM usuário por ID (GET /api/v1/usuarios/1)
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Integer id) {
        try {
            Usuario usuario = usuarioService.findById(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para CRIAR um novo usuário.
     * URL: POST /api/v1/usuarios
     * Corpo da Requisição (JSON):
     * {
     * "nome": "Nome do Usuario",
     * "email": "usuario@email.com",
     * "senhaHash": "senha123",
     * "ativo": true,
     * "papel": { "id": 1 }
     * }
     */

    // Endpoint para CRIAR um novo usuário (POST /api/v1/usuarios)
    @PostMapping
    public ResponseEntity<Usuario> createUsuario(@RequestBody Usuario usuario) {
        // Em um cenário real, você deveria validar os dados e criptografar a senha aqui
        Usuario novoUsuario = usuarioService.save(usuario);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    // Endpoint para ATUALIZAR um usuário existente (PUT /api/v1/usuarios/1)
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioDetails) {
        try {
            Usuario usuarioAtualizado = usuarioService.update(id, usuarioDetails);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para DELETAR um usuário (DELETE /api/v1/usuarios/1)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
        try {
            usuarioService.deleteById(id);
            return ResponseEntity.noContent().build(); // Retorna status 204
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@RequestBody LoginRequestDTO loginRequest) {
        boolean autenticado = usuarioService.autenticarUsuario(loginRequest.getEmail(), loginRequest.getSenha());
        
        if (autenticado) {
            // Retorna true com status 200 OK
            return ResponseEntity.ok(true);
        } else {
            // Você pode retornar false com 200 OK ou um status de não autorizado
            // Retornar 200 OK com 'false' é comum para não dar dicas a atacantes
            return ResponseEntity.ok(false);
        }
    }
}