const express = require("express");
const axios = require("axios");

const router = express.Router();

// GET /api/weather?city=College%20Park&state=MD
router.get("/weather", async (req, res) => {
  const { city, state } = req.query;
  if (!city || !state) return res.status(400).json({ error: "city and state required" });

  const geoResp = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
    params: { name: `${city}, ${state}`, count: 1, language: "en", format: "json" }
  });

  const hit = geoResp.data?.results?.[0];
  if (!hit) return res.status(404).json({ error: "location not found" });

  const { latitude, longitude } = hit;

  const weatherResp = await axios.get("https://api.open-meteo.com/v1/forecast", {
    params: { latitude, longitude, current: "temperature_2m,weather_code,wind_speed_10m" }
  });

  res.json({
    city,
    state,
    latitude,
    longitude,
    current: weatherResp.data?.current ?? null
  });
});

module.exports = router;
