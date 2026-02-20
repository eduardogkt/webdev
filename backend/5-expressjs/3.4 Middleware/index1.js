import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

// forma flexivel de descobrir o filepath do arquivo para quando o projeto não
// estiver mais hospedado localmente -- encontra o path relativo ao computador
// do host
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// app.use é executado antes que qualquer rota e é usado para "ativar" os
// middleware que serão utilizados no app

// body parser faz o parse da requisição fazendo com que a requisição
// agora tenha um atributo .body
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.post("/submit", (req, res) => {
    console.log(req.body);
});
