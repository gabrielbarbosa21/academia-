async function checarLogin() {
 const res = await fetch("http://127.0.0.1:3000/auth/me", {
  credentials: "include",
});

  if (res.status === 401) {
    window.location.href = "login.html";
    return;
  }

  const data = await res.json();
  document.getElementById("username").textContent = data.user.nome_usuario;

  const img = document.querySelector(".user-photo img");
  if (data.user.foto_url) img.src = data.user.foto_url;
}

checarLogin();

// ===== MENU HAMBURGUER =====
const menuToggle = document.getElementById("menuToggle");
const sideMenu = document.getElementById("sideMenu");


menuToggle.addEventListener("click", () => {
  sideMenu.classList.toggle("active");
});

// ===== REDIRECIONAMENTOS =====

const menuInicio = document.getElementById("menuInicio");
const menuCalendario = document.getElementById("menuCalendario");
const menuProgresso = document.getElementById("menuProgresso");
const menuConfig = document.getElementById("menuConfig");
const menuSair = document.getElementById("menuSair");

// Ajuste os caminhos conforme sua estrutura de pastas

if (menuInicio) {
  menuInicio.addEventListener("click", () => {
    window.location.href = "/pages/telaInicial.html";
  });
}

if (menuCalendario) {
  menuCalendario.addEventListener("click", () => {
    window.location.href = "/pages/calendario.html";
  });
}

if (menuProgresso) {
  menuProgresso.addEventListener("click", () => {
    window.location.href = "/pages/progresso.html";
  });
}

if (menuConfig) {
  menuConfig.addEventListener("click", () => {
    window.location.href = "/pages/configuracoes.html";
  });
}

if (menuSair) {
  const menuSair = document.getElementById("menuSair");
const sideMenu = document.getElementById("sideMenu");

if (menuSair) {
 const menuSair = document.getElementById("menuSair");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");

if (menuSair) {
  menuSair.addEventListener("click", () => {
    logoutModal.classList.add("active");
  });
}

if (cancelLogout) {
  cancelLogout.addEventListener("click", () => {
    logoutModal.classList.remove("active");
  });
}

if (confirmLogout) {
  confirmLogout.addEventListener("click", async () => {
    try {
      await fetch("http://127.0.0.1:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      window.location.href = "/pages/login.html";
    } catch (err) {
      alert("Erro ao sair.");
    }
  });
}
}
  
}

/* 
Aqui depois você pode:

1. Puxar nome do usuário do banco
2. Puxar foto do usuário
3. Detectar dia da semana
4. Alterar automaticamente o treino

Exemplo básico:
*/

const today = new Date().getDay();

const workouts = {
  1: "PEITO E TRÍCEPS",
  2: "COSTAS E BÍCEPS",
  3: "PERNA",
  4: "OMBRO",
  5: "FULL BODY"
};

if (workouts[today]) {
  document.getElementById("workoutName").innerText = workouts[today];
}

const verTreinoBtn = document.getElementById("verTreinoBtn");

if (verTreinoBtn) {
  verTreinoBtn.addEventListener("click", () => {
    window.location.href = "/pages/verTreino.html";
  });
}








