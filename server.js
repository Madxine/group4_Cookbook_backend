const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const cors = require("cors");
app.use(cors());
const { Pool } = require("pg");
const pool = new Pool();

const port = process.env.PORT || 8080;

// "http:localhost:8080/api/?query=honey"

app.get("/", (req, res) => {
  res.send("working");
});

app.get("/api", (req, res) => {
  console.log(req.query);
  if (!Object.keys(req.query).length) {
    pool.connect().then((client) => {
      return client
        .query("SELECT * FROM desert;")
        .then((data) => {
          client.release();
          res.json(data.rows);
        })
        .catch((err) => {
          client.release();
          res.sendStatus(500);
        });
    });
  }
  if (req.query.word) {
    const queryWord = req.query.word;
    // console.log(queryWord);
    pool.connect().then((client) => {
      return client
        .query(
          "SELECT * FROM desert WHERE name ILIKE $1 OR ingridients ILIKE $1 OR description ILIKE $1;",
          [`%${queryWord}%`]
        )
        .then((data) => {
          client.release();
          res.json(data.rows);
        })
        .catch((err) => {
          client.release();
          console.log(err);
        });
    });
  }
});

app.get("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
