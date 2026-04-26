
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



// ======= hooks =======
const elUserName = document.getElementById("username");
const elUserPhoto = document.getElementById("userPhoto");

const elWorkoutTitle = document.getElementById("workoutTitle");
const elWorkoutDate = document.getElementById("workoutDate");
const elWorkoutCategory = document.getElementById("workoutCategory");
const elWorkoutStatus = document.getElementById("workoutStatus");

const elExerciseList = document.getElementById("exerciseList");
const backBtn = document.getElementById("backBtn");
const startBtn = document.getElementById("startBtn");
const finishBtn = document.getElementById("finishBtn");

// ======= navegação =======
backBtn.addEventListener("click", () => {
  window.location.href = "/pages/telaInicial.html";
});


// ======= MODELO DE DADOS (placeholder) =======
// Troque depois por fetch(API) + dados do banco
const mockPayload = {
  user: {
    name: "Nome do Usuário",
    photoUrl: "" // se vazio, fica sem imagem (pode colocar um default depois)
  },
  workout: {
    title: "TREINO PEITO",
    category: "Hipertrofia",
    date: new Date().toLocaleDateString("pt-BR"),
    status: "Não iniciado"
  },
  exercises: [
    {
      id: "supino_reto",
      name: "Supino Reto",
      sets: "4x8",
      lastWeight: 60, // do banco
      currentWeight: "", // input
      done: false
    },
    {
      id: "supino_inclinado",
      name: "Supino Inclinado",
      sets: "3x10",
      lastWeight: 22,
      currentWeight: "",
      done: false
    }
  ]
};

// ======= render =======
function renderHeader(user) {
  elUserName.textContent = user.name || "Usuário";
  if (user.photoUrl) elUserPhoto.src = user.photoUrl;
}

function renderWorkoutMeta(workout) {
  elWorkoutTitle.textContent = workout.title || "Treino";
  elWorkoutDate.textContent = workout.date || "--/--";
  elWorkoutCategory.textContent = workout.category || "--";
  elWorkoutStatus.textContent = workout.status || "--";
}

function exerciseCardTemplate(ex) {
  return `
    <article class="exercise-card" data-id="${ex.id}">
      <div class="exercise-head">
        <div class="exercise-name">${ex.name}</div>
        <div class="exercise-tag">${ex.sets}</div>
      </div>

      <div class="exercise-grid">
        <div class="field">
          <div class="field-label">Última carga</div>
          <div class="field-value">${ex.lastWeight ?? "--"} kg</div>
        </div>

        <div class="field">
          <div class="field-label">Carga atual</div>
          <input class="weight-input" type="number" inputmode="numeric" placeholder="Ex: 62" value="${ex.currentWeight}">
        </div>
      </div>

      <div class="done-row">
        <div class="done-label">Feito</div>
        <input class="done-check" type="checkbox" ${ex.done ? "checked" : ""}>
      </div>
    </article>
  `;
}

function renderExercises(exercises) {
  elExerciseList.innerHTML = exercises.map(exerciseCardTemplate).join("");
}

// ======= start/finish (placeholder de estado) =======
startBtn.addEventListener("click", () => {
  elWorkoutStatus.textContent = "Em andamento";
});

finishBtn.addEventListener("click", () => {
  // Aqui no futuro: enviar payload pro banco (cargas atuais, checkboxes, timestamp etc)
  // Exemplo: collectWorkoutData(); fetch('/api/workout/finish', {method:'POST', body: JSON.stringify(data)})

  elWorkoutStatus.textContent = "Finalizado ✅";
  alert("Treino finalizado! (placeholder)");
});

// ======= init =======
renderHeader(mockPayload.user);
renderWorkoutMeta(mockPayload.workout);
renderExercises(mockPayload.exercises);
