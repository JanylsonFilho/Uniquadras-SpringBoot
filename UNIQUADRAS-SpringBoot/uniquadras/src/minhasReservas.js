import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", async function () {
  const apiReservas = "http://localhost:3000/reservas";
  const apiQuadras = "http://localhost:3000/quadras";
  const apiHorarios = "http://localhost:3000/horarios";
  const listaReservas = document.getElementById("listaReservas");

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const usuarioId = usuarioLogado?.user?.id || usuarioLogado?.id;

  if (!usuarioId) {
    alert("Você precisa estar logado para ver suas reservas.");
    window.location.href = "login.html";
    return;
  }

  let quadras = [];
  let horarios = [];

  async function carregarDados() {
    try {
      const [quadrasRes, horariosRes] = await Promise.all([
        fetch(apiQuadras),
        fetch(apiHorarios)
      ]);
      quadras = await quadrasRes.json();
      horarios = await horariosRes.json();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  function obterNomeQuadra(idQuadra) {
    const quadra = quadras.find(q => q.id == idQuadra);
    return quadra ? quadra.nome : 'Quadra não encontrada';
  }

  function obterHorario(idHorario) {
    const horario = horarios.find(h => h.id == idHorario);
    return horario ? horario.horario : 'Horário não encontrado';
  }

  async function listarReservas() {
    try {
      const response = await fetch(`${apiReservas}?id_usuario=${usuarioId}`);
      if (!response.ok) throw new Error("Erro ao buscar reservas");

      const reservas = await response.json();

      if (reservas.length === 0) {
        listaReservas.innerHTML = `<p class="text-muted">Você ainda não fez nenhuma reserva.</p>`;
        return;
      }

      listaReservas.innerHTML = "";

      reservas.forEach(reserva => {
        const nomeQuadra = obterNomeQuadra(reserva.id_quadra);
        const horario = obterHorario(reserva.id_horario);
        const card = document.createElement("div");
        card.className = "col-md-6 mb-4";
        console.log(reserva.data)
        
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
              <p class="card-text text-dark"><strong>📅 Data:</strong> ${reserva.data}</p>
              <p class="card-text text-dark"><strong>⏰ Horário:</strong> ${horario}</p>
            </div>
          </div>
        `;
        console.log(nomeQuadra)

        // Evento para botão de cancelar
        card.querySelector('button').addEventListener('click', async () => {
          const confirmacao = confirm("Tem certeza que deseja cancelar esta reserva?");
          if (!confirmacao) return;

          try {
            const resp = await fetch(`${apiReservas}/${reserva.id}`, {
              method: 'DELETE'
            });

            if (!resp.ok) throw new Error("Erro ao cancelar reserva");

            alert("Reserva cancelada com sucesso!");
            listarReservas(); // Atualiza a lista
          } catch (error) {
            alert("Erro ao cancelar: " + error.message);
          }
        });

        listaReservas.appendChild(card);
      });

    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      listaReservas.innerHTML = `<p class="text-danger">Erro ao carregar reservas.</p>`;
    }
  }

  await carregarDados();
  await listarReservas();
});
