const form = document.getElementById("loginForm");
const msg = document.getElementById("msgLogin");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "Entrando...";

    const formData = new FormData(form);
    const dados = Object.fromEntries(formData.entries());

    try {
        const res = await fetch("http://127.0.0.1:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(dados),
        });

        const retorno = await res.json();

        if (!res.ok) {
            msg.textContent = retorno.error || "Erro ao logar.";
            return;
        }

        msg.textContent = "Login OK! Indo para tela inicial...";
        window.location.href = "telaInicial.html";
    } catch (err) {
        msg.textContent = "Não consegui conectar no servidor.";
    }
});


