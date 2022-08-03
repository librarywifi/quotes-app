const express = require("express");
const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "quotes-app";

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    const quotesCollection = db.collection("quotes");

    app.get("/", (req, res) => {
      quotesCollection
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) => {
          console.error(error);
        });
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("success");
        })
        .catch((error) => console.error(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No Vader quote to delete");
          }
          res.json("Deleted Darth Vader's Quote");
        })
        .catch((error) => console.error(error));
    });

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.listen(process.env.PORT || PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  })
  .catch((error) => console.error(error));
