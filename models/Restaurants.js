const mongoose = require("mongoose");

const RestaurantsSchema = new mongoose.Schema(
  {
    chain: { type: String, required: true, trim: true },
    locationName: { type: String, required: true, trim: true }, // e.g. "College Park"
    address: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurants", RestaurantsSchema);
