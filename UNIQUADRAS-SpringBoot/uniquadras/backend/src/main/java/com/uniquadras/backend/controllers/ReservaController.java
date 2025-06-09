package com.uniquadras.backend.controllers;

import com.uniquadras.backend.models.Horario;
import com.uniquadras.backend.models.Quadra;
import com.uniquadras.backend.models.Reserva;
import com.uniquadras.backend.models.Usuario;
import com.uniquadras.backend.services.HorarioService;
import com.uniquadras.backend.services.QuadraService;
import com.uniquadras.backend.services.ReservaService;
import com.uniquadras.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reservas")
@CrossOrigin(origins = "http://localhost:5173") // Permitir requisições do frontend
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private QuadraService quadraService;

    @Autowired
    private HorarioService horarioService;


    // DTO para simplificar a criação de Reserva a partir do frontend
    // Crie esta classe interna ou como uma classe separada para melhor organização
    static class ReservaRequestDTO {
        public Long id_usuario;
        public Long id_quadra;
        public Long id_horario;
        // String esporte; // O esporte pode ser um atributo da quadra ou uma informação do front apenas.
    }

    // DTO para retornar informações mais completas de uma reserva ao frontend
    static class ReservaResponseDTO {
        public Long id;
        public Long idUsuario;
        public String nomeUsuario;
        public Long idQuadra;
        public String nomeQuadra;
        public String tipoQuadra;
        public Long idHorario;
        public String horarioReserva;
        public String dataReserva;
        public String statusHorario;

        public ReservaResponseDTO(Reserva reserva) {
            this.id = reserva.getId();
            this.idUsuario = reserva.getUsuario().getId();
            this.nomeUsuario = reserva.getUsuario().getNome();
            this.idQuadra = reserva.getQuadra().getId();
            this.nomeQuadra = reserva.getQuadra().getNome();
            this.tipoQuadra = reserva.getQuadra().getTipo();
            this.idHorario = reserva.getHorario().getId();
            this.horarioReserva = reserva.getHorario().getHorario();
            this.dataReserva = reserva.getHorario().getData().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            this.statusHorario = reserva.getHorario().getStatus();
        }
    }


    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listarReservas() {
        List<Reserva> reservas = reservaService.listarTodas();
        List<ReservaResponseDTO> dtos = reservas.stream()
                                            .map(ReservaResponseDTO::new)
                                            .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> obterReserva(@PathVariable Long id) {
        Optional<Reserva> reserva = reservaService.obterPorId(id);
        return reserva.map(value -> new ResponseEntity<>(new ReservaResponseDTO(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> criarReserva(@RequestBody ReservaRequestDTO reservaDTO) {
        try {
            // Reconstruir o objeto Reserva a partir do DTO
            Usuario usuario = usuarioService.obterPorId(reservaDTO.id_usuario)
                                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
            Quadra quadra = quadraService.obterPorId(reservaDTO.id_quadra)
                                .orElseThrow(() -> new IllegalArgumentException("Quadra não encontrada."));
            Horario horario = horarioService.obterPorId(reservaDTO.id_horario)
                                .orElseThrow(() -> new IllegalArgumentException("Horário não encontrado."));

            Reserva novaReserva = new Reserva(usuario, quadra, horario);
            Reserva reservaSalva = reservaService.criar(novaReserva);

            return new ResponseEntity<>(new ReservaResponseDTO(reservaSalva), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Erro ao criar reserva: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> atualizarReserva(@PathVariable Long id, @RequestBody ReservaRequestDTO reservaDTO) {
        try {
            // Para atualizar, precisamos carregar as entidades existentes e construir um objeto Reserva
            // com as novas referências, se houver alteração.
            // Para simplificar, vamos carregar a reserva existente e atualizar seus campos.
            Optional<Reserva> existingReservaOptional = reservaService.obterPorId(id);
            if (existingReservaOptional.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            Reserva existingReserva = existingReservaOptional.get();

            if (reservaDTO.id_usuario != null) {
                usuarioService.obterPorId(reservaDTO.id_usuario).ifPresent(existingReserva::setUsuario);
            }
            if (reservaDTO.id_quadra != null) {
                quadraService.obterPorId(reservaDTO.id_quadra).ifPresent(existingReserva::setQuadra);
            }
            if (reservaDTO.id_horario != null) {
                horarioService.obterPorId(reservaDTO.id_horario).ifPresent(existingReserva::setHorario);
            }

            Optional<Reserva> reservaAtualizada = reservaService.atualizar(id, existingReserva);
            return reservaAtualizada.map(value -> new ResponseEntity<>(new ReservaResponseDTO(value), HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarReserva(@PathVariable Long id) {
        if (reservaService.deletar(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ReservaResponseDTO>> listarReservasPorUsuario(@PathVariable Long idUsuario) {
        List<Reserva> reservas = reservaService.buscarReservasPorUsuario(idUsuario);
        if (reservas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // ou NOT_FOUND, dependendo da sua preferência
        }
        List<ReservaResponseDTO> dtos = reservas.stream()
                                            .map(ReservaResponseDTO::new)
                                            .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }
}