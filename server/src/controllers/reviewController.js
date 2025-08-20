// controllers/reviewController.js
const Review = require("../models/reviewModel");
const axios = require("axios");
const { normalizeRaw } = require("../utils/normalize");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
///const { useMockData } = require("../controllers/config");
const calculateAverage = require("../utils/calculateAverage");




exports.getHostaway = async (req, res) => {
  try {
    let hostawayRaw = [];
    const account = process.env.HOSTAWAY_ACCOUNT;
    const key = process.env.HOSTAWAY_API_KEY;

    const useMockOnly = !account || !key;

    if (!useMockOnly) {
      try {
        const endpoint = `https://api.hostaway.com/v1/reviews?accountId=${account}`;
        const resp = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${key}` },
          "Content-Type": "application/json",
          timeout: 5000,
        });

        console.log("Status:", resp.status);
        console.log("Data:", resp.data);

        const raw = Array.isArray(resp.data)
          ? resp.data
          : resp.data?.result ?? [];
        hostawayRaw = raw;
      } catch (error) {
        console.error("Hostaway fetch failed:", error.message);
        console.warn("Falling back to mock data due to API error.");
      }
    } else {
      console.warn("API credentials missing. Using mock data only.");
    }

    // Load mock reviews
    const mockPath = path.join(__dirname, "mock-review.json");
    const mockRaw = JSON.parse(fs.readFileSync(mockPath, "utf-8"));
    console.log("Loaded mock reviews:", mockRaw.length);

    // Merge and normalize
    const merged = [...hostawayRaw, ...mockRaw].map((raw) => {
      const n = normalizeRaw(raw);

      n.rating =
        typeof n.rating === "number"
          ? n.rating
          : n.reviewCategory?.length
          ? calculateAverage(n.reviewCategory)
          : null;

      n.categories = Array.isArray(n.categories) ? n.categories : [];
      if (typeof n.approved !== "boolean") n.approved = false;
      n.hostawayId = n.hostawayId || new ObjectId().toString();

      return n;
    });

    // Upsert each review safely
    for (const r of merged) {
      const { hostawayId, approved, ...rest } = r;

      const updateFields = {
        rating: rest.rating,
        publicReview: rest.publicReview,
        categories: rest.categories,
        submittedAt: rest.submittedAt,
        listingName: rest.listingName,
        channel: rest.channel,
      };

      await Review.updateOne(
        { hostawayId },
        { $set: updateFields },
        { upsert: true }
      );
    }

    const all = await Review.find().sort({ submittedAt: -1 }).lean();
    res.json({ status: "success", result: all });
  } catch (err) {
    console.error("getHostaway error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


exports.updateReview = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await Review.findById(id);
    if (!r)
      return res.status(404).json({ status: "error", message: "Not found" });

    r.approved = !r.approved;
    await r.save();
    return res.json({ status: "success", result: r });
  } catch (err) {
    console.error("updateReview error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getPublicReviews = async (req, res) => {
  try {
    const listingName = decodeURIComponent(req.params.listingName);
    const reviews = await Review.find({ listingName, approved: true })
      .sort({ submittedAt: -1 })
      .lean();
    return res.json({
      status: "success",
      result: reviews,
    });
  } catch (err) {
    console.error("getPublicReviews error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};
