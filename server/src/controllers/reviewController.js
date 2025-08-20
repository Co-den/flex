// server/src/controllers/reviewController.js
const Review = require("../models/reviewModel");
const axios = require("axios");
const { normalizeRaw } = require("../utils/normalize");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const calculateAverage = require("../utils/calculateAverage");

/**
 * Helper: parse date range params into a Mongo query object
 */
function parseDateRange(from, to) {
  if (!from && !to) return null;
  const obj = {};
  if (from) obj.$gte = new Date(from);
  if (to) obj.$lte = new Date(to);
  return obj;
}

/**
 * GET /api/reviews/hostaway
 * Sync from Hostaway (if creds) + mock, normalize, upsert, and return all reviews.
 */
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

        const raw = Array.isArray(resp.data) ? resp.data : resp.data?.result ?? [];
        hostawayRaw = raw;
      } catch (error) {
        console.warn("Hostaway fetch failed (continuing with mock).", error.message || error);
      }
    } else {
      console.warn("API credentials missing. Using mock data only.");
    }

    // Load mock reviews (throws if not found)
    const mockPath = path.join(__dirname, "mock-review.json");
    let mockRaw = [];
    try {
      mockRaw = JSON.parse(fs.readFileSync(mockPath, "utf-8"));
    } catch (err) {
      console.warn("Could not load mock-review.json:", err.message || err);
      mockRaw = [];
    }

    // Merge and normalize
    const merged = [...hostawayRaw, ...mockRaw].map((raw) => {
      const n = normalizeRaw(raw);

      n.rating =
        typeof n.rating === "number"
          ? n.rating
          : n.reviewCategory?.length
          ? calculateAverage(n.reviewCategory)
          : null;

      // ensure categories array shape
      n.categories = Array.isArray(n.categories) ? n.categories : (n.reviewCategory || []).map(rc => ({ category: rc.category, rating: rc.rating }));
      if (typeof n.approved !== "boolean") n.approved = false;
      // ensure hostawayId exists
      n.hostawayId = n.hostawayId || (typeof n.id !== "undefined" ? String(n.id) : new ObjectId().toString());

      return n;
    });

    // Upsert each review while preserving manual fields like `approved` and setting defaults on insert
    for (const r of merged) {
      const { hostawayId } = r;

      const updateFields = {
        rating: r.rating,
        publicReview: r.publicReview,
        categories: r.categories,
        submittedAt: r.submittedAt,
        listingName: r.listingName,
        channel: r.channel,
        guestName: r.guestName,
      };

      // use findOneAndUpdate with setDefaultsOnInsert to preserve defaults (approved default)
      await Review.findOneAndUpdate(
        { hostawayId },
        {
          $set: updateFields,
          $setOnInsert: {
            hostawayId,
            createdAt: new Date(),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).exec();
    }

    const all = await Review.find().sort({ submittedAt: -1 }).lean();
    return res.json({ status: "success", result: all });
  } catch (err) {
    console.error("getHostaway error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * GET /api/reviews
 * Generic review fetch with filters, search and pagination.
 * Query params supported:
 *  - q (text)
 *  - listing
 *  - category
 *  - channel
 *  - minRating, maxRating
 *  - approved (true/false)
 *  - showPublic (true/false)
 *  - from, to (ISO dates)
 *  - sort (e.g. submittedAt:desc)
 *  - page, limit
 */
exports.getReviews = async (req, res) => {
  try {
    const {
      q,
      listing,
      category,
      channel,
      minRating,
      maxRating,
      approved,
      showPublic,
      from,
      to,
      sort = "submittedAt:desc",
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};

    if (listing && listing !== "All") filter.listingName = listing;
    if (channel) filter.channel = channel;
    if (approved !== undefined) filter.approved = approved === "true";
    if (showPublic !== undefined) filter.showPublic = showPublic === "true";

    if (minRating !== undefined || maxRating !== undefined) {
      filter.rating = {};
      if (minRating !== undefined) filter.rating.$gte = Number(minRating);
      if (maxRating !== undefined) filter.rating.$lte = Number(maxRating);
    }

    const dateRange = parseDateRange(from, to);
    if (dateRange) filter.submittedAt = dateRange;
    if (category) filter["categories.category"] = category;

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ publicReview: regex }, { guestName: regex }, { listingName: regex }];
    }

    const [sortField, sortDir] = (sort || "submittedAt:desc").split(":");
    const sortObj = { [sortField]: sortDir === "asc" ? 1 : -1 };

    const pageN = Math.max(Number(page), 1);
    const lim = Math.min(Number(limit) || 50, 500);

    const [items, total] = await Promise.all([
      Review.find(filter).sort(sortObj).skip((pageN - 1) * lim).limit(lim).lean(),
      Review.countDocuments(filter),
    ]);

    return res.json({ status: "success", result: items, meta: { total, page: pageN, limit: lim } });
  } catch (err) {
    console.error("getReviews error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * PATCH /api/reviews/:id/approve
 * Toggle approved flag (existing behaviour preserved)
 */
exports.updateReview = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await Review.findById(id);
    if (!r) return res.status(404).json({ status: "error", message: "Not found" });

    r.approved = !r.approved;
    await r.save();
    return res.json({ status: "success", result: r });
  } catch (err) {
    console.error("updateReview error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * PATCH /api/reviews/:id/show-public
 * Toggle showPublic flag for a review (used to publish selected reviews on public page)
 */
exports.toggleShowPublic = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await Review.findById(id);
    if (!r) return res.status(404).json({ status: "error", message: "Not found" });

    r.showPublic = !r.showPublic;
    await r.save();
    return res.json({ status: "success", result: r });
  } catch (err) {
    console.error("toggleShowPublic error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * GET /api/reviews/public/:listingName
 * Return only approved reviews for public pages (existing behaviour preserved).
 */
exports.getPublicReviews = async (req, res) => {
  try {
    const listingName = decodeURIComponent(req.params.listingName || "");
    const reviews = await Review.find({ listingName, approved: true, showPublic: true })
      .sort({ submittedAt: -1 })
      .lean();
    return res.json({ status: "success", result: reviews });
  } catch (err) {
    console.error("getPublicReviews error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * GET /api/reviews/reports/performance
 * Returns per-listing aggregates: avgRating, totalReviews, approvedCount, showPublicCount
 * Optional query params: from, to
 */
exports.getPerformance = async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.submittedAt = {};
      if (from) match.submittedAt.$gte = new Date(from);
      if (to) match.submittedAt.$lte = new Date(to);
    }

    const pipeline = [
      { $match: Object.keys(match).length ? match : {} },
      {
        $group: {
          _id: "$listingName",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          approvedCount: { $sum: { $cond: ["$approved", 1, 0] } },
          showPublicCount: { $sum: { $cond: ["$showPublic", 1, 0] } },
        },
      },
      { $sort: { avgRating: -1 } },
    ];

    const rows = await Review.aggregate(pipeline).exec();
    return res.json({ status: "success", result: rows });
  } catch (err) {
    console.error("getPerformance error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * GET /api/reviews/reports/trends
 * Returns time-series aggregates (by day) for a listing or overall.
 * Query params: listing, from, to, interval (day|week) — interval currently treated as day
 */
exports.getTrends = async (req, res) => {
  try {
    const { listing, from, to, interval = "day" } = req.query;
    const match = {};
    if (listing) match.listingName = listing;
    if (from || to) {
      match.submittedAt = {};
      if (from) match.submittedAt.$gte = new Date(from);
      if (to) match.submittedAt.$lte = new Date(to);
    }

    // group by day string
    const dateFormat = "%Y-%m-%d"; // daily buckets
    const pipeline = [
      { $match: match },
      {
        $project: {
          day: { $dateToString: { format: dateFormat, date: "$submittedAt" } },
          rating: "$rating",
          categories: "$categories",
        },
      },
      {
        $group: {
          _id: "$day",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
          categories: { $push: "$categories" },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const rows = await Review.aggregate(pipeline).exec();

    // Optionally: flatten categories counts per day (could be heavy) — client can process categories if desired.
    return res.json({ status: "success", result: rows });
  } catch (err) {
    console.error("getTrends error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};
