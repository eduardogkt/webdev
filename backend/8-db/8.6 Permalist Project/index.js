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
    database: "wd_permalist",
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
    // { id: 1, title: "Buy milk" },
    // { id: 2, title: "Finish homework" },
];

async function getItems() {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC;");
    console.log(result.rows);
    return result.rows;
}

app.get("/", async (req, res) => {
    try {
        items = await getItems();
        res.render("index.ejs", {
            listTitle: "Today",
            listItems: items,
        });
    } catch (error) {
        console.error(error);
    }
});

app.post("/add", async (req, res) => {
    const item = req.body.newItem;
    try {
        const result = await db.query(
            "INSERT INTO items (text) VALUES ($1) RETURNING *;",
            [item],
        );
        console.log(result.rows[0]);
        res.redirect("/");
    } catch (error) {
        console.error(error);
    }
});

app.post("/edit", async (req, res) => {
    const itemId = req.body.updatedItemId;
    const itemText = req.body.updatedItemTitle;
    try {
        const result = await db.query(
            "UPDATE items SET text = $1 WHERE id = $2 RETURNING *;",
            [itemText, itemId],
        );
        console.log(result.rows[0]);
        res.redirect("/");
    } catch (error) {
        console.error(error);
    }
});

app.post("/delete", async (req, res) => {
    const itemId = req.body.deleteItemId;
    try {
        const result = await db.query(
            "DELETE FROM items WHERE items.id = $1 RETURNING *;",
            [itemId],
        );
        console.log(result.rows[0]);
        res.redirect("/");
    } catch (error) {
        console.error(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
