package com.uniquadras.backend.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "horarios")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_quadra", nullable = false)
    private Quadra quadra;

    private LocalDate data;
    private String horario; // Ex: "18:00 - 19:00"
    private String status; // Ex: "Disponível", "Indisponível"

    public Horario() {
    }

    public Horario(Quadra quadra, LocalDate data, String horario, String status) {
        this.quadra = quadra;
        this.data = data;
        this.horario = horario;
        this.status = status;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Quadra getQuadra() {
        return quadra;
    }

    public void setQuadra(Quadra quadra) {
        this.quadra = quadra;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}