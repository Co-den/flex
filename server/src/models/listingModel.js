const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  // use the same string you put in reviews.listingName
  listingName: { type: String, required: true, unique: true },

  // basic property details to render the public page
  slug: { type: String, required: true, unique: true },
  address: String,
  city: String,
  country: String,
  bedrooms: Number,
  bathrooms: Number,
  sleeps: Number,
  sqft: Number,
  nightlyFrom: Number, 
  heroImage: String,
  gallery: [String],
  highlights: [String],
  description: String,
});

module.exports = mongoose.model("Listing", listingSchema);
