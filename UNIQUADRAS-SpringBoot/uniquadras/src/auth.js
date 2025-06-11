// UNIQUADRAS-SpringBoot/uniquadras/src/auth.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", function () {

    // Inicializa usuários padrão (pode ser removido se o backend gerenciar todos os usuários)
    // Se o banco de dados for persistente, esta inicialização local pode não ser necessária,
    // mas é mantida aqui para compatibilidade caso você ainda queira uma base de usuários local.
    // if (!localStorage.getItem("usuarios")) {
    //     const usuariosDefault = [
    //     {
    //         nome: "Administrador",
    //         email: "adm@unifor.br",
    //         telefone: "(85) 99999-9999",
    //         senha: "adm123",
    //         tipo: 2 // No Spring Boot, o tipo é um número
    //     },
    //     {
    //         nome: "João Silva",
    //         email: "joao@unifor.br",
    //         telefone: "(85) 98888-7777",
    //         senha: "joao123",
    //         tipo: 1
    //     }
    //     ];
    //     localStorage.setItem("usuarios", JSON.stringify(usuariosDefault));
    // }

    // Cadastro de novos usuários
    const formCadastro = document.getElementById("formCadastro");
    if (formCadastro) {
        formCadastro.addEventListener("submit", async function (e) {
            e.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim();
            const telefone = document.getElementById("telefone").value.trim();
            const senha = document.getElementById("senha").value.trim();

            if (!nome || !email || !telefone || !senha) {
                alert("Por favor, preencha todos os campos!");
                return;
            }

            const novoUsuario = {
                nome,
                email,
                telefone,
                senha,
                idTipoUsuario: 1 // No Spring Boot, o campo é 'idTipoUsuario' (camelCase) e é um número
            };

            try {
                // MUDANÇA AQUI: de 3000 para 8080
                const response = await fetch("http://localhost:8080/usuarios/cadastro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(novoUsuario),
                });

                if (response.ok) {
                    alert("Cadastro realizado com sucesso!");
                    window.location.href = "login.html";
                } else {
                    const error = await response.json();
                    // Melhora a mensagem de erro usando 'error' do backend ou statusText
                    alert(`Erro no cadastro: ${error.error || response.statusText}`);
                }
            } catch (err) {
                console.error("Erro ao cadastrar usuário:", err);
                alert("Erro ao conectar ao servidor.");
            }
        });
    }


    // Login de usuários
    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value.trim();
            if (!email || !senha) {
                alert("Por favor, preencha todos os campos!");
                return;
            }

            try {
                // MUDANÇA AQUI: de 3000 para 8080
                const response = await fetch("http://localhost:8080/usuarios/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha }),
                });

                if (response.ok) {
                    const { user, token } = await response.json();

                    // Armazena no localStorage
                    localStorage.setItem("usuarioLogado", JSON.stringify({ user, token }));

                    // Decide pela role com base em idTipoUsuario (camelCase) e como número
                    if (user.idTipoUsuario === 2) { // idTipoUsuario é um número no backend
                        alert(`Bem-vindo, ADM ${user.nome}!`);
                        window.location.href = "painel-adm.html";
                    } else {
                        alert(`Bem-vindo ao sistema de reservas, ${user.nome}!`);
                        window.location.href = "reservas.html";
                    }
                } else {
                    const error = await response.json();
                    // Melhora a mensagem de erro usando 'error' do backend ou statusText
                    alert(`Erro no login: ${error.error || response.statusText}`);
                }
            } catch (err) {
                console.error("Erro ao fazer login:", err);
                alert("Erro ao conectar ao servidor.");
            }
        });
    }
});