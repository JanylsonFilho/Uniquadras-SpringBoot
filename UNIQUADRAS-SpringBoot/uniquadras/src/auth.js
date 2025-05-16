
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", function () {

        // Inicializa usuários padrão
    if (!localStorage.getItem("usuarios")) {
        const usuariosDefault = [
        {
            nome: "Administrador",
            email: "adm@unifor.br",
            telefone: "(85) 99999-9999",
            senha: "adm123",
            tipo: "adm"
        },
        {
            nome: "João Silva",
            email: "joao@unifor.br",
            telefone: "(85) 98888-7777",
            senha: "joao123",
            tipo: "usuario"
        }
        ];
        localStorage.setItem("usuarios", JSON.stringify(usuariosDefault));
    }



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
        tipo: "usuario"
      };

     
    try {
      const response = await fetch("http://localhost:3000/usuarios/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
      } else {
        const error = await response.json();
        alert(`Erro no cadastro: ${error.message}`);
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
        const response = await fetch("http://localhost:3000/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });
  
        if (response.ok) {
          const usuario = await response.json();
          localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  
          if (usuario.tipo === "adm") {
            alert(`Bem-vindo, ADM ${usuario.nome}!`);
            window.location.href = "painel-adm.html";
          } else {
            alert(`Bem-vindo ao sistema de reservas, ${usuario.nome}!`);
            window.location.href = "horarios-disponiveis.html";
          }
        } else {
          const error = await response.json();
          alert(`Erro no login: ${error.message}`);
        }
      } catch (err) {
        console.error("Erro ao fazer login:", err);
        alert("Erro ao conectar ao servidor.");
      }
    });
  }


});