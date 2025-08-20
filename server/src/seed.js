require("dotenv").config();
const mongoose = require("mongoose");
const Review = require("./models/Review");
const mock = require("../mock-reviews.json");
const { normalizeRaw } = require("./lib/normalize");

const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flexliving";

async function run() {
  await mongoose.connect(MONGO);
  console.log("Seeding DB...");
  await Review.deleteMany({});
  const normalized = mock.map(normalizeRaw);
  await Review.insertMany(normalized);
  console.log("Seeded", normalized.length, "reviews.");
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
