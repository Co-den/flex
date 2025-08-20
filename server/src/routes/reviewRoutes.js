// server/src/routes/reviewRoutes.js
const express = require("express");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

/**
 * Public endpoints
 */
// GET /api/reviews/hostaway  -> sync & return reviews
router.get("/hostaway", reviewController.getHostaway);

// GET /api/reviews/public/:listingName -> public-facing approved + showPublic reviews
router.get("/public/:listingName", reviewController.getPublicReviews);

/**
 * Reporting / analytics
 */
// GET /api/reviews/reports/performance?from=...&to=...
router.get("/reports/performance", reviewController.getPerformance);

// GET /api/reviews/reports/trends?listing=...&from=...&to=...
router.get("/reports/trends", reviewController.getTrends);

/**
 * CRUD / management
 */
// Generic GET with filters & pagination: GET /api/reviews?listing=...&q=...&page=...
router.get("/", reviewController.getReviews);

// PATCH /api/reviews/:id/approve -> toggle approved
router.patch("/:id/approve", reviewController.updateReview);

// PATCH /api/reviews/:id/show-public -> toggle showPublic
router.patch("/:id/show-public", reviewController.toggleShowPublic);

module.exports = router;
