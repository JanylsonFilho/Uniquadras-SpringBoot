// src/navbar.js
document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const userNavbarElement = document.getElementById('user-navbar');

  if (usuarioLogado && usuarioLogado.user && usuarioLogado.user.nome) {
    const nomeCurto = usuarioLogado.user.nome.split(" ")[0];
    const userType = usuarioLogado.user.idTipoUsuario === 2 ? 'ADM' : 'Usuário';
    const linkPainelAdm = usuarioLogado.user.idTipoUsuario === 2 ? '<li><a class="dropdown-item" href="painel-adm.html">Painel Admin</a></li>' : '';
    const linkMinhasReservas = usuarioLogado.user.idTipoUsuario === 1 ? '<li><a class="dropdown-item" href="minhasReservas.html">Minhas Reservas</a></li>' : '';

    userNavbarElement.innerHTML = `
      <div class="dropdown">
        <a class="nav-link dropdown-toggle text-white" href="#" id="usuarioMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          👤 ${nomeCurto} (${userType})
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#">Perfil</a></li>
          ${linkMinhasReservas}
          ${linkPainelAdm}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Sair</a></li>
        </ul>
      </div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    });
  } else {
    userNavbarElement.innerHTML = `<a class="nav-link" href="login.html">Login</a>`;
  }
});