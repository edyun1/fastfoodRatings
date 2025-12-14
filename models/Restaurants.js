const mongoose = require("mongoose");

const RestaurantsSchema = new mongoose.Schema(
  {
    chain: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, uppercase: true, match: /^[A-Z]{2}$/ },
    address: { type: String, trim: true, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurants", RestaurantsSchema);
