//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from "express";
import { dirname } from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
// pega o path dinamicamente
const _dirname = dirname(fileURLToPath(import.meta.url));

const homepage = _dirname + "/public/index.html";
let userAutnorised = false;

// ativa o body parser
app.use(bodyParser.urlencoded({ extended: true }));

function passwordCheck(req, res, next) {
    if (req.body["password"] === "ILoveProgramming") {
        userAutnorised = true;
    }
    next();
}
app.use(passwordCheck);

// levanta o servidor na porta 3000
app.listen(port, () => {
    console.log("Ouvindo na porta 3000.");
});

app.get("/", (req, res) => {
    res.sendFile(homepage);
});

app.post("/check", (req, res) => {
    if (userAutnorised) {
        res.sendFile(_dirname + "/public/secret.html");
    } else {
        res.sendFile(homepage);
        // res.redirect("/");
    }
    userAutnorised = false;
});
