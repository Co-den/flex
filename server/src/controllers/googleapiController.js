const {
  getPlaceIdFromText,
  getPlaceDetails,
} = require("../integration/googlePlaces");

/**
 * GET /api/external/google-reviews?placeId=... or ?q=...
 * Response: { status:'success', result: { placeId, name, address, rating, user_ratings_total, reviews } }
 */
exports.googleReviews = async (req, res) => {
  try {
    const { placeId, q } = req.query;
    let id = placeId;
    if (!id && q) {
      id = await getPlaceIdFromText(q);
      if (!id)
        return res
          .status(404)
          .json({ status: "error", message: "place not found" });
    }
    if (!id)
      return res
        .status(400)
        .json({ status: "error", message: "placeId or q required" });

    const result = await getPlaceDetails(id);
    if (!result)
      return res
        .status(404)
        .json({ status: "error", message: "place not found" });

    const reviews = (result.reviews || []).map((r) => ({
      authorName: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.time,
      relativeTimeDescription: r.relative_time_description,
      profilePhotoUrl: r.profile_photo_url,
    }));

    return res.json({
      status: "success",
      result: {
        placeId: result.place_id,
        name: result.name,
        address: result.formatted_address,
        rating: result.rating,
        user_ratings_total: result.user_ratings_total,
        reviews,
      },
    });
  } catch (err) {
    console.error(
      "google-reviews error:",
      err?.response?.data || err.message || err
    );
    return res.status(500).json({ status: "error", message: err.message });
  }
};
