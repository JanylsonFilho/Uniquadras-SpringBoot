const apiBase = "http://localhost:8080"; // URL BASE ATUALIZADA
const apiQuadras = `${apiBase}/quadras`;
const apiReservas = `${apiBase}/reservas`;
const apiHorarios = `${apiBase}/horarios`;

export function formatarDataParaExibicao(dataString) {
  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Busca todas as quadras (usado em admin.js e reservas.js)
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

// Função para popular o select de quadras em um formulário (usado em admin.js)
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

// Carrega a tabela de horários para o admin (dinamicamente)
export async function carregarHorariosAdm(dataSelecionada) {
  const tabelaCompleta = document.getElementById("reservasTable");
  const thead = tabelaCompleta.querySelector('thead tr');
  const tbody = tabelaCompleta.querySelector('tbody');

  // 1. Buscar TODAS as quadras (Ativas)
  let quadrasAtivas = [];
  try {
    const responseQuadras = await fetch(`${apiQuadras}`);
    if (!responseQuadras.ok) throw new Error('Erro ao buscar quadras.');
    quadrasAtivas = (await responseQuadras.json()).filter(q => q.status === 'Ativa');
  } catch (error) {
    console.error('Erro ao buscar quadras para o quadro de horários:', error);
    alert('Erro ao carregar lista de quadras para o quadro.');
    return;
  }

  // 2. Buscar TODOS os horários para a data selecionada (de todas as quadras)
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

  // 3. Extrair e ordenar os horários únicos (intervalos de tempo)
  const horariosUnicos = [...new Set(todosHorariosParaData.map(h => h.horario))]
    .sort((a, b) => {
      const timeA = parseInt(a.split(':')[0]);
      const timeB = parseInt(b.split(':')[0]);
      return timeA - timeB;
    });

  // 4. Construir o cabeçalho da tabela dinamicamente
  let headerHtml = '<th>Quadra</th>';
  horariosUnicos.forEach(horario => {
    headerHtml += `<th>${horario}</th>`;
  });
  thead.innerHTML = headerHtml;

  // 5. Construir o corpo da tabela
  tbody.innerHTML = ""; // Limpa o corpo da tabela

  for (const quadra of quadrasAtivas) {
    let row = `<tr><th>${quadra.nome}</th>`;
    horariosUnicos.forEach(horarioPadrao => {
      const horarioObj = todosHorariosParaData.find(h => h.quadra.id === quadra.id && h.horario === horarioPadrao);

      let status = "Não Cadastrado"; // Se o horário não existe para aquela quadra e horário
      let btnClass = "btn-secondary";
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
                    <button class="btn ${btnClass} w-100 mb-2 btn-status-toggle" data-horario-id="${horarioId}" data-status="${status}" ${horarioId ? '' : 'disabled'}>
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
  document.querySelectorAll(".btn-status-toggle").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const horarioId = e.currentTarget.dataset.horarioId;
      const statusAtual = e.currentTarget.dataset.status;

      if (!horarioId) {
        alert("Este horário não está cadastrado. Use 'Adicionar Novo Horário' para criá-lo.");
        return;
      }

      const novoStatus = statusAtual === "Disponível" ? "Indisponível" : "Disponível";
      try {
        const response = await fetch(`${apiHorarios}/${horarioId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: novoStatus })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao alternar status.');
        }
        alert(`Status do horário ${horarioId} alterado para ${novoStatus}!`);
        await carregarHorariosAdm(document.getElementById("dataSelecionada").value); // Recarrega
      } catch (error) {
        console.error("Erro ao alternar status:", error);
        alert("Erro ao alterar status do horário: " + error.message);
      }
    });
  });

  // Adiciona eventos aos botões de Editar e Remover
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

    // O backend espera um objeto Quadra aninhado com o ID
    const dataToSend = {
      id: horarioData.id,
      quadra: { id: horarioData.id_quadra }, // Envia apenas o ID da quadra
      data: horarioData.data,
      horario: horarioData.horario,
      status: horarioData.status,
    };

    const response = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao salvar horário.');
    }
    alert("Horário salvo com sucesso!");
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

    await renderizarListaQuadrasParaSelect(document.getElementById('modalHorarioQuadraSelect'));

    document.getElementById('horarioId').value = horario.id;
    document.getElementById('modalHorarioQuadraSelect').value = horario.quadra.id; // Pega o ID da quadra
    document.getElementById('modalHorarioDataInput').value = horario.data; // A data já vem formatada do backend
    document.getElementById('modalHorarioHoraInput').value = horario.horario;
    document.getElementById('modalHorarioStatusSelect').value = horario.status;

    const modalHorario = new bootstrap.Modal(document.getElementById('modalHorario'));
    modalHorario.show();
  } catch (err) {
    alert("Erro ao carregar dados do horário para edição: " + err.message);
    console.error("Erro detalhado:", err);
  }
}