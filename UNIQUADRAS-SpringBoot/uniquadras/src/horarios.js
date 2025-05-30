const apiQuadras = "http://localhost:3000/quadras";
const apiReservas = "http://localhost:3000/reservas";
const apiHorarios = "http://localhost:3000/horarios";

export function formatarDataParaExibicao(dataString) {
  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Busca todas as quadras
export async function buscarQuadrasParaQuadro() {
  try {
    const res = await fetch(apiQuadras);
    if (!res.ok) throw new Error("Erro ao buscar quadras");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// NOVO: Função para popular o select de quadras em um formulário
export async function renderizarListaQuadrasParaSelect(selectElement) {
  try {
    const quadras = await buscarQuadrasParaQuadro();
    selectElement.innerHTML = '<option value="">Selecione a Quadra</option>';
    quadras.forEach(quadra => {
      const option = document.createElement('option');
      option.value = quadra.id;
      option.textContent = quadra.nome;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar quadras para o select:', error);
    alert('Erro ao carregar lista de quadras.');
  }
}

// Busca todos os horários para uma quadra e data
export async function buscarHorariosPorQuadraEData(idQuadra, data) {
  try {
    const res = await fetch(`${apiHorarios}?id_quadra=${idQuadra}&data=${data}`);
    if (!res.ok) throw new Error("Erro ao buscar horários");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Busca todas as reservas para uma data (opcionalmente por quadra)
export async function buscarReservas(data, idQuadra = null) {
  try {
    let url = `${apiReservas}?data=${data}`;
    if (idQuadra) url += `&id_quadra=${idQuadra}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao buscar reservas");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Atualiza (reserva/cancela) uma reserva pelo id do horário (mantido para compatibilidade com outros scripts)
export async function atualizarReserva(horarioId, acao) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const reservaData = {
    id_usuario: usuarioLogado?.user?.id || 0,
    id_horario: horarioId
  };

  try {
    let response;
    if (acao === "reservar") {
      response = await fetch(apiReservas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservaData)
      });
    } else {
      // Buscar reserva pelo id_horario para cancelar
      const reservas = await buscarReservasPorHorario(horarioId);
      const reserva = reservas[0]; // Assume que há apenas uma reserva por id_horario para simplificar
      if (!reserva) throw new Error("Reserva não encontrada para cancelar.");
      response = await fetch(`${apiReservas}/${reserva.id}`, { method: "DELETE" });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar reserva');
    }
  } catch (err) {
    alert("Erro ao atualizar reserva: " + (err.error || err.message));
    console.error("Erro detalhado:", err);
  }
}

// Busca reservas por id_horario
export async function buscarReservasPorHorario(idHorario) {
  try {
    const res = await fetch(`${apiReservas}?id_horario=${idHorario}`);
    if (!res.ok) throw new Error("Erro ao buscar reservas por horário");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Carrega a tabela de horários para o admin (dinamicamente)
export async function carregarHorariosAdm(dataSelecionada) {
  const tabelaCompleta = document.getElementById("reservasTable"); // AGORA BUSCA A TABELA COMPLETA PELO ID
  const thead = tabelaCompleta.querySelector('thead tr'); // BUSCA THEAD DENTRO DA TABELA COMPLETA
  const tbody = tabelaCompleta.querySelector('tbody'); // BUSCA TBODY DENTRO DA TABELA COMPLETA


  // 1. Buscar TODOS os horários para a data selecionada (de todas as quadras)
  let todosHorariosParaData = [];
  try {
    const responseAllHorarios = await fetch(`${apiHorarios}?data=${dataSelecionada}`);
    if (!responseAllHorarios.ok) throw new Error('Erro ao buscar todos os horários da data.');
    todosHorariosParaData = await responseAllHorarios.json();
  } catch (error) {
    console.error('Erro ao buscar todos os horários para a data:', error);
    alert('Erro ao carregar horários da data.');
    return;
  }

  // 2. Extrair e ordenar os horários únicos (intervalos de tempo)
  const horariosUnicos = [...new Set(todosHorariosParaData.map(h => h.horario))]
    .sort((a, b) => {
      // Função de ordenação mais robusta para "HH:MM - HH:MM"
      const timeA = parseInt(a.split(':')[0]);
      const timeB = parseInt(b.split(':')[0]);
      return timeA - timeB;
    });

  // 3. Construir o cabeçalho da tabela dinamicamente
  let headerHtml = '<th>Quadra</th>';
  horariosUnicos.forEach(horario => {
    headerHtml += `<th>${horario}</th>`;
  });
  thead.innerHTML = headerHtml;

  // 4. Construir o corpo da tabela
  const quadras = await buscarQuadrasParaQuadro();
  tbody.innerHTML = ""; // Limpa o corpo da tabela

  for (const quadra of quadras) {
    // Buscar horários ESPECÍFICOS desta quadra para a data selecionada
    const horariosQuadra = todosHorariosParaData.filter(h => h.id_quadra == quadra.id);

    let row = `<tr><th>${quadra.nome}</th>`;
    horariosUnicos.forEach(horarioPadrao => { // Iterar sobre os horários únicos para preencher as colunas
      const horarioObj = horariosQuadra.find(h => h.horario === horarioPadrao);

      let status = "Não Existe"; // Default se o horário não existir para esta quadra
      let btnClass = "btn-secondary"; // Cor neutra para "Não Existe"
      let horarioId = "";
      let disabledAttr = 'disabled'; // Desabilita botões se o horário não existe

      if (horarioObj) {
        horarioId = horarioObj.id;
        status = horarioObj.status;
        btnClass = status === "Disponível" ? "btn-disponivel" : "btn-indisponivel";
        disabledAttr = ''; // Habilita se o horário existe
      }

      row += `<td>
                <div class="d-flex flex-column align-items-center">
                    <button class="btn ${btnClass} w-100 mb-2" data-horario-id="${horarioId}" data-status="${status}" ${horarioId ? '' : 'disabled'}>
                        ${status}
                    </button>
                    <div class="d-flex gap-2">
                        <button class="btn btn-info btn-sm btn-editar-horario" data-horario-id="${horarioId}" ${disabledAttr}>
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-remover-horario" data-horario-id="${horarioId}" ${disabledAttr}>
                            <i class="bi bi-trash"></i> Remover
                        </button>
                    </div>
                </div>
              </td>`;
    });
    row += `</tr>`;
    tbody.innerHTML += row;
  }

  // Adiciona eventos aos botões de status
  document.querySelectorAll("#reservasTable button[data-horario-id][data-status]").forEach(btn => { // SELETOR AJUSTADO PARA #reservasTable
    btn.addEventListener("click", async (e) => {
      const horarioId = e.currentTarget.dataset.horarioId;
      const statusAtual = e.currentTarget.dataset.status;

      if (!horarioId) { // Se não há ID, o slot não existe no banco
        alert("Este horário não está cadastrado. Use 'Adicionar Novo Horário' para criá-lo.");
        return;
      }

      // Lógica para admins: alternar status
      const novoStatus = statusAtual === "Disponível" ? "Indisponível" : "Disponível";
      try {
          await fetch(`${apiHorarios}/${horarioId}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: novoStatus })
          });
          alert(`Status do horário ${horarioId} alterado para ${novoStatus}!`);
          await carregarHorariosAdm(document.getElementById("dataSelecionada").value); // Recarrega para refletir a mudança
      } catch (error) {
          console.error("Erro ao alternar status:", error);
          alert("Erro ao alterar status do horário.");
      }
    });
  });

  // Adiciona eventos aos botões de Editar e Remover (no final de carregarHorariosAdm)
  document.querySelectorAll(".btn-editar-horario").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const horarioId = e.currentTarget.dataset.horarioId;
      if (horarioId) { // Só edita se o horário existir
        await preencherFormularioEdicaoHorario(horarioId);
      }
    });
  });

  document.querySelectorAll(".btn-remover-horario").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const horarioId = e.currentTarget.dataset.horarioId;
      if (horarioId) { // Só remove se o horário existir
        await removerHorario(horarioId);
        await carregarHorariosAdm(document.getElementById("dataSelecionada").value); // Recarrega para refletir a remoção
      }
    });
  });
}

// NOVO: Função para adicionar ou editar um horário
export async function adicionarOuEditarHorario(horarioData) {
  try {
    const metodo = horarioData.id ? "PUT" : "POST";
    const url = horarioData.id ? `${apiHorarios}/${horarioData.id}` : apiHorarios;

    const response = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(horarioData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao salvar horário.');
    }
    alert("Horário salvo com sucesso!");
    // O recarregamento da tabela será feito em admin.js
  } catch (error) {
    alert("Erro ao salvar horário: " + error.message);
    console.error("Erro detalhado:", error);
  }
}

// NOVO: Função para remover um horário
export async function removerHorario(id) {
  if (!confirm("Deseja realmente remover este horário?")) return;
  try {
    const response = await fetch(`${apiHorarios}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao remover horário.');
    }
    alert("Horário removido com sucesso!");
    // O recarregamento da tabela será feito em admin.js
  } catch (error) {
    alert("Erro ao remover horário: " + error.message);
    console.error("Erro detalhado:", error);
  }
}

// NOVO: Função para preencher o formulário do modal para edição
export async function preencherFormularioEdicaoHorario(id) {
  try {
    const response = await fetch(`${apiHorarios}/${id}`);
    if (!response.ok) throw new Error("Horário não encontrado");
    const horario = await response.json();

    // Popula o select de quadras ANTES de tentar definir o valor
    await renderizarListaQuadrasParaSelect(document.getElementById('modalHorarioQuadraSelect'));

    // Preenche os campos do modal
    document.getElementById('horarioId').value = horario.id;
    document.getElementById('modalHorarioQuadraSelect').value = horario.id_quadra;
    document.getElementById('modalHorarioDataInput').value = horario.data.split('T')[0]; // Formata a data
    document.getElementById('modalHorarioHoraInput').value = horario.horario;
    document.getElementById('modalHorarioStatusSelect').value = horario.status;

    // Abre o modal
    const modalHorario = new bootstrap.Modal(document.getElementById('modalHorario'));
    modalHorario.show();
  } catch (err) {
    alert("Erro ao carregar dados do horário para edição: " + err.message);
    console.error("Erro detalhado:", err);
  }
}