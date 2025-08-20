const fs = require("fs");
const path = require("path");
const Listing = require("../models/listingModel");
const Review = require("../models/reviewModel");




// GET /api/listings
exports.getAllListings = async (req, res) => {
  try {
    const all = await Listing.find().sort({ listingName: 1 }).lean();
    res.json({ status: "success", result: all });
  } catch (err) {
    console.error("getAllListings error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


// Seed (idempotent) a few listings from mock file
exports.seedListings = async (_req, res) => {
  try {
    const mockPath = path.join(__dirname, "mock-listing.json");
    const rows = JSON.parse(fs.readFileSync(mockPath, "utf-8"));

    for (const row of rows) {
      await Listing.updateOne(
        { listingName: row.listingName },
        { $set: row },
        { upsert: true }
      );
    }
    res.json({ status: "success", result: rows.length });
  } catch (err) {
    console.error("seedListings error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a listing + its approved reviews (by listingName)
exports.getPublicListing = async (req, res) => {
  try {
    const listingName = decodeURIComponent(req.params.listingName);
    const listing = await Listing.findOne({ listingName }).lean();
    if (!listing) {
      return res.status(404).json({ status: "error", message: "Listing not found" });
    }

    const reviews = await Review.find({ listingName, approved: true })
      .sort({ submittedAt: -1 })
      .lean();

    res.json({ status: "success", result: { listing, reviews } });
  } catch (err) {
    console.error("getPublicListing error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
