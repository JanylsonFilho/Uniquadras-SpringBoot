package com.uniquadras.backend.controllers;



import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uniquadras.backend.models.Quadra;
import com.uniquadras.backend.services.QuadraService;

@RestController
@RequestMapping("/quadras")
public class QuadraController {

    @Autowired
    private QuadraService quadraService;

    @GetMapping
    public ResponseEntity<List<Quadra>> listarQuadras() {
        List<Quadra> quadras = quadraService.listarTodas();
        return new ResponseEntity<>(quadras, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quadra> obterQuadra(@PathVariable Long id) {
        Optional<Quadra> quadra = quadraService.obterPorId(id);
        return quadra.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Quadra> criarQuadra(@RequestBody Quadra quadra) {
        Quadra novaQuadra = quadraService.criar(quadra);
        return new ResponseEntity<>(novaQuadra, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quadra> atualizarQuadra(@PathVariable Long id, @RequestBody Quadra quadraAtualizada) {
        Optional<Quadra> quadra = quadraService.atualizar(id, quadraAtualizada);
        return quadra.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarQuadra(@PathVariable Long id) {
        if (quadraService.deletar(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}