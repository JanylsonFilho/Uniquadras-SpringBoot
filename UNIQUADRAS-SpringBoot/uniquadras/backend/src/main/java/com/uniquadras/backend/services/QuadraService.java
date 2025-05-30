package com.uniquadras.backend.services;

import com.uniquadras.backend.models.Quadra;
import com.uniquadras.backend.repositories.QuadraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuadraService {

    @Autowired
    private QuadraRepository quadraRepository;

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
        // Se a localização não for fornecida, pode definir um valor padrão ou lançar exceção
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
                    quadra.setStatus(quadraAtualizada.getStatus()); // Permitir atualização do status
                    return quadraRepository.save(quadra);
                });
    }

    public boolean deletar(Long id) {
        if (quadraRepository.existsById(id)) {
            quadraRepository.deleteById(id);
            return true;
        }
        return false;
    }
}