function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function inferChannelText(text) {
  if (!text) return "Unknown";
  const t = text.toLowerCase();
  if (t.includes("airbnb")) return "Airbnb";
  if (t.includes("booking")) return "Booking";
  if (t.includes("google")) return "Google";
  if (t.includes("website") || t.includes("direct")) return "Direct";
  return "Unknown";
}

/**
 * Takes a raw Hostaway-like object and returns normalized shape.
 */
function normalizeRaw(raw) {
  const reviewCategories = raw.reviewCategory || [];
  const categoryAvg = reviewCategories.length > 0
    ? Math.round((reviewCategories.reduce((s, c) => s + (c.rating ?? 0), 0) / reviewCategories.length) / 2)
    : null;

  const stars = raw.rating ?? categoryAvg ?? 0;

  return {
    hostawayId: String(raw.id ?? raw.hostawayId ?? Math.random()),
    listingId: raw.listingId ?? raw.listingName ?? "unknown",
    listingName: raw.listingName ?? "unknown",
    channel: inferChannelText((raw.listingName || "") + " " + (raw.publicReview || "")),
    type: raw.type || "guest-to-host",
    status: raw.status || "published",
    rating: clamp(Number(stars), 0, 5),
    publicReview: raw.publicReview || "",
    categories: reviewCategories.map(c => ({ key: c.category, score10: c.rating ?? null })),
    submittedAt: raw.submittedAt ? new Date(raw.submittedAt) : new Date(),
    guestName: raw.guestName || "Guest",
    approved: false
  };
}

module.exports = { normalizeRaw };
