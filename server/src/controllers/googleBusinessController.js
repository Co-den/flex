const { listReviewsForLocation } = require("../integration/googleBusiness");

exports.googleBusinessReviews = async (req, res) => {
  try {
    const { resourceName } = req.query;
    if (!resourceName) return res.status(400).json({ status: "error", message: "resourceName required" });
    const reviews = await listReviewsForLocation(resourceName);
    res.json({ status: "success", result: reviews });
  } catch (err) {
    console.error("google-business error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
}