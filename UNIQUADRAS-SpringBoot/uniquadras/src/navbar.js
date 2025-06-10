// src/navbar.js
document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const navbar = document.querySelector('.navbar-nav');
  const botaoLogin = document.getElementById('user-navbar')
  //const botaoReservar = document.getElementById('reservass')

  if (usuarioLogado) {
    const nome = usuarioLogado.user.nome || 'Usuário';
    const tipo = usuarioLogado.user.id_tipo_usuario;
    console.log(tipo)

    const nomeUsuario = document.createElement('li');
    nomeUsuario.classList.add('nav-item');
    nomeUsuario.innerHTML = `<a class="nav-link" href="#" id="linkPerfil">${nome}</a>`;
    console.log(usuarioLogado.user.nome)

    const logoutItem = document.createElement('li');
    logoutItem.classList.add('nav-item');
    logoutItem.innerHTML = `<a class="nav-link" href="#" id="logout">Sair</a>`;

    navbar.appendChild(nomeUsuario);
    navbar.appendChild(logoutItem);

    document.getElementById('linkPerfil').addEventListener('click', (e) => {
      e.preventDefault();
      if (tipo === "2") {
        window.location.href = '/painel-adm.html'; // Caminho para admins
      } else {
        window.location.href = '/minhas-reservas.html';  // Caminho para usuários comuns
      }
    });

    if (botaoLogin) botaoLogin.style.display = 'none';

    document.getElementById('logout').addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = '/login.html';
    });


  }
});
