const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

// URL REAL (escondida)
const STREAM_URL = "https://stm.igng.com.br:7018/stream";

// chave secreta
const SECRET = "buteco_super_secret";

/* GERAR TOKEN */
function gerarToken(ip) {
  const time = Math.floor(Date.now() / 1000);
  const hash = crypto
    .createHash("md5")
    .update(ip + SECRET + time)
    .digest("hex");

  return `${time}-${hash}`;
}

/* VALIDAR TOKEN */
function validarToken(token, ip) {
  if (!token) return false;

  const [time, hash] = token.split("-");
  const now = Math.floor(Date.now() / 1000);

  // expira em 60 segundos
  if (now - time > 60) return false;

  const validHash = crypto
    .createHash("md5")
    .update(ip + SECRET + time)
    .digest("hex");

  return hash === validHash;
}

/* ROTA PRA PEGAR TOKEN */
app.get("/token", (req, res) => {
  const ip = req.ip;
  const token = gerarToken(ip);
  res.json({ token });
});

/* PROXY DO STREAM */
app.get("/stream", async (req, res) => {
  const token = req.query.token;
  const ip = req.ip;

  if (!validarToken(token, ip)) {
    return res.status(403).send("Acesso negado");
  }

  try {
    const stream = await axios({
      method: "GET",
      url: STREAM_URL,
      responseType: "stream"
    });

    res.setHeader("Content-Type", "audio/mpeg");
    stream.data.pipe(res);

  } catch (err) {
    res.status(500).send("Erro no stream");
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:" + PORT);
});
