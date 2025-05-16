// Painel do administrador
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
document.addEventListener("DOMContentLoaded", function () {
    const tabelaHorariosAdm = document.querySelector("tbody");
    const dataInputAdm = document.querySelector('input[type="date"]');
  
    // Função para carregar horários no painel do administrador
    function carregarHorariosAdm(dataSelecionada) {
      const horariosPorData = JSON.parse(localStorage.getItem("horariosPorData")) || {};
      const horarios = horariosPorData[dataSelecionada] || [
        { quadra: "QUADRA 1", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Disponível"] },
        { quadra: "QUADRA 2", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Disponível"] },
        { quadra: "QUADRA 3", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Disponível"] }
      ];
  
      // Atualiza corpo da tabela
      tabelaHorariosAdm.innerHTML = "";
      horarios.forEach((quadra, indexQuadra) => {
        let row = `<tr><th>${quadra.quadra}</th>`;
        quadra.horarios.forEach((status, indexHorario) => {
          const btnClass = status === "Disponível" ? "btn-disponivel" : "btn-indisponivel";
          row += `<td>
            <button class="btn ${btnClass} w-100" data-quadra="${indexQuadra}" data-horario="${indexHorario}">
              ${status}
            </button>
          </td>`;
        });
        row += `</tr>`;
        tabelaHorariosAdm.innerHTML += row;
      });
  
      // Adiciona eventos aos botões para permitir alterações
      document.querySelectorAll("button[data-quadra]").forEach(btn => {
        btn.addEventListener("click", () => {
          const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
          const quadraIdx = btn.getAttribute("data-quadra");
          const horarioIdx = btn.getAttribute("data-horario");
          const dataSelecionada = document.querySelector('input[type="date"]').value;
          const horariosPorData = JSON.parse(localStorage.getItem("horariosPorData")) || {};
          const horarios = horariosPorData[dataSelecionada];
      
          // Se não houver usuário logado, impede
          if (!usuarioLogado) {
            alert("Você precisa estar logado para fazer uma reserva.");
            return;
          }
      
          // Se for usuário comum
          if (usuarioLogado.tipo !== "adm") {
            if (horarios[quadraIdx].horarios[horarioIdx] !== "Disponível") {
              alert("Esse horário já está indisponível.");
              return;
            }
      
            // Reserva válida
            horarios[quadraIdx].horarios[horarioIdx] = "Indisponível";
            horariosPorData[dataSelecionada] = horarios;
            localStorage.setItem("horariosPorData", JSON.stringify(horariosPorData));
      
            alert("Reserva feita com sucesso!");
            btn.textContent = "Indisponível";
            btn.classList.remove("btn-disponivel");
            btn.classList.add("btn-indisponivel");
            btn.setAttribute("disabled", "true");
      
          } else {
            // ADMIN pode alternar livremente
            const atual = horarios[quadraIdx].horarios[horarioIdx];
            const novo = atual === "Disponível" ? "Indisponível" : "Disponível";
            horarios[quadraIdx].horarios[horarioIdx] = novo;
            horariosPorData[dataSelecionada] = horarios;
            localStorage.setItem("horariosPorData", JSON.stringify(horariosPorData));
      
            btn.textContent = novo;
            btn.classList.toggle("btn-disponivel", novo === "Disponível");
            btn.classList.toggle("btn-indisponivel", novo === "Indisponível");
      
            if (novo === "Disponível") {
              btn.removeAttribute("disabled");
            } else {
              btn.setAttribute("disabled", "true");
            }
          }
        });
      });
      
    }
  
    // Função para salvar horários no painel do administrador
  
    // Evento para mudança de data no painel do administrador
    if (dataInputAdm) {
      dataInputAdm.addEventListener("change", () => {
        const dataSelecionada = dataInputAdm.value;
        if (dataSelecionada) {
          carregarHorariosAdm(dataSelecionada);
        }
      });
  
      // Carrega os horários para a data atual ao carregar a página
      const dataAtual = new Date().toISOString().split("T")[0];
      dataInputAdm.value = dataAtual;
      carregarHorariosAdm(dataAtual);
    }
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    // Campo de data no painel do administrador
    const dataInputAdm = document.getElementById("dataSelecionada");
  
    if (dataInputAdm) {
      // Salva a data selecionada no localStorage
      dataInputAdm.addEventListener("change", () => {
        const dataSelecionada = dataInputAdm.value;
        if (dataSelecionada) {
          localStorage.setItem("dataSelecionada", dataSelecionada);
        }
      });
  
      // Carrega a data salva ao abrir o painel do administrador
      const dataSalva = localStorage.getItem("dataSelecionada");
      if (dataSalva) {
        dataInputAdm.value = dataSalva;
      }
    }
  
    // Recuperar a data selecionada em outras páginas
    const dataSelecionada = localStorage.getItem("dataSelecionada");
    if (dataSelecionada) {
      console.log("Data selecionada:", dataSelecionada);
      // Use essa data para associar alterações ou exibir informações específicas
    } else {
      console.log("Nenhuma data foi selecionada.");
    }
  });
  