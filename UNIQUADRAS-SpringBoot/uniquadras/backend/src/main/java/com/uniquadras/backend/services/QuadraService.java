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
        return quadraRepository.save(quadra);
    }

    public Optional<Quadra> atualizar(Long id, Quadra quadraAtualizada) {
        return quadraRepository.findById(id)
                .map(quadra -> {
                    quadra.setNome(quadraAtualizada.getNome());
                    quadra.setLocalizacao(quadraAtualizada.getLocalizacao());
                    quadra.setTipo(quadraAtualizada.getTipo());
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