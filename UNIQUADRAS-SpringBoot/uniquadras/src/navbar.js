// src/navbar.js
document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const navbar = document.querySelector('.navbar-nav');
  const botaoLogin = document.getElementById('user-navbar')
  //const botaoReservar = document.getElementById('reservass')

  if (usuarioLogado) {
    const nome = usuarioLogado.user.nome || 'Usuário';

    const nomeUsuario = document.createElement('li');
    nomeUsuario.classList.add('nav-item');
    nomeUsuario.innerHTML = `<a class="nav-link" href="#">${nome}</a>`;
    console.log(usuarioLogado.user.nome)

    const logoutItem = document.createElement('li');
    logoutItem.classList.add('nav-item');
    logoutItem.innerHTML = `<a class="nav-link" href="#" id="logout">Sair</a>`;

    navbar.appendChild(nomeUsuario);
    navbar.appendChild(logoutItem);

    if (botaoLogin) botaoLogin.style.display = 'none';

    document.getElementById('logout').addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = '/login.html';
    });


  }
});