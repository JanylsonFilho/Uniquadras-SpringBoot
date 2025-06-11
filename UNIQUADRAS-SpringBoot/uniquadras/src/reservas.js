// UNIQUADRAS-SpringBoot/uniquadras/src/reservas.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", async function () {
  const tipoQuadraSelect = document.getElementById('tipoQuadra');
  const esporteSelect = document.getElementById('esporte');
  const quadraSelect = document.getElementById('quadra');
  const dataInput = document.getElementById('data');
  const horarioSelect = document.getElementById('horario');
  const reservaForm = document.getElementById('reservaForm');

  // MUDANÇA AQUI: de 3000 para 8080 em todas as APIs
  const apiQuadras = "http://localhost:8080/quadras";
  const apiReservas = "http://localhost:8080/reservas";
  const apiHorarios = "http://localhost:8080/horarios";

  let todasQuadras = [];
  let horariosDisponiveis = [];

  async function carregarTodasQuadras() {
    try {
      const response = await fetch(apiQuadras);
      if (!response.ok) throw new Error('Erro ao buscar quadras.');
      todasQuadras = await response.json();
    } catch (error) {
      console.error('Erro ao carregar quadras:', error);
      alert('Erro ao carregar quadras disponíveis.');
    }
  }

  function popularQuadrasPorTipo() {
    const tipoSelecionado = tipoQuadraSelect.value;
    quadraSelect.innerHTML = '<option value="">Selecione</option>';

    // Filtra quadras pelo tipo e status 'Ativa'
    const quadrasFiltradas = todasQuadras.filter(q => q.tipo === tipoSelecionado && q.status === 'Ativa');
    if (quadrasFiltradas.length > 0) {
      quadrasFiltradas.forEach(quadra => {
        const option = document.createElement('option');
        option.value = quadra.id;
        option.textContent = quadra.nome;
        quadraSelect.appendChild(option);
      });
    } else {
      quadraSelect.innerHTML = '<option value="">Nenhuma quadra disponível para este tipo</option>';
    }
    horarioSelect.innerHTML = '<option value="">Selecione a data e a quadra primeiro</option>';
  }

  const esportesPorQuadraTipo = {
    "Aberta": ["Futevôlei", "Beach Tênis", "Vôlei de Praia"],
    "Fechada": ["Futsal", "Basquete", "Vôlei", "Handball", "Tênis"]
  };

  tipoQuadraSelect.addEventListener('change', () => {
    popularQuadrasPorTipo();
    const tipoSelecionado = tipoQuadraSelect.value;
    esporteSelect.innerHTML = '<option value="">Selecione</option>';
    if (esportesPorQuadraTipo[tipoSelecionado]) {
      esportesPorQuadraTipo[tipoSelecionado].forEach(esporte => {
        const option = document.createElement('option');
        option.value = esporte;
        option.textContent = esporte;
        esporteSelect.appendChild(option);
      });
    }
  });

  async function atualizarHorariosDisponiveis() {
    const dataSelecionada = dataInput.value;
    const quadraIdSelecionada = quadraSelect.value;
    horarioSelect.innerHTML = '<option value="">Selecione</option>';
    horariosDisponiveis = [];

    if (!dataSelecionada || !quadraIdSelecionada) {
      horarioSelect.innerHTML = '<option value="">Selecione a data e a quadra primeiro</option>';
      return;
    }

    try {
      // Busca horários com data e id_quadra
      const response = await fetch(`${apiHorarios}?data=${dataSelecionada}&id_quadra=${quadraIdSelecionada}`);
      if (!response.ok) throw new Error('Erro ao buscar horários disponíveis.');
      const horariosObj = await response.json();

      // A resposta do Spring Boot para Horários é diretamente uma lista de objetos Horario.
      // A linha abaixo pode ser simplificada pois não há 'rows' como em alguns backends Node.js.
      // const horarios = Array.isArray(horariosObj) ? horariosObj : horariosObj.rows || [];
      const horarios = horariosObj; // Simplificado

      // Filtra apenas horários com status "Disponível"
      horariosDisponiveis = horarios.filter(h => h.status === "Disponível");

      if (horariosDisponiveis.length === 0) {
        horarioSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
        return;
      }

      horariosDisponiveis.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario.id; // Agora value é o id do horário!
        option.textContent = horario.horario;
        horarioSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao obter horários disponíveis:', error);
      horarioSelect.innerHTML = '<option value="">Erro ao carregar horários</option>';
    }
  }

  dataInput.addEventListener('change', atualizarHorariosDisponiveis);
  quadraSelect.addEventListener('change', atualizarHorariosDisponiveis);

  reservaForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const idQuadra = quadraSelect.value;
    const esporte = esporteSelect.value; // O esporte pode ser uma informação do frontend
    const data = dataInput.value;
    const idHorario = horarioSelect.value;

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    // No Spring Boot, o objeto de usuário logado tem o ID diretamente em user.id
    const usuarioId = usuarioLogado?.user?.id;

    if (!usuarioId) {
      alert("Você precisa estar logado para fazer uma reserva.");
      window.location.href = "login.html";
      return;
    }

    if (!idQuadra || !esporte || !data || !idHorario) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const quadraReservada = todasQuadras.find(q => q.id == idQuadra); // Encontra a quadra pelo ID
    const horarioSelecionado = horariosDisponiveis.find(h => h.id == idHorario); // Encontra o horário pelo ID

    try {
      // Faz a requisição POST para criar a reserva
      const response = await fetch(apiReservas, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuarioId, // ID do usuário logado
          id_quadra: idQuadra, // ID da quadra selecionada
          id_horario: idHorario // ID do horário selecionado
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar reserva');
      }

      const reserva = await response.json(); // A resposta é o DTO de Reserva
      alert(`✅ Reserva confirmada!\n🟢 Quadra: ${reserva.nomeQuadra}\n🏅 Esporte: ${esporte}\n📅 Data: ${reserva.dataReserva}\n⏰ Horário: ${reserva.horarioReserva}`);
      // Atualiza os horários disponíveis após a reserva para refletir a mudança de status
      atualizarHorariosDisponiveis();
    } catch (error) {
      alert('Erro ao criar reserva: ' + error.message);
    }
  });

  await carregarTodasQuadras();
});