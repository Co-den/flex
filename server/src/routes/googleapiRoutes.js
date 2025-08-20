const express = require("express");
const router = express.Router();

const googleController = require("../controllers/googleapiController");
/**
 * GET /api/external/google-reviews
 * Query:
 *  - placeId (preferred)
 *  - q (fallback search string)
 */
router.get("/google-reviews", googleController.googleReviews);

module.exports = router;
