package com.uniquadras.backend.repositories;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uniquadras.backend.models.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    // Você pode adicionar métodos de consulta personalizados aqui, se necessário.
    // Por exemplo, para buscar reservas por `idUsuario`, `idQuadra` ou `dataReserva`.
}