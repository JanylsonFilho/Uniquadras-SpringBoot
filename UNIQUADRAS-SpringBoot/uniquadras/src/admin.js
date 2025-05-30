// admin.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {
  renderizarListaQuadras,
  adicionarOuEditarQuadra,
  removerQuadra,
  preencherFormularioEdicao,
  inicializarFormularioQuadra
} from './quadras.js';

import {
  carregarHorariosAdm,
  formatarDataParaExibicao,
  atualizarReserva, // Esta função será refatorada ou usada de forma diferente
  buscarReservas, // Esta função será refatorada ou usada de forma diferente
  buscarQuadrasParaQuadro, // Será usada para popular o select de quadras no modal de horários
  adicionarOuEditarHorario, // NOVO
  removerHorario, // NOVO
  preencherFormularioEdicaoHorario, // NOVO
  renderizarListaQuadrasParaSelect // NOVO
} from './horarios.js';

document.addEventListener("DOMContentLoaded", async function () {
  const dataInputAdm = document.getElementById('dataSelecionada');
  const dataQuadroReservasSpan = document.getElementById('dataQuadroReservasTable');

  // NOVO: Elementos para o CRUD de Horário
  const btnAddHorario = document.getElementById('btnAddHorario');
  const modalHorario = new bootstrap.Modal(document.getElementById('modalHorario'));
  const formHorario = document.getElementById('formHorario');
  const horarioIdInput = document.getElementById('horarioId');
  const modalHorarioQuadraSelect = document.getElementById('modalHorarioQuadraSelect');
  const modalHorarioDataInput = document.getElementById('modalHorarioDataInput');
  const modalHorarioHoraInput = document.getElementById('modalHorarioHoraInput');
  const modalHorarioStatusSelect = document.getElementById('modalHorarioStatusSelect');


  // Inicializa lista de quadras e formulário
  await renderizarListaQuadras();
  inicializarFormularioQuadra();

  // Carrega os horários da data atual
  const dataAtual = new Date().toISOString().split("T")[0];
  dataInputAdm.value = dataAtual;
  dataQuadroReservasSpan.textContent = formatarDataParaExibicao(dataAtual);
  await carregarHorariosAdm(dataAtual);

  // Evento para mudança de data
  if (dataInputAdm) {
    dataInputAdm.addEventListener("change", async () => {
      const dataSelecionada = dataInputAdm.value;
      if (dataSelecionada) {
        dataQuadroReservasSpan.textContent = formatarDataParaExibicao(dataSelecionada);
        await carregarHorariosAdm(dataSelecionada);
      }
    });
  }

  // NOVO: Evento para abrir o modal de adicionar/editar horário
  if (btnAddHorario) {
    btnAddHorario.addEventListener('click', async () => {
      formHorario.reset(); // Limpa o formulário
      horarioIdInput.value = ''; // Garante que é uma criação
      modalHorarioDataInput.value = dataInputAdm.value; // Preenche a data com a data atual selecionada
      await renderizarListaQuadrasParaSelect(modalHorarioQuadraSelect); // Popula o select de quadras
      modalHorario.show();
    });
  }

  // NOVO: Evento para submeter o formulário do modal de horário
  if (formHorario) {
    formHorario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        id: horarioIdInput.value || undefined, // Se tiver ID, é edição
        id_quadra: modalHorarioQuadraSelect.value,
        data: modalHorarioDataInput.value,
        horario: modalHorarioHoraInput.value,
        status: modalHorarioStatusSelect.value,
      };
      await adicionarOuEditarHorario(data); // Chama a função CRUD de horários
      modalHorario.hide(); // Fecha o modal
      await carregarHorariosAdm(dataInputAdm.value); // Recarrega a tabela de horários
    });
  }
});