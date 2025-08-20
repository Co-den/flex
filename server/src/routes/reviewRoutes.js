const express = require("express");

const reviewController = require("../controllers/reviewController");


const router = express.Router();

// GET /api/reviews/hostaway
router.get("/hostaway", reviewController.getHostaway);

// PATCH /api/reviews/:id/approve  (toggle)
router.patch("/:id/approve", reviewController.updateReview);

// GET /api/reviews/public/:listingName
router.get("/public/:listingName", reviewController.getPublicReviews);

module.exports = router;
