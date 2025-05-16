package com.uniquadras.backend.repositories;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uniquadras.backend.models.Quadra;

@Repository
public interface QuadraRepository extends JpaRepository<Quadra, Long> {
    // Você pode adicionar métodos de consulta personalizados aqui, se necessário.
    // Por exemplo, para buscar quadras por nome ou tipo, se precisar.
}