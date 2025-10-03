// Local: src/main/java/br/com/AWEB/sistema_aluno/model/Alerta.java
package br.com.AWEB.sistema_aluno.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertas")
public class Alerta {

    public enum TipoAlerta {
        ESTOQUE_BAIXO, PREVISAO_REPOSICAO
    }

    public enum StatusAlerta {
        NOVO, VISUALIZADO, RESOLVIDO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_produto", nullable = false)
    private Produto produto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAlerta tipo;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAlerta status;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public TipoAlerta getTipo() {
        return tipo;
    }

    public void setTipo(TipoAlerta tipo) {
        this.tipo = tipo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public StatusAlerta getStatus() {
        return status;
    }

    public void setStatus(StatusAlerta status) {
        this.status = status;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}