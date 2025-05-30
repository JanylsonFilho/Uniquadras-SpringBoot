package com.uniquadras.backend.controllers;

import com.uniquadras.backend.models.Horario;
import com.uniquadras.backend.services.HorarioService;
import com.uniquadras.backend.models.Quadra; // Importar Quadra
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/horarios")
@CrossOrigin(origins = "http://localhost:5173") // Permitir requisições do frontend
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @GetMapping
    public ResponseEntity<List<Horario>> listarHorarios(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @RequestParam(required = false) Long id_quadra) {
        List<Horario> horarios;
        if (data != null && id_quadra != null) {
            horarios = horarioService.buscarPorDataEQuadra(data, id_quadra);
        } else if (data != null) {
            horarios = horarioService.buscarPorData(data);
        } else {
            horarios = horarioService.listarTodos();
        }
        return new ResponseEntity<>(horarios, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horario> obterHorario(@PathVariable Long id) {
        Optional<Horario> horario = horarioService.obterPorId(id);
        return horario.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Horario> criarHorario(@RequestBody Horario horario) {
        try {
            // Mapeia o id_quadra do JSON para a entidade Quadra no Horario
            if (horario.getQuadra() == null || horario.getQuadra().getId() == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            Horario novoHorario = horarioService.criar(horario);
            return new ResponseEntity<>(novoHorario, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Horario> atualizarHorario(@PathVariable Long id, @RequestBody Horario horarioAtualizado) {
        try {
            Optional<Horario> horario = horarioService.atualizar(id, horarioAtualizado);
            return horario.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarHorario(@PathVariable Long id) {
        if (horarioService.deletar(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Horario> atualizarStatusHorario(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Optional<Horario> horarioAtualizado = horarioService.atualizarStatus(id, status);
        return horarioAtualizado.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}