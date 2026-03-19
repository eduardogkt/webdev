import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    password: "eduardo",
    host: "localhost",
    port: 5432,
    database: "wd_world",
});

db.connect();

async function getCountries() {
    const response = await db.query(
        "SELECT country_code FROM visited_countries;",
    );
    const countries = response.rows.map((country) => country.country_code);
    console.log(countries);

    return countries;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const countries = await getCountries();
        res.render("index.ejs", {
            countries: countries,
            total: countries.length,
        });
    } catch (error) {
        console.error(error);
    }
});

app.post("/add", async (req, res) => {
    try {
        const input = req.body.country;
        let response = await db.query(
            "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
            [input.toLowerCase()],
        );
        if (response.rows.length === 0) {
            throw new Error("Country name not found.");
        }

        if (response.rows.length == 0) return;

        try {
            const countryCode = response.rows[0].country_code;
            response = await db.query(
                "INSERT INTO visited_countries (country_code) VALUES ($1)",
                [countryCode],
            );
        } catch (error) {
            throw new Error("Country already added.");
        }

        res.redirect("/");
    } catch (error) {
        console.error(error);
        const countries = await getCountries();
        res.render("index.ejs", {
            total: countries.length,
            countries: countries,
            error: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
