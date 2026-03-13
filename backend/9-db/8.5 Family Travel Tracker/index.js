import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "wd_world2",
    password: "eduardo",
    port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;
let userError = null;

let users = [
    { id: 1, name: "Angela", color: "teal" },
    { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted() {
    const result = await db.query(
        "SELECT country_code FROM visited_countries WHERE user_id = $1",
        [currentUserId],
    );
    const countries = result.rows.map((country) => country.country_code);
    return countries;
}

async function getCurrentUser() {
    const result = await db.query("SELECT * FROM users ORDER BY id ASC;");
    users = result.rows;
    console.log(users);
    return users.find((user) => user.id == currentUserId);
}

app.get("/", async (req, res) => {
    console.log(currentUserId);

    const countries = await checkVisisted();
    const currentUser = await getCurrentUser();

    res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: users,
        color: currentUser.color,
        error: userError?.message || null,
    });
    userError = null;
});
app.post("/add", async (req, res) => {
    const input = req.body.country;
    try {
        let response = await db.query(
            "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
            [input.toLowerCase()],
        );
        if (response.rows.length === 0) {
            throw new Error("Country name not found.");
        }

        if (response.rows.length > 1) {
            throw new Error("Many countries found. Please, be more specific.");
        }

        if (response.rows.length == 0) return;

        try {
            const countryCode = response.rows[0].country_code;
            response = await db.query(
                "SELECT * FROM visited_countries WHERE country_code = $1 AND user_id = $2;",
                [countryCode, currentUserId],
            );
            // o pais ja foi adicionado para o usuário atual
            if (response.rows.length > 0) throw new Error();
            response = await db.query(
                "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
                [countryCode, currentUserId],
            );
        } catch (error) {
            throw new Error("Country already added.");
        }

        res.redirect("/");
    } catch (error) {
        console.error(error);
        userError = error;
        res.redirect("/");
    }
});
app.post("/user", async (req, res) => {
    if (req.body.add === "new") {
        res.render("new.ejs");
    } else {
        // verifica se o usuário selecionado existe
        const userId = req.body.user;
        const result = await db.query(
            "SELECT * FROM users WHERE users.id = $1;",
            [userId],
        );
        currentUserId = result.rows.length !== 0 ? userId : 1;
        res.redirect("/");
    }
});

app.post("/new", async (req, res) => {
    //Hint: The RETURNING keyword can return the data that was inserted.
    //https://www.postgresql.org/docs/current/dml-returning.html
    const name = req.body.name;
    const color = req.body.color;
    console.log(name, color);

    try {
        result = await db.query(
            "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *;",
            [name, color],
        );
        console.log(result.rows);

        const id = result.rows[0].id;
        currentUserId = id;

        res.redirect("/");
    } catch (error) {
        console.error(error);
        userError = new Error("User already added.");
        res.redirect("/");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
