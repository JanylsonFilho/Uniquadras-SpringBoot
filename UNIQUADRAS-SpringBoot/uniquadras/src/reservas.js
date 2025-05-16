
  const tipoQuadraSelect = document.getElementById('tipoQuadra');
  const esporteSelect = document.getElementById('esporte');
  const quadraSelect = document.getElementById('quadra');
  const dataInput = document.getElementById('data');
  const horarioSelect = document.getElementById('horario');

  const quadrasPorTipo = {
    Aberta: ["Quadra Areia 1", "Quadra Areia 2", "Quadra Externa"],
    Fechada: ["Ginásio A", "Ginásio B", "Quadra Interna"]
  };

  const esportesPorQuadra = {
    Aberta: ["Futevôlei", "Beach Tênis", "Vôlei de Praia"],
    Fechada: ["Futsal", "Basquete", "Vôlei", "Handball"]
  };

  tipoQuadraSelect.addEventListener('change', () => {
    const tipoSelecionado = tipoQuadraSelect.value;

        // Atualiza quadras
    quadraSelect.innerHTML = '<option value="">Selecione</option>';
    if (quadrasPorTipo[tipoSelecionado]) {
      quadrasPorTipo[tipoSelecionado].forEach(quadra => {
        const option = document.createElement('option');
        option.value = quadra;
        option.textContent = quadra;
        quadraSelect.appendChild(option);
      });
    } else {
      quadraSelect.innerHTML = '<option value="">Nenhuma quadra disponível</option>';
    }

        // Atualiza esportes
      esporteSelect.innerHTML = '<option value="">Selecione</option>';
      if (esportesPorQuadra[tipoSelecionado]) {
        esportesPorQuadra[tipoSelecionado].forEach(esporte => {
          const option = document.createElement('option');
          option.value = esporte;
          option.textContent = esporte;
          esporteSelect.appendChild(option);
        });
      }
    });

    // Limpa opções anteriores
    esporteSelect.innerHTML = '<option value="">Selecione</option>';

    if (esportesPorQuadra[tipoSelecionado]) {
      esportesPorQuadra[tipoSelecionado].forEach(esporte => {
        const option = document.createElement('option');
        option.value = esporte;
        option.textContent = esporte;
        esporteSelect.appendChild(option);
      });
    }


function atualizarHorariosDisponiveis() {
  const dataSelecionada = dataInput.value;
  const quadraSelecionada = quadraSelect.value;

  if (!dataSelecionada || !quadraSelecionada) {
    horarioSelect.innerHTML = '<option value="">Selecione a data e a quadra primeiro</option>';
    return;
  }

  // Aqui você faria uma requisição ao backend para obter os horários disponíveis
  // Exemplo de requisição usando fetch:
  fetch(`/api/horarios-disponiveis?data=${dataSelecionada}&quadra=${encodeURIComponent(quadraSelecionada)}`)
    .then(response => response.json())
    .then(horarios => {
      horarioSelect.innerHTML = '<option value="">Selecione</option>';
      horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        horarioSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Erro ao obter horários disponíveis:', error);
      horarioSelect.innerHTML = '<option value="">Erro ao carregar horários</option>';
    });
}

dataInput.addEventListener('change', atualizarHorariosDisponiveis);
quadraSelect.addEventListener('change', atualizarHorariosDisponiveis);

  // Validação final + mensagem
document.getElementById('reservaForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const tipoQuadra = document.getElementById('tipoQuadra').value;
  const quadra = quadraSelect.value;
  const esporte = document.getElementById('esporte').value;
  const data = dataInput.value;
  const horario = horarioSelect.value;

  if (!tipoQuadra || !quadra || !esporte || !data || !horario) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  alert(`✅ Reserva confirmada!
🟢 Tipo de Quadra: ${tipoQuadra}
🏟️ Quadra: ${quadra}
🏅 Esporte: ${esporte}
📅 Data: ${data}
⏰ Horário: ${horario}`);
});

