import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("<h1>Hello World!!</h1>"); // resposta ao GET /
});

app.get("/about", (req, res) => {
    res.send("<h1>About</h1>"); // resposta ao GET /
});

app.get("/contact", (req, res) => {
    res.send("<h1>Contact</h1>");
});

app.listen(port, () => {
    console.log("Server running!");
});
