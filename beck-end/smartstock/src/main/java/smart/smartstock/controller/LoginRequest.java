package smart.smartstock.controller;

import lombok.Data;

@Data
public class LoginRequest {
    private String login;
    private String senha;
}