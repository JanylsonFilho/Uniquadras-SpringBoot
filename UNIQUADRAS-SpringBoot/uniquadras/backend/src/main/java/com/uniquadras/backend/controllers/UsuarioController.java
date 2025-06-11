package com.uniquadras.backend.controllers;

import com.uniquadras.backend.models.Usuario;
import com.uniquadras.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder; // Adicione este import!

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173") 
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired // Adicione esta injeção do PasswordEncoder
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obterUsuario(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.obterPorId(id);
        return usuario.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario) {
        Optional<Usuario> existingUser = usuarioService.buscarPorEmail(usuario.getEmail());
        if (existingUser.isPresent()) {
            return new ResponseEntity<>(Map.of("error", "Email já cadastrado."), HttpStatus.CONFLICT);
        }
        Usuario novoUsuario = usuarioService.criar(usuario); // A senha já será criptografada no serviço
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        if (email == null || senha == null) {
            return new ResponseEntity<>(Map.of("error", "Email e senha são obrigatórios."), HttpStatus.BAD_REQUEST);
        }

        Optional<Usuario> usuarioOptional = usuarioService.buscarPorEmail(email);

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            // MODIFICADO: Use passwordEncoder.matches() para verificar a senha
            if (passwordEncoder.matches(senha, usuario.getSenha())) {
                // Senha correta
                return new ResponseEntity<>(Map.of("user", usuario, "token", "fake-token"), HttpStatus.OK);
            } else {
                // Senha incorreta (inclui casos onde a senha armazenada não é criptografada e não corresponde)
                return new ResponseEntity<>(Map.of("error", "Senha incorreta."), HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(Map.of("error", "Usuário não encontrado com este email."), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado) {
        Optional<Usuario> usuario = usuarioService.atualizar(id, usuarioAtualizado);
        return usuario.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        if (usuarioService.deletar(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/promover/{id}")
    public ResponseEntity<Usuario> promoverUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioPromovido = usuarioService.promoverParaAdmin(id);
        return usuarioPromovido.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/rebaixar/{id}")
    public ResponseEntity<Usuario> rebaixarUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioRebaixado = usuarioService.rebaixarParaUsuario(id);
        return usuarioRebaixado.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}