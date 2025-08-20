const express = require("express");
const router = express.Router();
const googleBusinessController = require("../controllers/googleBusinessController");

// GET /api/external/google-business?resourceName=accounts/123/locations/456
router.get("/google-business", googleBusinessController.googleBusinessReviews);

module.exports = router;
