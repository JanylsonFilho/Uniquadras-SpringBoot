// UNIQUADRAS-SpringBoot/uniquadras/backend/src/main/java/com/uniquadras/backend/services/QuadraService.java
package com.uniquadras.backend.services;

import com.uniquadras.backend.models.Horario;
import com.uniquadras.backend.models.Quadra;
import com.uniquadras.backend.repositories.HorarioRepository; // Adicione este import
import com.uniquadras.backend.repositories.QuadraRepository;
import com.uniquadras.backend.repositories.ReservaRepository; // Adicione este import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Adicione este import para transações

import java.util.List;
import java.util.Optional;

@Service
public class QuadraService {

    @Autowired
    private QuadraRepository quadraRepository;

    @Autowired // Injete o repositório de Horario
    private HorarioRepository horarioRepository;

    @Autowired // Injete o repositório de Reserva
    private ReservaRepository reservaRepository;

    public List<Quadra> listarTodas() {
        return quadraRepository.findAll();
    }

    public Optional<Quadra> obterPorId(Long id) {
        return quadraRepository.findById(id);
    }

    public Quadra criar(Quadra quadra) {
        if (quadra.getStatus() == null || quadra.getStatus().isEmpty()) {
            quadra.setStatus("Ativa"); // Define um status padrão se não for fornecido
        }
        if (quadra.getLocalizacao() == null || quadra.getLocalizacao().isEmpty()) {
            quadra.setLocalizacao("Parque Desportivo"); // Exemplo de valor padrão
        }
        return quadraRepository.save(quadra);
    }

    public Optional<Quadra> atualizar(Long id, Quadra quadraAtualizada) {
        return quadraRepository.findById(id)
                .map(quadra -> {
                    quadra.setNome(quadraAtualizada.getNome());
                    quadra.setLocalizacao(quadraAtualizada.getLocalizacao());
                    quadra.setTipo(quadraAtualizada.getTipo());
                    quadra.setStatus(quadraAtualizada.getStatus());
                    return quadraRepository.save(quadra);
                });
    }

    @Transactional // Garante que todas as operações dentro deste método sejam atômicas
    public boolean deletar(Long id) {
        if (quadraRepository.existsById(id)) {
            // 1. Encontrar todos os horários associados a esta quadra
            List<Horario> horariosDaQuadra = horarioRepository.findByQuadraId(id);

            // 2. Para cada horário, encontrar e deletar as reservas associadas
            for (Horario horario : horariosDaQuadra) {
                reservaRepository.findByHorarioId(horario.getId()).forEach(reservaRepository::delete);
            }

            // 3. Deletar todos os horários associados a esta quadra
            horarioRepository.deleteAll(horariosDaQuadra);

            // 4. Finalmente, deletar a quadra
            quadraRepository.deleteById(id);
            return true;
        }
        return false;
    }
}