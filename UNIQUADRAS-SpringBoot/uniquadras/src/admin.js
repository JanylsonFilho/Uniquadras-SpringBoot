// UNIQUADRAS-SpringBoot/uniquadras/src/admin.js
import * as bootstrap from 'bootstrap'; // Adicione ou confirme esta linha
import 'bootstrap/dist/css/bootstrap.min.css';
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
  // As funções atualizarReserva e buscarReservas deste módulo NÃO são mais usadas diretamente aqui,
  // pois a lógica de status e remoção de horários é tratada pelo backend de Horarios.
  // atualizarReserva, 
  // buscarReservas, 
  buscarQuadrasParaQuadro, 
  adicionarOuEditarHorario, 
  removerHorario, 
  preencherFormularioEdicaoHorario, 
  renderizarListaQuadrasParaSelect 
} from './horarios.js';

document.addEventListener("DOMContentLoaded", async function () {
  const dataInputAdm = document.getElementById('dataSelecionada');
  const dataQuadroReservasSpan = document.getElementById('dataQuadroReservasTable');

  // Elementos para o CRUD de Horário
  const btnAddHorario = document.getElementById('btnAddHorario');
  const modalHorario = new bootstrap.Modal(document.getElementById('modalHorario'));
  const formHorario = document.getElementById('formHorario');
  const horarioIdInput = document.getElementById('horarioId');
  const modalHorarioQuadraSelect = document.getElementById('modalHorarioQuadraSelect');
  const modalHorarioDataInput = document.getElementById('modalHorarioDataInput');
  const modalHorarioHoraInput = document.getElementById('modalHorarioHoraInput');
  const modalHorarioStatusSelect = document.getElementById('modalHorarioStatusSelect');

  // Elementos para o CRUD de Usuário
  const btnGerenciarUsuarios = document.getElementById('btnGerenciarUsuarios'); // NOVO: Obtenha o botão por ID
  let todosUsuarios = [];
  const apiUsuarios = "http://localhost:8080/usuarios"; // MUDANÇA AQUI: URL da API de usuários

  async function carregarUsuarios() {
    try {
      // MUDANÇA AQUI: Use apiUsuarios diretamente sem adicionar barra final extra
      const res = await fetch(apiUsuarios); 
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Erro HTTP: ${res.status}`); // Mensagem de erro mais detalhada
      }
      todosUsuarios = await res.json();
      exibirUsuarios(todosUsuarios);
    } catch (err) {
      console.error('Erro ao carregar usuários', err);
      alert('Erro ao carregar usuários: ' + err.message);
    }
  }

  function exibirUsuarios(lista) {
    const ul = document.getElementById('listaUsuarios');
    ul.innerHTML = '';

    lista.forEach(usuario => {
      const li = document.createElement('li');
      li.className = 'list-group-item list-group-item-action';
      li.textContent = `${usuario.nome} (${usuario.email})`;
      li.style.cursor = 'pointer';
      li.onclick = () => selecionarUsuario(usuario);
      ul.appendChild(li);
    });
  }

  document.getElementById('buscaUsuario').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = todosUsuarios.filter(u =>
      u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo)
    );
    exibirUsuarios(filtrados);
  });

  function selecionarUsuario(usuario) {
      console.log('Selecionado:', usuario);
    document.getElementById('usuarioId').value = usuario.id;
    document.getElementById('usuarioNome').value = usuario.nome;
    document.getElementById('usuarioEmail').value = usuario.email;
    document.getElementById('usuarioTipo').value = usuario.idTipoUsuario; // O campo é 'idTipoUsuario' no Spring Boot
    document.getElementById('formUsuarioSelecionado').style.display = 'block';
  }

  document.getElementById('formUsuarioSelecionado').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('usuarioId').value;
    const tipo = parseInt(document.getElementById('usuarioTipo').value); 

    const rota = tipo === 2 
      ? `${apiUsuarios}/promover/${id}` 
      : `${apiUsuarios}/rebaixar/${id}`; 

    try {
      console.log("Enviando para:", rota);
      const response = await fetch(rota, { method: 'PUT' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }
      alert('Usuário atualizado!');
      await carregarUsuarios(); // Atualiza a lista
    } catch (err) {
      console.error('Erro ao atualizar usuário', err);
      alert('Erro ao atualizar usuário: ' + err.message);
    }
  });

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

  // Evento para abrir o modal de adicionar/editar horário
  if (btnAddHorario) {
    btnAddHorario.addEventListener('click', async () => {
      formHorario.reset(); 
      horarioIdInput.value = ''; 
      modalHorarioDataInput.value = dataInputAdm.value; 
      await renderizarListaQuadrasParaSelect(modalHorarioQuadraSelect); 
      modalHorario.show();
    });
  }

  // Evento para submeter o formulário do modal de horário
  if (formHorario) {
    formHorario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        id: horarioIdInput.value || undefined, 
        quadra: { id: parseInt(modalHorarioQuadraSelect.value) }, 
        data: modalHorarioDataInput.value,
        horario: modalHorarioHoraInput.value,
        status: modalHorarioStatusSelect.value,
      };
      await adicionarOuEditarHorario(data); 
      modalHorario.hide(); 
      await carregarHorariosAdm(dataInputAdm.value); 
    });
  }

  // Chamada para carregar usuários quando o modal é aberto
  const modalUsuarioElement = document.getElementById('modalUsuario');
  if (modalUsuarioElement) {
      modalUsuarioElement.addEventListener('show.bs.modal', carregarUsuarios);
  }

}); // Fim do DOMContentLoaded