import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

let bandName = "";

// pega o path para os arquivos dinamicamente
const _dirname = dirname(fileURLToPath(import.meta.url));

// middleware para criar o body da requisição
app.use(bodyParser.urlencoded({ extended: true }));

// middleware personalizado para criar o nome da banda
function bandNameGenerator(req, res, next) {
    console.log(req.body);
    bandName = req.body["street"] + req.body["pet"];
    next();
}

// é importante que o middleware do body parser venha antes que o middleware
// personalizado ** a ordem importa

app.use(bandNameGenerator);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get("/", (req, res) => {
    // envia o arquivo da página inicial, que é o formulário
    res.sendFile(_dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
    // mandando como resposta os itens do formulário concatenados
    // ao invés de um middleware personalizado, a bandName poderia ser
    // construída na rota de post
    // bandName = req.body["street"] + req.body["pet"];
    res.send(`<h1>O nome da sua banda é</h1><h2>${bandName}</h2>`);
});
