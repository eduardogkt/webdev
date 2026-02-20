import express from "express";

const app = express();
const port = 3000;

// meu middleware de log personalizado
function myLogger(req, res, next) {
    console.log("Request: " + req.method);
    console.log("Url: " + req.url);
    next();
}

app.use(myLogger);

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
