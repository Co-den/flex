// server/src/integrations/googlePlaces.js
const axios = require("axios");
const PLACES_KEY = process.env.GOOGLE_PLACES_KEY;
const cache = require("../utils/caching");

if (!PLACES_KEY) {
  console.warn("GOOGLE_PLACES_KEY not set — Google Places calls will fail");
}

async function getPlaceIdFromText(text) {
  if (!text) return null;
  const cacheKey = `find:${text}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`;
  const resp = await axios.get(url, {
    params: {
      key: PLACES_KEY,
      input: text,
      inputtype: "textquery",
      fields: "place_id",
    },
    timeout: 8000,
  });
  const id = resp.data?.candidates?.[0]?.place_id || null;
  if (id) cache.set(cacheKey, id, 1000 * 60 * 60); // cache for 1 hour
  return id;
}

async function getPlaceDetails(placeId) {
  if (!placeId) throw new Error("placeId required");
  const cacheKey = `place:${placeId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `https://maps.googleapis.com/maps/api/place/details/json`;
  const resp = await axios.get(url, {
    params: {
      key: PLACES_KEY,
      place_id: placeId,
      fields:
        "place_id,name,rating,user_ratings_total,reviews,formatted_address,website",
    },
    timeout: 10000,
  });

  const result = resp.data?.result || null;
  if (result) {
    // cache for 10 minutes
    cache.set(cacheKey, result, 1000 * 60 * 10);
  }
  return result;
}

module.exports = { getPlaceIdFromText, getPlaceDetails, cache };
