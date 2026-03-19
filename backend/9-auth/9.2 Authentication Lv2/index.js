import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt, { hash } from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "wd_secrets",
    password: "eduardo",
    port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    try {
        const checkResult = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
        );

        if (checkResult.rows.length > 0) {
            res.send("Email already exists. Try logging in.");
        } else {
            // password hashing
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error("Error hashing: " + err);
                    return;
                }
                const result = await db.query(
                    "INSERT INTO users (email, password) VALUES ($1, $2)",
                    [email, hash],
                );
                console.log(result.rows);
                res.render("secrets.ejs");
            });
        }
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    const loginEmail = req.body.username;
    const loginPassword = req.body.password;

    try {
        const findUser = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [loginEmail],
        );
        if (findUser.rows.length > 0) {
            const user = findUser.rows[0];
            const storedHashedPassword = user.password;

            bcrypt.compare(
                loginPassword,
                storedHashedPassword,
                (err, result) => {
                    if (err) {
                        console.error("Error hashing: " + err);
                        return;
                    }

                    // result eh V ou F
                    if (result) {
                        res.render("secrets.ejs");
                    } else {
                        res.send("Incorrect Password");
                    }
                },
            );
        } else {
            res.send("User not found");
        }
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
