// Local: src/main/java/br/com/AWEB/sistema_aluno/controller/LoginRequestDTO.java
package br.com.AWEB.sistema_aluno.controller;

// Esta classe simples serve para mapear o JSON enviado pelo front-end no login.
public class LoginRequestDTO {
    private String email;
    private String senha;

    // Getters e Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}