import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "wd_world",
    password: "eduardo",
    port: 5432,
});

db.connect();

db.query("SELECT * FROM capitals", (err, res) => {
    if (err) {
        console.error("Error executing query", err.stack);
    } else {
        quiz = res.rows;
    }
    db.end();
});
