package br.com.AWEB.sistema_aluno.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import br.com.AWEB.sistema_aluno.model.Aluno;
import br.com.AWEB.sistema_aluno.service.AlunoService;
import jakarta.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("alunos", alunoService.listAll());
        return "list";
    }

    @GetMapping("/new")
    public String create(Model model) {
        model.addAttribute("aluno", new Aluno());
        return "form";
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Long id, Model model, RedirectAttributes attributes) {
        try {
            model.addAttribute("aluno", alunoService.findAluno(id));
            return "form";
        } catch (Exception e) {
            attributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/alunos";
        }
    }

    @PostMapping
    public String save(@Valid Aluno aluno,
            BindingResult result,
            RedirectAttributes attributes) {
        if (result.hasErrors())
            return "form";
        alunoService.createAluno(aluno);
        attributes.addFlashAttribute("message", "Aluno salvo com sucesso!");
        return "redirect:/alunos";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id, RedirectAttributes attributes) {
        try {
            alunoService.deleteAluno(id);
            attributes.addFlashAttribute("message", "Aluno excluido com sucesso!");
        } catch (Exception e) {
            attributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/alunos";
    }

    @GetMapping("/search")
    public String findByNome(@RequestParam(name = "nome", required = false) String nome, Model model){
        if (nome != null && !nome.isBlank()){
            List<Aluno> alunos = alunoService.findByNome(nome);
            model.addAttribute("alunos", alunos);
        }
        return "search";
    }
}