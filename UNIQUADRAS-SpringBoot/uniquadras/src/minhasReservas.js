// src/minhasReservas.js
document.addEventListener('DOMContentLoaded', async () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado || !usuarioLogado.user || !usuarioLogado.user.id) {
    window.location.href = '/login.html';
    return;
  }

  const userId = usuarioLogado.user.id; // Certifique-se de que o ID do usuário está correto

  try {
    const response = await fetch(`http://localhost:8080/reservas/usuario/${userId}`); // URL ATUALIZADA
    if (response.status === 204) { // No Content, ou seja, nenhuma reserva
      document.getElementById('reservasContainer').innerHTML = '<p class="text-center">Nenhuma reserva encontrada.</p>';
      return;
    }
    if (!response.ok) {
      throw new Error('Erro ao buscar suas reservas.');
    }
    const reservas = await response.json();
    const container = document.getElementById('reservasContainer');

    if (reservas.length === 0) {
      container.innerHTML = '<p class="text-center">Nenhuma reserva encontrada.</p>';
      return;
    }

    // Ordenar as reservas por data e depois por horário
    reservas.sort((a, b) => {
        const dateA = new Date(a.dataReserva.split('/').reverse().join('-') + 'T' + a.horarioReserva.split(' - ')[0] + ':00');
        const dateB = new Date(b.dataReserva.split('/').reverse().join('-') + 'T' + b.horarioReserva.split(' - ')[0] + ':00');
        return dateA - dateB;
    });


    reservas.forEach(reserva => {
      const card = document.createElement('div');
      card.classList.add('card', 'mb-3', 'text-dark', 'col-md-5', 'mx-2'); // Adiciona colunas para layout
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Quadra: ${reserva.nomeQuadra} (${reserva.tipoQuadra})</h5>
          <p class="card-text">Data: ${reserva.dataReserva}</p>
          <p class="card-text">Horário: ${reserva.horarioReserva}</p>
          <button class="btn btn-danger btn-cancelar-reserva" data-id="${reserva.id}">Cancelar Reserva</button>
        </div>
      `;
      container.appendChild(card);
    });

    container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-cancelar-reserva')) {
        const reservaId = e.target.getAttribute('data-id');
        if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
          try {
            const response = await fetch(`http://localhost:8080/reservas/${reservaId}`, { // URL ATUALIZADA
              method: 'DELETE'
            });

            if (response.ok) {
              alert('Reserva cancelada com sucesso!');
              e.target.closest('.card').remove();
              // Se não houver mais reservas, exiba a mensagem
              if (container.children.length === 0) {
                 container.innerHTML = '<p class="text-center">Nenhuma reserva encontrada.</p>';
              }
            } else {
              const errorData = await response.json();
              alert('Erro ao cancelar a reserva: ' + (errorData.error || 'Erro desconhecido'));
            }
          } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
            alert('Erro ao conectar ao servidor para cancelar a reserva.');
          }
        }
      }
    });

  } catch (error) {
    console.error('Erro ao carregar minhas reservas:', error);
    document.getElementById('reservasContainer').innerHTML = `<p class="text-center text-danger">Erro ao carregar reservas: ${error.message}</p>`;
  }
});