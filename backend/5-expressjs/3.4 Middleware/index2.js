import express from "express";
import morgan from "morgan";

const app = express();
const port = 3000;

// mostar o log das requisições, executado antes de qualquer rota
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
