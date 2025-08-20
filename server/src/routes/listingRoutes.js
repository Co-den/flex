const express = require("express");
const {
  seedListings,
  getPublicListing,
  getAllListings
} = require("../controllers/listingController");

const router = express.Router();

router.get("/", getAllListings);
// POST /api/listings/seed
router.post("/seed", seedListings);

// GET  /api/listings/public/:listingName
router.get("/public/:listingName", getPublicListing);

module.exports = router;
