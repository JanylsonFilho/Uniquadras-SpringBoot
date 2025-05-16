import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';





document.addEventListener("DOMContentLoaded", function () {
  // Inicializa usuários padrão
  if (!localStorage.getItem("usuarios")) {
    const usuariosDefault = [
      {
        nome: "Administrador",
        email: "adm@unifor.br",
        telefone: "(85) 99999-9999",
        senha: "adm123",
        tipo: "adm"
      },
      {
        nome: "João Silva",
        email: "joao@unifor.br",
        telefone: "(85) 98888-7777",
        senha: "joao123",
        tipo: "usuario"
      }
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuariosDefault));
  }

  // Inicializa horários padrão
  if (!localStorage.getItem("horarios")) {
    const horariosDefault = [
      { quadra: "QUADRA 1", horarios: ["Disponível", "Indisponível", "Indisponível", "Indisponível", "Indisponível"] },
      { quadra: "QUADRA 2", horarios: ["Disponível", "Disponível", "Disponível", "Indisponível", "Indisponível"] },
      { quadra: "QUADRA 3", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Indisponível"] }
    ];
    localStorage.setItem("horarios", JSON.stringify(horariosDefault));
  }

  // Cadastro de novos usuários
  const formCadastro = document.getElementById("formCadastro");
  if (formCadastro) {
    formCadastro.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const senha = document.getElementById("senha").value.trim();

      if (!nome || !email || !telefone || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      const novoUsuario = {
        nome,
        email,
        telefone,
        senha,
        tipo: "usuario"
      };

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      console.log("Usuários cadastrados agora:");
      console.table(usuarios);

      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";
    });
  }

  // Login de usuários
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );

      if (usuarioEncontrado) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));

        if (usuarioEncontrado.tipo === "adm") {
          alert(`Bem-vindo, ADM ${usuarioEncontrado.nome}!`);
          window.location.href = "painel-adm.html";
        } else {
          alert(`Bem-vindo ao sistema de reservas, ${usuarioEncontrado.nome}!`);
          window.location.href = "horarios-disponiveis.html";
        }
      } else {
        alert("Email ou senha inválidos. Tente novamente!");
      }
    });
  }

  // Seleção de tipo de quadra
  const btnConfirmar = document.querySelector(".btn-confirmar");
  const radios = document.getElementsByName("tipo_quadra");

  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", function () {
      let tipoSelecionado = "";
      radios.forEach((radio) => {
        if (radio.checked) {
          tipoSelecionado = radio.value;
        }
      });

      if (tipoSelecionado === "aberta") {
        window.location.href = "/esportes-abertos.html";
      } else if (tipoSelecionado === "coberta") {
        window.location.href = "/esportes-fechados.html";
      } else {
        alert("Selecione o tipo de quadra para continuar.");
      }
    });
  }

  // Escolha de esporte
  const botoesEsporte = document.querySelectorAll(".btn.btn-primary");
  if (botoesEsporte.length > 0) {
    botoesEsporte.forEach((botao) => {
      botao.addEventListener("click", () => {
        const esporteSelecionado = botao.textContent.trim();
        localStorage.setItem("esporteSelecionado", esporteSelecionado);
        console.log("Esporte selecionado:", esporteSelecionado);
        window.location.href = "horarios-disponiveis.html";
      });
    });
  }

  // Página de horários (Usuário Reserva)
  const tabelaHorarios = document.querySelector("tbody");
  const theadHorarios = document.querySelector("thead tr");

  if (tabelaHorarios && theadHorarios) {
    const horariosPadrao = JSON.parse(localStorage.getItem("horariosPadrao")) || [
      "17-18", "18-19", "19-20", "20-21", "21-22"
    ];

    // Atualiza cabeçalho de horários
    let theadContent = `<th>Quadra</th>`;
    horariosPadrao.forEach(horario => {
      theadContent += `<th>${horario}</th>`;
    });
    theadHorarios.innerHTML = theadContent;

    // Atualiza corpo da tabela
    const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
    tabelaHorarios.innerHTML = "";

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
      tabelaHorarios.innerHTML += row;
    });

    // Adiciona eventos aos botões
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

  // Info do esporte na tela
  const esporteSpan = document.getElementById("esporteSelecionado");
  if (esporteSpan) {
    const esporte = localStorage.getItem("esporteSelecionado");
    esporteSpan.textContent = esporte || "Não selecionado";
  }

  const loginBtn = document.getElementById("btn-login");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/login.html";
    });
  }
});


// Controle pela data 

document.addEventListener("DOMContentLoaded", function () {
  const tabelaHorarios = document.querySelector("tbody");
  const dataInput = document.querySelector('input[type="date"]');

  // Função para carregar horários para a data selecionada
  function carregarHorarios(dataSelecionada) {
    const horariosPorData = JSON.parse(localStorage.getItem("horariosPorData")) || {};
    const horarios = horariosPorData[dataSelecionada] || [
      { quadra: "QUADRA 1", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Disponível"] },
      { quadra: "QUADRA 2", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Disponível"] },
      { quadra: "QUADRA 3", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Disponível"] }
    ];

    // Atualiza corpo da tabela
    tabelaHorarios.innerHTML = "";
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
      tabelaHorarios.innerHTML += row;
    });

    // Adiciona eventos aos botões
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

  // Função para salvar horários para a data selecionada

  // Evento para mudança de data
  if (dataInput) {
    dataInput.addEventListener("change", () => {
      const dataSelecionada = dataInput.value;
      if (dataSelecionada) {
        carregarHorarios(dataSelecionada);
      }
    });

    // Carrega os horários para a data atual ao carregar a página
    const dataAtual = new Date().toISOString().split("T")[0];
    dataInput.value = dataAtual;
    carregarHorarios(dataAtual);
  }
});

// Painel do administrador

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




