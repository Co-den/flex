
const Listing = require("../models/listingModel"); 

exports.admin =async (req, res) => {
  try {
    const id = req.params.id;
    const { placeId } = req.body;
    if (!placeId) return res.status(400).json({ status: "error", message: "placeId required" });

    const updated = await Listing.findByIdAndUpdate(
      id,
      { $set: { placeId } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ status: "error", message: "Listing not found" });

    res.json({ status: "success", result: updated });
  } catch (err) {
    console.error("admin update placeId error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
}