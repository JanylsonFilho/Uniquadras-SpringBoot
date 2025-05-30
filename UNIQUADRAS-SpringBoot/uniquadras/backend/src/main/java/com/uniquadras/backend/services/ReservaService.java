package com.uniquadras.backend.services;

import com.uniquadras.backend.models.Horario;
import com.uniquadras.backend.models.Quadra;
import com.uniquadras.backend.models.Reserva;
import com.uniquadras.backend.models.Usuario;
import com.uniquadras.backend.repositories.HorarioRepository;
import com.uniquadras.backend.repositories.QuadraRepository;
import com.uniquadras.backend.repositories.ReservaRepository;
import com.uniquadras.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import para @Transactional

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private QuadraRepository quadraRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    public Optional<Reserva> obterPorId(Long id) {
        return reservaRepository.findById(id);
    }

    @Transactional // Garante que a transação para reserva e atualização de status seja atômica
    public Reserva criar(Reserva reserva) {
        if (reserva.getUsuario() == null || reserva.getUsuario().getId() == null ||
            reserva.getQuadra() == null || reserva.getQuadra().getId() == null ||
            reserva.getHorario() == null || reserva.getHorario().getId() == null) {
            throw new IllegalArgumentException("Dados de usuário, quadra e horário são obrigatórios.");
        }

        Optional<Usuario> usuarioOptional = usuarioRepository.findById(reserva.getUsuario().getId());
        Optional<Quadra> quadraOptional = quadraRepository.findById(reserva.getQuadra().getId());
        Optional<Horario> horarioOptional = horarioRepository.findById(reserva.getHorario().getId());

        if (usuarioOptional.isEmpty() || quadraOptional.isEmpty() || horarioOptional.isEmpty()) {
            throw new IllegalArgumentException("Usuário, quadra ou horário não encontrados.");
        }

        Horario horario = horarioOptional.get();

        // Verifica se o horário já está reservado
        if ("Indisponível".equals(horario.getStatus())) {
             throw new IllegalStateException("O horário selecionado já está reservado.");
        }
        
        // Verifica se já existe uma reserva para este horário
        if (reservaRepository.findByHorarioId(horario.getId()).stream().anyMatch(r -> r.getHorario().getStatus().equals("Indisponível"))) {
            throw new IllegalStateException("O horário selecionado já possui uma reserva ativa.");
        }

        // Define as entidades gerenciadas no objeto reserva
        reserva.setUsuario(usuarioOptional.get());
        reserva.setQuadra(quadraOptional.get());
        reserva.setHorario(horario);
        reserva.setDataCriacao(LocalDateTime.now());

        Reserva novaReserva = reservaRepository.save(reserva);

        // Atualiza o status do horário para "Indisponível" após a reserva
        horario.setStatus("Indisponível");
        horarioRepository.save(horario);

        return novaReserva;
    }

    public Optional<Reserva> atualizar(Long id, Reserva reservaAtualizada) {
        return reservaRepository.findById(id)
                .map(reservaExistente -> {
                    // Atualiza as associações se os IDs forem fornecidos e diferentes
                    if (reservaAtualizada.getUsuario() != null && reservaAtualizada.getUsuario().getId() != null &&
                        !reservaExistente.getUsuario().getId().equals(reservaAtualizada.getUsuario().getId())) {
                        usuarioRepository.findById(reservaAtualizada.getUsuario().getId())
                                .ifPresent(reservaExistente::setUsuario);
                    }
                    if (reservaAtualizada.getQuadra() != null && reservaAtualizada.getQuadra().getId() != null &&
                        !reservaExistente.getQuadra().getId().equals(reservaAtualizada.getQuadra().getId())) {
                        quadraRepository.findById(reservaAtualizada.getQuadra().getId())
                                .ifPresent(reservaExistente::setQuadra);
                    }
                    if (reservaAtualizada.getHorario() != null && reservaAtualizada.getHorario().getId() != null &&
                        !reservaExistente.getHorario().getId().equals(reservaAtualizada.getHorario().getId())) {
                        horarioRepository.findById(reservaAtualizada.getHorario().getId())
                                .ifPresent(reservaExistente::setHorario);
                    }
                    // A data de criação geralmente não é atualizada
                    return reservaRepository.save(reservaExistente);
                });
    }

    @Transactional // Garante que a transação para exclusão e atualização de status seja atômica
    public boolean deletar(Long id) {
        return reservaRepository.findById(id).map(reserva -> {
            // Reverte o status do horário para "Disponível" antes de deletar a reserva
            Horario horario = reserva.getHorario();
            if (horario != null) {
                horario.setStatus("Disponível");
                horarioRepository.save(horario);
            }
            reservaRepository.delete(reserva);
            return true;
        }).orElse(false);
    }

    public List<Reserva> buscarReservasPorUsuario(Long idUsuario) {
        return reservaRepository.findByUsuarioId(idUsuario);
    }
}