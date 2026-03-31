import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
    session({
        secret: "TOPSECRETWORD", // palavra ou "chave" de acesso
        resave: false, // não salvar no banco de dados
        saveUninitialized: true, // salva sessões não inicializadas
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // duração do cookie (1 dia)
        },
    }),
);
// sempre depois de criar a sessão
app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "wd_secrets",
    password: "eduardo",
    port: 5432,
});
db.connect();

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs", { error: req.session.messages });
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
    // verifica se ha o cookie que diz que está autenticado
    console.log(req.user); // usuário passado pela função passport.use(verify())
    if (req.isAuthenticated()) {
        res.render("secrets.ejs");
    } else {
        res.redirect("/login");
    }
});

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/secrets", // em caso de sucesso na autenticação, redirecionar para /secrets
        failureRedirect: "/login", // em caso de falha na autenticação, redirecionar para /login
        failureMessage: "Autenticação falhou",
    }),
);

app.post("/register", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    try {
        const checkResult = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
        );

        if (checkResult.rows.length > 0) {
            res.render("register.ejs", {
                error: "Email already exists. Try logging in.",
            });
            return;
        }
        // hashing the password and saving it in the database
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                return;
            }

            console.log("Hashed Password:", hash);
            const result = await db.query(
                "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;",
                [email, hash],
            );

            const user = result.rows[0];
            // autentica o usuário passando-o para a sessão e faz a verificação em /secrets
            req.login(user, (err) => {
                console.log(err);
                res.redirect("/secrets");
            });
        });
    } catch (err) {
        console.log(err);
    }
});

// faz a verificação de username e password
// automatiza pegar username e passoword do formulário (não precisa usar body parser)
// é chamado toda vez que tenta autenticar um usuário
// cb - callback function
passport.use(
    new Strategy(async function verify(username, password, cb) {
        try {
            const result = await db.query(
                "SELECT * FROM users WHERE email = $1",
                [username],
            );

            if (result.rows.length <= 0) {
                return cb("User not found.");
            }

            const user = result.rows[0];
            const storedHashPassword = user.password;
            bcrypt.compare(password, storedHashPassword, (err, result) => {
                if (err) {
                    return cb(err);
                }
                if (result) {
                    return cb(null, user); // sem erros, passa o usuário na requesição para que fique acessivel
                } else {
                    return cb(null, false); // senha incorreta - não exatamente um erro, mas um estado
                }
            });
        } catch (err) {
            console.log(err);
        }
    }),
);

// salva os dados do usuário passado no armazenamento local e retorna as
// informações dos usuários
passport.serializeUser((user, cb) => {
    cb(null, user);
});

// desserializa as informações armazenadas do usuário para que possam ser usadas
passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
