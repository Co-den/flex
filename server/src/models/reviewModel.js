const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { _id: false }
);

const ReviewSchema = new mongoose.Schema(
  {
    hostawayId: { type: Number, unique: true, sparse: true },
    id: {
      type: Number,
      unique: true,
      default: () => Math.floor(Math.random() * 1e9),
    },
    type: { type: String, required: true },
    status: { type: String, required: true },
    rating: { type: Number, default: null },
    publicReview: { type: String, default: "" },
    reviewCategory: { type: [CategorySchema], default: [] },
    submittedAt: { type: Date, required: true },
    guestName: { type: String, required: true },
    listingName: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
