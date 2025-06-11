// UNIQUADRAS-SpringBoot/uniquadras/src/navbar.js
document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const navbar = document.querySelector('.navbar-nav');
  const botaoLogin = document.getElementById('user-navbar')

  if (usuarioLogado) {
    const nome = usuarioLogado.user.nome || 'Usuário'; // Acessa o nome dentro de 'user'
    const tipo = usuarioLogado.user.idTipoUsuario; // Acessa o tipo usando 'idTipoUsuario' (camelCase)
    console.log(tipo)

    const nomeUsuario = document.createElement('li');
    nomeUsuario.classList.add('nav-item');
    nomeUsuario.innerHTML = `<a class="nav-link" href="#" id="linkPerfil">👤 ${nome.split(" ")[0]}</a>`; // Mostra só o primeiro nome
    console.log(usuarioLogado.user.nome)

    const logoutItem = document.createElement('li');
    logoutItem.classList.add('nav-item');
    logoutItem.innerHTML = `<a class="nav-link text-danger" href="#" id="logout">Sair</a>`;

    navbar.appendChild(nomeUsuario);
    navbar.appendChild(logoutItem);

    document.getElementById('linkPerfil').addEventListener('click', (e) => {
      e.preventDefault();
      if (tipo === 2) { // Compara com o número 2
        window.location.href = '/painel-adm.html';
      } else {
        window.location.href = '/minhas-reservas.html';
      }
    });

    if (botaoLogin) botaoLogin.style.display = 'none';

    document.getElementById('logout').addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = '/login.html';
    });
  }
});