package com.uniquadras.backend.repositories;

import com.uniquadras.backend.models.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuarioId(Long idUsuario);
    List<Reserva> findByHorarioId(Long idHorario); // Para verificar se um horário já está reservado
}