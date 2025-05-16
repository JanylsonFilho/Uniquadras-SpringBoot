package com.uniquadras.backend.services;



import com.uniquadras.backend.models.Reserva;
import com.uniquadras.backend.repositories.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    public Optional<Reserva> obterPorId(Long id) {
        return reservaRepository.findById(id);
    }

    public Reserva criar(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    public Optional<Reserva> atualizar(Long id, Reserva reservaAtualizada) {
        return reservaRepository.findById(id)
                .map(reserva -> {
                    reserva.setIdUsuario(reservaAtualizada.getIdUsuario());
                    reserva.setIdQuadra(reservaAtualizada.getIdQuadra());
                    reserva.setDataReserva(reservaAtualizada.getDataReserva());
                    reserva.setHorarioInicio(reservaAtualizada.getHorarioInicio());
                    reserva.setHorarioFim(reservaAtualizada.getHorarioFim());
                    return reservaRepository.save(reserva);
                });
    }

    public boolean deletar(Long id) {
        if (reservaRepository.existsById(id)) {
            reservaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}