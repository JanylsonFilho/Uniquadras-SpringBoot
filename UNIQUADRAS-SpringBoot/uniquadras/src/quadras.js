// quadras.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", function () {
  const apiBaseUrl = "http://localhost:3000/api/quadras";

  // Função para listar quadras
  async function listarQuadras() {
    try {
      const response = await fetch(apiBaseUrl);
      const quadras = await response.json();

      const quadrasContainer = document.getElementById("quadrasContainer");
      if (quadrasContainer) {
        quadrasContainer.innerHTML = ""; // Limpa o container
        quadras.forEach((quadra) => {
          const quadraElement = document.createElement("div");
          quadraElement.className = "quadra-item";
          quadraElement.innerHTML = `
            <h3>${quadra.nome}</h3>
            <p>Localização: ${quadra.localizacao}</p>
            <p>Tipo: ${quadra.tipo}</p>
            <button class="btn-delete" data-id="${quadra.id}">Deletar</button>
          `;
          quadrasContainer.appendChild(quadraElement);
        });

        // Adiciona eventos de deletar
        document.querySelectorAll(".btn-delete").forEach((button) => {
          button.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            await deletarQuadra(id);
            listarQuadras(); // Atualiza a lista
          });
        });
      }
    } catch (error) {
      console.error("Erro ao listar quadras:", error);
    }
  }

  // Função para criar uma nova quadra
  async function criarQuadra(data) {
    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Quadra criada com sucesso!");
        listarQuadras(); // Atualiza a lista
      } else {
        alert("Erro ao criar quadra.");
      }
    } catch (error) {
      console.error("Erro ao criar quadra:", error);
    }
  }

  // Função para deletar uma quadra
  async function deletarQuadra(id) {
    try {
      const response = await fetch(`${apiBaseUrl}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Quadra deletada com sucesso!");
      } else {
        alert("Erro ao deletar quadra.");
      }
    } catch (error) {
      console.error("Erro ao deletar quadra:", error);
    }
  }

  // Adiciona evento ao formulário de criação
  const formCriarQuadra = document.getElementById("formCriarQuadra");
  if (formCriarQuadra) {
    formCriarQuadra.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value;
      const localizacao = document.getElementById("localizacao").value;
      const tipo = document.getElementById("tipo").value;

      const novaQuadra = { nome, localizacao, tipo };
      await criarQuadra(novaQuadra);
    });
  }

  // Inicializa a listagem de quadras
  listarQuadras();
});