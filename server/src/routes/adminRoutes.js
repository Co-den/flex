// server/src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");


// PATCH /api/admin/listings/:id/placeId  -> { placeId }
router.patch("/listings/:id/placeId", adminController.admin);

module.exports = router;
