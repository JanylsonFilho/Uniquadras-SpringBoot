// UNIQUADRAS-SpringBoot/uniquadras/src/horarios.js
// MUDANÇA AQUI: de 3000 para 8080 em todas as APIs
const apiQuadras = "http://localhost:8080/quadras";
const apiReservas = "http://localhost:8080/reservas";
const apiHorarios = "http://localhost:8080/horarios";

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

// Função para popular o select de quadras em um formulário
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
// Esta função pode não ser mais tão necessária pois o painel do ADM
// agora manipula diretamente os horários, e não as reservas para mudar status.
export async function buscarReservas(data, idQuadra = null) {
  try {
    let url = `${apiReservas}`; // MUDANÇA: Spring Boot retorna DTOs com todos os dados
    if (idQuadra) url += `/quadra/${idQuadra}`; // Exemplo de rota, se houvesse uma
    if (data) url += `?data=${data}`; // Filtro por data

    // A rota /reservas no Spring Boot lista tudo. Para filtrar por data ou quadra,
    // seria necessário implementar um método de busca no ReservaController.
    // Atualmente, ele lista todas as reservas ou por id de usuário.
    // Para o quadro de reservas, é melhor gerenciar pelos horários.
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao buscar reservas");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Esta função `atualizarReserva` deve ser descontinuada ou refatorada,
// pois a lógica de status do horário agora é feita via PATCH em /horarios/{id}/status.
// A remoção de reserva também é direta via DELETE em /reservas/{id}.
// Ela está mantida aqui para evitar quebrar outras partes se ainda houver referências,
// mas seu uso principal no ADM será substituído.
export async function atualizarReserva(horarioId, acao) {
  // A lógica de "reserva" pelo lado do admin agora é feita pelo status do horário.
  // A ação "cancelar" uma reserva é feita pelo ID da RESERVA, não do horário.
  // Esta função precisa ser revisada ou removida de contextos admin.
  alert("Atenção: Esta função (atualizarReserva) não deve ser usada no painel ADM para alterar status.");
  console.warn("Função 'atualizarReserva' chamada, mas a lógica de status de horário mudou. Use o endpoint PATCH do HorarioController.");
  // Exemplo de como seria para CANCELAR UMA RESERVA específica se tivéssemos o ID da reserva:
  // if (acao === "cancelar") {
  //   const reservaIdParaCancelar = ...; // Precisaríamos do ID da reserva, não do horário
  //   try {
  //     const response = await fetch(`${apiReservas}/${reservaIdParaCancelar}`, { method: "DELETE" });
  //     if (!response.ok) throw new Error("Erro ao cancelar reserva.");
  //     alert("Reserva cancelada com sucesso!");
  //   } catch (error) {
  //     alert("Erro ao cancelar reserva: " + error.message);
  //   }
  // }
}


// Busca reservas por id_horario (pode não ser mais necessária se o admin manipula horários)
export async function buscarReservasPorHorario(idHorario) {
  try {
    // A rota para buscar por idHorario existe no backend, mas é para verificar se *existe* uma reserva,
    // e não para retornar detalhes completos para o frontend.
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
  const tabelaCompleta = document.getElementById("reservasTable");
  const thead = tabelaCompleta.querySelector('thead tr');
  const tbody = tabelaCompleta.querySelector('tbody');

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
    const horariosQuadra = todosHorariosParaData.filter(h => h.quadra.id == quadra.id); // Acesso a quadra.id via objeto aninhado

    let row = `<tr><th>${quadra.nome}</th>`;
    horariosUnicos.forEach(horarioPadrao => {
      const horarioObj = horariosQuadra.find(h => h.horario === horarioPadrao);

      let status = "Não Existe";
      let btnClass = "btn-secondary";
      let horarioId = "";
      let disabledAttr = 'disabled'; // Desabilita botões se o horário não existe

      if (horarioObj) {
        horarioId = horarioObj.id;
        status = horarioObj.status;
        btnClass = status === "Disponível" ? "btn-disponivel" : "btn-indisponivel";
        disabledAttr = '';
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
  document.querySelectorAll("#reservasTable button[data-horario-id][data-status]").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const horarioId = e.currentTarget.dataset.horarioId;
      const statusAtual = e.currentTarget.dataset.status;

      if (!horarioId) {
        alert("Este horário não está cadastrado. Use 'Adicionar Novo Horário' para criá-lo.");
        return;
      }

      // Lógica para admins: alternar status
      const novoStatus = statusAtual === "Disponível" ? "Indisponível" : "Disponível";
      try {
        // Usa o endpoint PATCH do HorarioController para mudar o status
        await fetch(`${apiHorarios}/${horarioId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: novoStatus })
        });
        alert(`Status do horário ${horarioId} alterado para ${novoStatus}!`);
        // Recarrega a tabela para refletir a mudança
        await carregarHorariosAdm(document.getElementById("dataSelecionada").value);
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
      if (horarioId) {
        await preencherFormularioEdicaoHorario(horarioId);
      }
    });
  });

  document.querySelectorAll(".btn-remover-horario").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const horarioId = e.currentTarget.dataset.horarioId;
      if (horarioId) {
        await removerHorario(horarioId);
        await carregarHorariosAdm(document.getElementById("dataSelecionada").value);
      }
    });
  });
}

// Função para adicionar ou editar um horário
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

// Função para remover um horário
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

// Função para preencher o formulário do modal para edição
export async function preencherFormularioEdicaoHorario(id) {
  try {
    const response = await fetch(`${apiHorarios}/${id}`);
    if (!response.ok) throw new Error("Horário não encontrado");
    const horario = await response.json();

    // Popula o select de quadras ANTES de tentar definir o valor
    await renderizarListaQuadrasParaSelect(document.getElementById('modalHorarioQuadraSelect'));

    // Preenche os campos do modal
    document.getElementById('horarioId').value = horario.id;
    // O ID da quadra no Horario vem como um objeto aninhado 'quadra.id'
    document.getElementById('modalHorarioQuadraSelect').value = horario.quadra.id;
    document.getElementById('modalHorarioDataInput').value = horario.data; // Data já no formato YYYY-MM-DD
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