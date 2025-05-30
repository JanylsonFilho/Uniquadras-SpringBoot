package com.uniquadras.backend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime; // Manter se for usar data de criação da reserva

@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_quadra", nullable = false)
    private Quadra quadra;

    @OneToOne // Um horário pode ter apenas uma reserva
    @JoinColumn(name = "id_horario", nullable = false)
    private Horario horario;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao; // Para registrar quando a reserva foi feita

    // Construtores
    public Reserva() {
    }

    public Reserva(Usuario usuario, Quadra quadra, Horario horario) {
        this.usuario = usuario;
        this.quadra = quadra;
        this.horario = horario;
        this.dataCriacao = LocalDateTime.now(); // Define a data de criação no momento da reserva
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Quadra getQuadra() {
        return quadra;
    }

    public void setQuadra(Quadra quadra) {
        this.quadra = quadra;
    }

    public Horario getHorario() {
        return horario;
    }

    public void setHorario(Horario horario) {
        this.horario = horario;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}