package com.uniquadras.backend.services;

import com.uniquadras.backend.models.Horario;
import com.uniquadras.backend.models.Quadra;
import com.uniquadras.backend.repositories.HorarioRepository;
import com.uniquadras.backend.repositories.QuadraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private QuadraRepository quadraRepository; // Para buscar a Quadra

    public List<Horario> listarTodos() {
        return horarioRepository.findAll();
    }

    public Optional<Horario> obterPorId(Long id) {
        return horarioRepository.findById(id);
    }

    public Horario criar(Horario horario) {
        // Validação básica: verificar se a quadra existe
        if (horario.getQuadra() == null || horario.getQuadra().getId() == null) {
            throw new IllegalArgumentException("Quadra ID é obrigatório para criar um horário.");
        }
        Optional<Quadra> quadraOptional = quadraRepository.findById(horario.getQuadra().getId());
        if (quadraOptional.isEmpty()) {
            throw new IllegalArgumentException("Quadra não encontrada.");
        }
        horario.setQuadra(quadraOptional.get()); // Garante que a entidade Quadra está gerenciada
        return horarioRepository.save(horario);
    }

    public Optional<Horario> atualizar(Long id, Horario horarioAtualizado) {
        return horarioRepository.findById(id)
                .map(horarioExistente -> {
                    // Se o ID da quadra for alterado, buscar e setar a nova quadra
                    if (horarioAtualizado.getQuadra() != null && horarioAtualizado.getQuadra().getId() != null &&
                        !horarioExistente.getQuadra().getId().equals(horarioAtualizado.getQuadra().getId())) {
                        Optional<Quadra> novaQuadraOptional = quadraRepository.findById(horarioAtualizado.getQuadra().getId());
                        if (novaQuadraOptional.isEmpty()) {
                            throw new IllegalArgumentException("Nova Quadra não encontrada.");
                        }
                        horarioExistente.setQuadra(novaQuadraOptional.get());
                    }

                    horarioExistente.setData(horarioAtualizado.getData());
                    horarioExistente.setHorario(horarioAtualizado.getHorario());
                    horarioExistente.setStatus(horarioAtualizado.getStatus());
                    return horarioRepository.save(horarioExistente);
                });
    }

    public boolean deletar(Long id) {
        if (horarioRepository.existsById(id)) {
            horarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Horario> buscarPorDataEQuadra(LocalDate data, Long idQuadra) {
        return horarioRepository.findByDataAndQuadraId(data, idQuadra);
    }

    public List<Horario> buscarPorData(LocalDate data) {
        return horarioRepository.findByData(data);
    }

    public Optional<Horario> atualizarStatus(Long id, String status) {
        return horarioRepository.findById(id)
                .map(horario -> {
                    horario.setStatus(status);
                    return horarioRepository.save(horario);
                });
    }

    public Optional<Horario> buscarPorQuadraDataHorario(Long quadraId, LocalDate data, String horario) {
        return horarioRepository.findByQuadraIdAndDataAndHorario(quadraId, data, horario);
    }
}