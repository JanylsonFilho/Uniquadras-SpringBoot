// src/minhasReservas.js
document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado) {
    window.location.href = '/login.html';
    return;
  }

  fetch(`/reservas/usuario/${usuarioLogado.id}`)
    .then(response => response.json())
    .then(reservas => {
      const container = document.getElementById('reservasContainer');
      if (reservas.length === 0) {
        container.innerHTML = '<p class="text-center">Nenhuma reserva encontrada.</p>';
        return;
      }

      reservas.forEach(reserva => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'text-dark');
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${reserva.quadra}</h5>
            <p class="card-text">Esporte: ${reserva.esporte}</p>
            <p class="card-text">Data: ${reserva.data_reserva}</p>
            <p class="card-text">Horário: ${reserva.horario}</p>
            <button class="btn btn-danger" data-id="${reserva.id}">Cancelar</button>
          </div>
        `;
        container.appendChild(card);
      });

      container.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          const reservaId = e.target.getAttribute('data-id');
          fetch(`/reservas/${reservaId}`, {
            method: 'DELETE'
          })
          .then(response => {
            if (response.ok) {
              e.target.closest('.card').remove();
            } else {
              alert('Erro ao cancelar a reserva.');
            }
          });
        }
      });
    });
});