// UNIQUADRAS-SpringBoot/uniquadras/backend/src/main/java/com/uniquadras/backend/services/UsuarioService.java
package com.uniquadras.backend.services;

import com.uniquadras.backend.models.Usuario;
import com.uniquadras.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder; // NOVO: Importar PasswordEncoder

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // NOVO: Injetar PasswordEncoder

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obterPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario criar(Usuario usuario) {
        usuario.setDataCadastro(LocalDateTime.now());
        if (usuario.getIdTipoUsuario() == null) {
            usuario.setIdTipoUsuario(1); // Define como usuário padrão se não for especificado
        }
        // MODIFICADO: Criptografa a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> atualizar(Long id, Usuario usuarioAtualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setEmail(usuarioAtualizado.getEmail());
                    usuario.setTelefone(usuarioAtualizado.getTelefone());
                    // Não atualizamos a senha aqui por segurança, geralmente há um endpoint separado para isso
                    return usuarioRepository.save(usuario);
                });
    }

    public boolean deletar(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Usuario> promoverParaAdmin(Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setIdTipoUsuario(2); // Assume que 2 é o ID para administrador
                    return usuarioRepository.save(usuario);
                });
    }

    // NOVO: Método para rebaixar um usuário para tipo comum
    public Optional<Usuario> rebaixarParaUsuario(Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setIdTipoUsuario(1); // Assume que 1 é o ID para usuário comum
                    return usuarioRepository.save(usuario);
                });
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
}