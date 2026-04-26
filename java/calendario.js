


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

const elTitle = document.getElementById("calendarTitle");
const elGrid = document.getElementById("calendarGrid");
const prevBtn = document.getElementById("prevMonthBtn");
const nextBtn = document.getElementById("nextMonthBtn");

// Placeholder de user
const user = { name: "Nome do Usuário", photoUrl: "" };
document.getElementById("username").textContent = user.name;
if (user.photoUrl) document.getElementById("userPhoto").src = user.photoUrl;

// ======= MARCAÇÕES (placeholder) =======
// Depois isso vem do banco:
// statusByDate["2026-02-26"] = "done" | "missed" | "rest" | "planned"
const statusByDate = {
  // exemplos
  // "2026-02-01": "rest",
  // "2026-02-03": "done",
  // "2026-02-05": "missed",
  // "2026-02-06": "planned"
};

let viewDate = new Date();

function pad(n){ return String(n).padStart(2, "0"); }
function toKey(y,m,d){ return `${y}-${pad(m)}-${pad(d)}`; }

// segunda como primeiro dia
function firstDayIndexMonday(year, month){ 
  const d = new Date(year, month, 1).getDay(); // 0 dom..6 sab
  return (d === 0) ? 6 : d - 1; // 0 seg..6 dom
}

function renderCalendar() {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11

  const monthName = viewDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  elTitle.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  elGrid.innerHTML = "";

  const startIndex = firstDayIndexMonday(year, month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // slots vazios antes do dia 1
  for (let i = 0; i < startIndex; i++) {
    const div = document.createElement("div");
    div.className = "calendar-day muted";
    div.textContent = "";
    elGrid.appendChild(div);
  }

  const today = new Date();
  const isSameMonth = today.getFullYear() === year && today.getMonth() === month;

  for (let day = 1; day <= daysInMonth; day++) {
    const key = toKey(year, month + 1, day);
    const status = statusByDate[key]; // done|missed|rest|planned|undefined

    const div = document.createElement("div");
    div.className = "calendar-day";

    if (isSameMonth && day === today.getDate()) div.classList.add("today");
    if (status) div.classList.add(status);

    div.textContent = day;

    const badge = document.createElement("span");
    badge.className = "badge";
    div.appendChild(badge);

    // Clique (futuro: abrir detalhe do dia / treino)
    div.addEventListener("click", () => {
      // placeholder: só demonstra
      alert(`Dia ${day}/${month+1}/${year} — status: ${status ?? "sem status"}`);
    });

    elGrid.appendChild(div);
  }
}

prevBtn.addEventListener("click", () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
  renderCalendar();
});

renderCalendar();
