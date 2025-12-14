require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const restaurantsRouter = require("./routes/restaurants");
const apiRouter = require("./routes/api");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/restaurants", restaurantsRouter);
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.render("index");
});

async function start() {
  if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI in environment");
  await mongoose.connect(process.env.MONGODB_URI);

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Listening on ${port}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
