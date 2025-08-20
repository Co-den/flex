const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  category: String,
  rating: Number,
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true }, // original provider id
  hostawayId: String,
  listingName: { type: String, index: true },
  rating: Number,
  publicReview: String,
  reviewCategory: [CategorySchema], // raw hostaway
  categories: [CategorySchema], // normalized
  channel: { type: String, index: true },
  submittedAt: { type: Date, index: true },
  approved: { type: Boolean, default: false, index: true },
  showPublic: { type: Boolean, default: false, index: true }, // NEW
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);
