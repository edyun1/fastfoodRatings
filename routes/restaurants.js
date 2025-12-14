const express = require("express");
const Restaurants = require("../models/Restaurants");
const Ratings = require("../models/Ratings");

const router = express.Router();

router.get("/", async (req, res) => {
  const restaurants = await Restaurants.find().sort({ createdAt: -1 });
  res.render("restaurants/list", { restaurants });
});

router.get("/new", (req, res) => {
  res.render("restaurants/new");
});

router.post("/", async (req, res) => {
  const { chain, locationName, address, city, state } = req.body;
  await Restaurants.create({ chain, locationName, address, city, state });
  res.redirect("/restaurants");
});

router.get("/:id", async (req, res) => {
  const restaurant = await Restaurants.findById(req.params.id);
  if (!restaurant) return res.status(404).send("Restaurant not found");

  const ratings = await Ratings.find({ restaurantId: restaurant._id }).sort({ createdAt: -1 });

  const avg =
    ratings.length === 0
      ? null
      : ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;

  res.render("restaurants/detail", { restaurant, ratings, avg });
});

router.get("/:id/ratings/new", async (req, res) => {
  const restaurant = await Restaurants.findById(req.params.id);
  if (!restaurant) return res.status(404).send("Restaurant not found");
  res.render("restaurants/rating-new", { restaurant });
});

router.post("/:id/ratings", async (req, res) => {
  const restaurant = await Restaurants.findById(req.params.id);
  if (!restaurant) return res.status(404).send("Restaurant not found");

  const { rating, title, body } = req.body;

  await Ratings.create({
    restaurantId: restaurant._id,
    rating: Number(rating),
    title,
    body
  });

  res.redirect(`/restaurants/${restaurant._id}`);
});

module.exports = router;
