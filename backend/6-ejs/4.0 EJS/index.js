import express from "express";

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});

app.get("/", (req, res) => {
    const today = new Date().getDay();

    let day = "a weekday";
    let advice = "it's time to work!";

    if (today == 0 || today == 6) {
        day = "the weekend";
        advice = "it's time to have some fun!";
    }
    res.render("index.ejs", { day: day, advice: advice });
});
