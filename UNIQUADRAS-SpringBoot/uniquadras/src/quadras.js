const apiQuadras = "http://localhost:8080/quadras"; // URL ATUALIZADA
const listaQuadrasContainer = document.getElementById("listaQuadras");
const btnAdicionarNovaQuadra = document.getElementById("btnAdicionarNovaQuadra");
const modalQuadra = new bootstrap.Modal(document.getElementById("modalQuadra"));
const formQuadra = document.getElementById("formQuadra");
const quadraIdInput = document.getElementById("quadraId");
const nomeQuadraModalInput = document.getElementById("nomeQuadraModal");
const tipoQuadraModalSelect = document.getElementById("tipoQuadraModal");
const statusQuadraModalSelect = document.getElementById("statusQuadraModal"); // Adicionado o status

// Novo campo de localização para o modal, se você quiser gerenciar isso no frontend.
// Para manter a compatibilidade com o backend, adicionamos 'localizacao' ao modelo Quadra.java.
// Se você não tiver um campo de input para localização no painel-adm.html, ele será 'undefined' ou vazio.
// Você pode adicionar um input no painel-adm.html se quiser que o admin defina a localização.
// Exemplo: <input type="text" class="form-control" id="localizacaoQuadraModal" placeholder="Localização">
// E depois pegar o valor: const localizacaoQuadraModalInput = document.getElementById("localizacaoQuadraModal");

export async function renderizarListaQuadras() {
  try {
    const response = await fetch(apiQuadras);
    if (!response.ok) throw new Error("Erro ao buscar quadras.");
    const quadras = await response.json();
    listaQuadrasContainer.innerHTML = "";

    if (quadras.length === 0) {
      listaQuadrasContainer.innerHTML = '<p class="text-center text-white-50">Nenhuma quadra cadastrada.</p>';
      return;
    }

    quadras.forEach(quadra => {
      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4 mb-4";
      card.innerHTML = `
        <div class="card card-custom h-100">
          <div class="card-body text-start d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">${quadra.nome}</h5>
              <p class="card-text mb-1">Tipo: ${quadra.tipo}</p>
              <p class="card-text">Status: ${quadra.status}</p>
              <p class="card-text">Localização: ${quadra.localizacao || 'Não especificada'}</p>
            </div>
            <div class="d-flex justify-content-end mt-3">
              <button class="btn btn-info btn-sm me-2 btn-editar-quadra" data-id="${quadra.id}">
                <i class="bi bi-pencil-square"></i> Editar
              </button>
              <button class="btn btn-danger btn-sm btn-remover-quadra" data-id="${quadra.id}">
                <i class="bi bi-trash"></i> Remover
              </button>
            </div>
          </div>
        </div>`;
      listaQuadrasContainer.appendChild(card);
    });

    document.querySelectorAll('.btn-editar-quadra').forEach(btn => {
      btn.addEventListener('click', (e) => preencherFormularioEdicao(e.target.closest('button').dataset.id));
    });

    document.querySelectorAll('.btn-remover-quadra').forEach(btn => {
      btn.addEventListener('click', (e) => removerQuadra(e.target.closest('button').dataset.id));
    });

  } catch (error) {
    alert("Erro ao carregar lista de quadras.");
    console.error(error);
  }
}

export async function adicionarOuEditarQuadra(data) {
  try {
    const metodo = data.id ? "PUT" : "POST";
    const url = data.id ? `${apiQuadras}/${data.id}` : apiQuadras;

    // Incluir a localização, se existir no formulário
    // Se você não adicionou o campo de localização no painel-adm.html, remova esta linha
    // const localizacao = document.getElementById("localizacaoQuadraModal")?.value;
    // data.localizacao = localizacao;

    const response = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Erro desconhecido');
    }
    alert("Quadra salva com sucesso!");
    modalQuadra.hide();
    renderizarListaQuadras();
  } catch (err) {
    alert("Erro ao salvar quadra: " + err.message);
    console.error(err);
  }
}

export async function removerQuadra(id) {
  if (!confirm("Deseja realmente remover esta quadra?")) return;

  try {
    const response = await fetch(`${apiQuadras}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Erro desconhecido');
    }
    alert("Quadra removida com sucesso!");
    renderizarListaQuadras();
  } catch (err) {
    alert("Erro ao remover quadra: " + err.message);
    console.error(err);
  }
}

export async function preencherFormularioEdicao(id) {
  try {
    const response = await fetch(`${apiQuadras}/${id}`);
    if (!response.ok) throw new Error("Quadra não encontrada");
    const quadra = await response.json();

    quadraIdInput.value = quadra.id;
    nomeQuadraModalInput.value = quadra.nome;
    tipoQuadraModalSelect.value = quadra.tipo;
    statusQuadraModalSelect.value = quadra.status;
    // Se você tiver um campo de localização no modal, preencha-o aqui:
    // document.getElementById("localizacaoQuadraModal").value = quadra.localizacao;

    modalQuadra.show();
  } catch (err) {
    alert("Erro ao carregar dados da quadra para edição: " + err.message);
    console.error(err);
  }
}

export function inicializarFormularioQuadra() {
  formQuadra.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      id: quadraIdInput.value || undefined,
      nome: nomeQuadraModalInput.value,
      tipo: tipoQuadraModalSelect.value,
      status: statusQuadraModalSelect.value,
      localizacao: "Parque Desportivo" // Valor padrão ou pegue de um input
    };
    await adicionarOuEditarQuadra(data);
  });

  btnAdicionarNovaQuadra.addEventListener("click", () => {
    formQuadra.reset();
    quadraIdInput.value = '';
    // Se você tiver um campo de localização, zere ele também
    // document.getElementById("localizacaoQuadraModal").value = '';
    modalQuadra.show();
  });
}