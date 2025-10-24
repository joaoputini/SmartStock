package br.com.AWEB.sistema_aluno.controller;

import br.com.AWEB.sistema_aluno.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/chat")
public class ChatApiController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public String handleChatRequest(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        if (question == null || question.trim().isEmpty()) {
            return "Por favor, envie uma pergunta.";
        }
        try {
            return chatService.generateResponse(question);
        } catch (IOException e) {
            // Em um app real, você teria um tratamento de erro mais robusto
            e.printStackTrace();
            return "Erro ao se comunicar com a IA.";
        }
    }
}