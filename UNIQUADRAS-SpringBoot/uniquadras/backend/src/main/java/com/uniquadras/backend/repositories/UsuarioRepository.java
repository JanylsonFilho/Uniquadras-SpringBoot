package com.uniquadras.backend.repositories;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uniquadras.backend.models.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Você pode adicionar métodos de consulta personalizados aqui, se necessário.
    // Por exemplo, para buscar usuários por email:
    // Optional<Usuario> findByEmail(String email);
}