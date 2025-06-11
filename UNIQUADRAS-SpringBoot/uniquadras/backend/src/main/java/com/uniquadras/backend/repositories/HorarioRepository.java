// UNIQUADRAS-SpringBoot/uniquadras/backend/src/main/java/com/uniquadras/backend/repositories/HorarioRepository.java
package com.uniquadras.backend.repositories;

import com.uniquadras.backend.models.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {
    List<Horario> findByDataAndQuadraId(LocalDate data, Long idQuadra);
    List<Horario> findByData(LocalDate data);
    Optional<Horario> findByQuadraIdAndDataAndHorario(Long quadraId, LocalDate data, String horario);

    // NOVO: Método para buscar horários por ID da quadra
    List<Horario> findByQuadraId(Long quadraId);
}