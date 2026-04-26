console.log("cadastro.js carregou ✅");

const form = document.getElementById("cadastroForm");
const msg = document.getElementById("msgCadastro");
const fotoInput = document.getElementById("fotoInput");
const previewImg = document.getElementById("previewImg");
const previewText = document.querySelector(".foto-preview-text");

if (!form) console.error("ERRO: não achei #cadastroForm");
if (!msg) console.error("ERRO: não achei #msgCadastro");

const MAX_MB = 2;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function setMsg(texto, tipo = "info") {
  if (!msg) return;
  msg.textContent = texto;
  msg.className = `msg ${tipo}`;
}

// Preview
if (fotoInput) {
  fotoInput.addEventListener("change", () => {
    const file = fotoInput.files?.[0];
    if (!file) return;

    if (file.size > MAX_BYTES) {
      setMsg(`Imagem muito grande. Máximo: ${MAX_MB}MB.`, "err");
      fotoInput.value = "";
      if (previewImg) previewImg.style.display = "none";
      if (previewText) previewText.style.display = "block";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMsg("Arquivo inválido. Selecione uma imagem.", "err");
      fotoInput.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    if (previewImg) {
      previewImg.src = url;
      previewImg.style.display = "block";
    }
    if (previewText) previewText.style.display = "none";
    setMsg("Foto selecionada ✅", "ok");
  });
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("Cadastrando...", "info");

    const formData = new FormData(form);

    try {
      const res = await fetch("http://127.0.0.1:3000/auth/cadastrar", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let retorno = {};

      try {
        retorno = text ? JSON.parse(text) : {};
      } catch {}

      if (!res.ok) {
        setMsg(retorno.error || "Erro ao cadastrar.", "err");
        return;
      }

      console.log("CHEGOU NO SUCESSO ✅");

      setMsg("Cadastro realizado com sucesso! Redirecionando...", "ok");

      setTimeout(() => {
        window.location.replace("/pages/login.html");
      }, 1000);

    } catch (err) {
      console.error("ERRO NO FETCH:", err);
      setMsg("Falha ao finalizar cadastro.", "err");
    }
  });
}
const btnCadastrar = document.getElementById("btnCadastrar");

if (btnCadastrar && form) {
  btnCadastrar.addEventListener("click", () => {
    console.log("CLIQUE NO BOTÃO ✅");
    form.requestSubmit(); // força o submit do form
  });
} else {
  console.error("Não achei o botão btnCadastrar ou o form.");
}


