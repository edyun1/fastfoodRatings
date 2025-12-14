const express = require("express");
const Restaurants = require("../models/Restaurants");
const Ratings = require("../models/Ratings");

const router = express.Router();

const CHAINS = [
  { chain: "McDonald's", domain: "mcdonalds.com" },
  { chain: "Chick-fil-A", domain: "chick-fil-a.com" },
  { chain: "Wendy's", domain: "wendys.com" },
  { chain: "Burger King", domain: "burgerking.com" },
  { chain: "Taco Bell", domain: "tacobell.com" },
  { chain: "Subway", domain: "subway.com" },
  { chain: "KFC", domain: "kfc.com" },
  { chain: "Chipotle", domain: "chipotle.com" },
  { chain: "Domino's", domain: "dominos.com" },
  { chain: "Pizza Hut", domain: "pizzahut.com" }
];

router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  const filter = q
    ? {
        $or: [
          { chain: new RegExp(q, "i") },
          { city: new RegExp(q, "i") },
          { state: new RegExp(q, "i") }
        ]
      }
    : {};

  const restaurants = await Restaurants.find(filter).sort({ createdAt: -1 });
  res.render("restaurants/list", { restaurants, q });
});

router.get("/new", (req, res) => {
  res.render("restaurants/new", { chains: CHAINS });
});

router.post("/", async (req, res) => {
  const { chain, city, state, address } = req.body;
  const found = CHAINS.find((c) => c.chain === chain);

  await Restaurants.create({
    chain,
    domain: found ? found.domain : "example.com",
    city: (city || "").trim(),
    state: (state || "").trim().toUpperCase(),
    address: (address || "").trim()
  });

  res.redirect("/restaurants");
});

router.post("/clear", async (req, res) => {
  await Restaurants.deleteMany({});
  await Ratings.deleteMany({});
  res.redirect("/restaurants");
});

router.get("/:id", async (req, res) => {
  const restaurant = await Restaurants.findById(req.params.id);
  if (!restaurant) return res.status(404).send("Not found");

  const ratings = await Ratings.find({ restaurantId: restaurant._id }).sort({ createdAt: -1 });

  const avg =
    ratings.length === 0
      ? null
      : ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;

  res.render("restaurants/detail", {
    restaurant,
    ratings,
    avg,
    count: ratings.length
  });
});

router.get("/:id/ratings/new", async (req, res) => {
  const restaurant = await Restaurants.findById(req.params.id);
  if (!restaurant) return res.status(404).send("Not found");
  res.render("restaurants/rating-new", { restaurant });
});

router.post("/:id/ratings", async (req, res) => {
  const restaurant = await Restaurants.findById(req.params.id);
  if (!restaurant) return res.status(404).send("Not found");

  await Ratings.create({
    restaurantId: restaurant._id,
    rating: Number(req.body.rating)
  });

  res.redirect(`/restaurants/${restaurant._id}`);
});

module.exports = router;
