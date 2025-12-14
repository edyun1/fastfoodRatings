const mongoose = require("mongoose");

const RatingsSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurants",
      required: true
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ratings", RatingsSchema);
