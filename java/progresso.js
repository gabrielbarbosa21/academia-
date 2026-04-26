



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




const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", () => window.location.href = "/pages/telaInicial.html");

// Placeholder: depois você troca por dados reais do banco
const payload = {
  user: { name: "Nome do Usuário", photoUrl: "" },
  monthWorkouts: 12,
  streak: 3,
  lastWeight: 78.2
};

// Header
document.getElementById("username").textContent = payload.user.name;
if (payload.user.photoUrl) document.getElementById("userPhoto").src = payload.user.photoUrl;

// Métricas
document.getElementById("monthWorkouts").textContent = payload.monthWorkouts;
document.getElementById("streak").textContent = `${payload.streak} dias`;
document.getElementById("lastWeight").textContent = `${payload.lastWeight} kg`;

// Salvar peso (futuro: POST no backend)
document.getElementById("saveWeightBtn").addEventListener("click", () => {
  const v = document.getElementById("newWeightInput").value;
  if (!v) return alert("Digite o novo peso.");
  alert(`Peso salvo (placeholder): ${v} kg`);
});
