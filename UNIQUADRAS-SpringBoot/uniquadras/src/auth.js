import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", function () {

  // Remova esta inicialização de usuários padrão, pois agora o backend gerencia
  // if (!localStorage.getItem("usuarios")) {
  //     const usuariosDefault = [ ... ];
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
        idTipoUsuario: 1 // Spring Boot vai definir como 1 por padrão no service
      };

      try {
        const response = await fetch("http://localhost:8080/usuarios/cadastro", { // URL ATUALIZADA
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoUsuario),
        });

        if (response.ok) {
          alert("Cadastro realizado com sucesso!");
          window.location.href = "login.html";
        } else {
          const errorData = await response.json(); // Pega a mensagem de erro do backend
          alert(`Erro no cadastro: ${errorData.error || 'Erro desconhecido'}`);
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
        const response = await fetch("http://localhost:8080/usuarios/login", { // URL ATUALIZADA
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });

        if (response.ok) {
          const { user, token } = await response.json();

          // Ajuste para acessar o idTipoUsuario corretamente (camelCase)
          localStorage.setItem("usuarioLogado", JSON.stringify({ user, token }));

          if (user.idTipoUsuario === 2) { // Verifique se é 2 para ADM
            alert(`Bem-vindo, ADM ${user.nome}!`);
            window.location.href = "painel-adm.html";
          } else {
            alert(`Bem-vindo ao sistema de reservas, ${user.nome}!`);
            window.location.href = "reservas.html";
          }
        } else {
          const errorData = await response.json();
          alert(`Erro no login: ${errorData.error}`);
        }
      } catch (err) {
        console.error("Erro ao fazer login:", err);
        alert("Erro ao conectar ao servidor.");
      }
    });
  }
});