// UNIQUADRAS-SpringBoot/uniquadras/src/minhasReservas.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", async function () {
  // MUDANÇA AQUI: de 3000 para 8080 em todas as APIs
  const apiReservas = "http://localhost:8080/reservas";
  // apiQuadras e apiHorarios não são mais estritamente necessários para listar,
  // pois o DTO da Reserva já traz os nomes. Podem ser removidas se quiser.
  // const apiQuadras = "http://localhost:8080/quadras"; 
  // const apiHorarios = "http://localhost:8080/horarios"; 
  const listaReservas = document.getElementById("listaReservas");

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  // Pegando o ID do usuário diretamente do objeto 'user' dentro de 'usuarioLogado'
  const usuarioId = usuarioLogado?.user?.id;

  if (!usuarioId) {
    alert("Você precisa estar logado para ver suas reservas.");
    window.location.href = "login.html";
    return;
  }

  // As funções 'carregarDados', 'obterNomeQuadra' e 'obterHorario' podem ser removidas
  // pois o ReservaResponseDTO do backend já retorna os nomes e horários formatados.
  // let quadras = [];
  // let horarios = [];
  // async function carregarDados() { ... }
  // function obterNomeQuadra(idQuadra) { ... }
  // function obterHorario(idHorario) { ... }

  async function listarReservas() {
    try {
      // Usando o endpoint específico para listar reservas por usuário
      const response = await fetch(`${apiReservas}/usuario/${usuarioId}`);
      if (!response.ok) throw new Error("Erro ao buscar reservas");

      const reservas = await response.json(); // A resposta já é uma lista de ReservaResponseDTO

      if (reservas.length === 0) {
        listaReservas.innerHTML = `<p class="text-muted">Você ainda não fez nenhuma reserva.</p>`;
        return;
      }

      listaReservas.innerHTML = "";

      reservas.forEach(reserva => {
        // Usando os dados diretamente do DTO da reserva
        const nomeQuadra = reserva.nomeQuadra;
        const horarioReserva = reserva.horarioReserva;
        const dataReserva = reserva.dataReserva;

        const card = document.createElement("div");
        card.className = "col-md-6 mb-4";

        card.innerHTML = /*html*/`
          <div class="card border-primary">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <span>Reserva nº ${reserva.id}</span>
              <button class="btn btn-sm btn-danger" data-id="${reserva.id}">
                <i class="bi bi-x-circle"></i> Cancelar
              </button>
            </div>
            <div class="card-body text-dark">
              <h5 class="card-title text-dark">${nomeQuadra}</h5>
              <p class="card-text text-dark"><strong>📅 Data:</strong> ${dataReserva}</p>
              <p class="card-text text-dark"><strong>⏰ Horário:</strong> ${horarioReserva}</p>
            </div>
          </div>
        `;

        // Evento para botão de cancelar
        card.querySelector('button').addEventListener('click', async () => {
          const confirmacao = confirm("Tem certeza que deseja cancelar esta reserva?");
          if (!confirmacao) return;

          try {
            // Requisição DELETE para cancelar a reserva
            const resp = await fetch(`${apiReservas}/${reserva.id}`, {
              method: 'DELETE'
            });

            if (!resp.ok) {
              const errorData = await resp.json();
              throw new Error(errorData.error || "Erro ao cancelar reserva");
            }

            alert("Reserva cancelada com sucesso!");
            listarReservas(); // Atualiza a lista após o cancelamento
          } catch (error) {
            alert("Erro ao cancelar: " + error.message);
            console.error("Erro detalhado:", error);
          }
        });

        listaReservas.appendChild(card);
      });

    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      listaReservas.innerHTML = `<p class="text-danger">Erro ao carregar reservas.</p>`;
    }
  }

  // Removendo a chamada de carregarDados pois os nomes já vêm no DTO da reserva
  // await carregarDados(); 
  await listarReservas();
});