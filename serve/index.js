import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import bcrypt from "bcrypt";
import { pool } from "./db.js";
import multer from "multer";
import path from "path";
import crypto from "crypto";

dotenv.config();

const app = express();

app.use(express.json());

// CORS
const allowed = [
  "http://127.0.0.1:5500",
  "http://localhost:5500"
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    const ok =
      origin.includes("railway.app") ||
      allowed.includes(origin);

    if (ok) return cb(null, true);
    return cb(new Error("CORS bloqueado: " + origin));
  },
  credentials: true
}));

// Sessão
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // corrigido
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "não autenticado" });
  }
  next();
}

// ===== UPLOAD =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const nomeUnico = crypto.randomUUID();
    cb(null, `${nomeUnico}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }
  cb(new Error("Arquivo inválido. Envie uma imagem."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

app.use("/uploads", express.static("uploads"));

// ===== CADASTRO =====
app.post("/auth/cadastrar", upload.single("foto"), async (req, res) => {
  const { nome_usuario, email, senha, meta_peso } = req.body;

  if (!nome_usuario || !email || !senha) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const [existe] = await pool.query(
      "SELECT id FROM usuarios WHERE email = :email LIMIT 1",
      { email }
    );

    if (existe.length) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

    let foto_url = null; // corrigido

    if (req.file) {
      foto_url = `${BASE_URL}/uploads/${req.file.filename}`;
    }

    await pool.query(
      `INSERT INTO usuarios (nome_usuario, email, senha_hash, meta_peso, foto_url)
       VALUES (:nome_usuario, :email, :senha_hash, :meta_peso, :foto_url)`,
      {
        nome_usuario,
        email,
        senha_hash,
        meta_peso: meta_peso || null,
        foto_url
      }
    );

    res.json({ ok: true });

  } catch (e) {
  console.error("ERRO:", e);
  res.status(500).json({ error: "erro no servidor" });
}

});

// ===== LOGIN =====
app.post("/auth/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "email e senha são obrigatórios" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, senha_hash FROM usuarios WHERE email = :email LIMIT 1",
      { email }
    );

    if (!rows.length) {
      return res.status(401).json({ error: "credenciais inválidas" });
    }

    const ok = await bcrypt.compare(senha, rows[0].senha_hash);

    if (!ok) {
      return res.status(401).json({ error: "credenciais inválidas" });
    }

    req.session.userId = rows[0].id;

    res.json({ ok: true });

  } 
    catch (e) {
    console.error("ERRO:", e);
    res.status(500).json({ error: "erro no servidor" });
}
});

// ===== ME =====
app.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nome_usuario, email, foto_url, meta_peso, peso_atual FROM usuarios WHERE id = :id LIMIT 1",
      { id: req.session.userId }
    );

    if (!rows.length) {
      return res.status(404).json({ error: "usuário não encontrado" });
    }

    res.json({ ok: true, user: rows[0] });

  } catch (e) {
    res.status(500).json({ error: "erro no servidor", detail: String(e) });
  }
});

// ===== LOGOUT =====
app.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.json({ ok: true });
  });
});

// ===== HEALTH =====
app.get("/health", (_, res) => res.json({ ok: true }));

// ===== ERROS UPLOAD =====
app.use((err, req, res, next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Imagem muito grande. Máximo 2MB." });
  }
  if (err) {
    return res.status(400).json({ error: err.message || "Erro no upload" });
  }
  next();
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Backend rodando na porta " + (process.env.PORT || 3000));
});
