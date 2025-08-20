// client/src/pages/PublicPage.jsx
import React, { useState, useEffect } from "react";
import { usePublicListing } from "../hooks/usePublicListing";
import { useListings } from "../hooks/useListing";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonReviewCard from "../components/SkeletonReviewCard";
import SafeImage from "../components/SafeImage";
import { useGoogleReviews } from "../hooks/useGoogleReviews";
import AdminPlaceIdEditor from "../components/AdminPlaceIdEditor";

/* Small star helper (keeps your previous behavior) */
function Stars({ categories }) {
  const valid = Array.isArray(categories) ? categories.filter((c) => c?.rating != null) : [];
  if (valid.length === 0) return null;
  const avg10 = valid.reduce((s, c) => s + c.rating, 0) / valid.length;
  const full = Math.round(avg10 / 2);
  return (
    <div className="flex gap-1 text-yellow-500 mt-1" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < full ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function PublicPage({ listingName: initialListingName, onBack }) {
  const [selectedListing, setSelectedListing] = useState(initialListingName || "");
  const { listing, reviews, loading, error } = usePublicListing(selectedListing);
  const { listings, loading: listingsLoading, error: listingsError } = useListings();

  // Keep a local copy of listing so admin edits can update UI immediately.
  const [localListing, setLocalListing] = useState(null);
  useEffect(() => {
    setLocalListing(listing || null);
  }, [listing]);

  // Google reviews: use localListing.placeId when available, otherwise fallback to listingName query
  const placeQuery = localListing?.placeId ? { placeId: localListing.placeId } : { q: selectedListing };
  const { loading: googleLoading, result: googleResult, error: googleError } = useGoogleReviews(placeQuery);

  // allow users to hide/show google block if they prefer
  const [showGoogle, setShowGoogle] = useState(true);

  useEffect(() => {
    if (initialListingName) setSelectedListing(initialListingName);
  }, [initialListingName]);

  const handleChange = (e) => {
    setSelectedListing(e.target.value);
  };

  return (
    <div className="mt-6" aria-busy={loading}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-blue-600 hover:underline mr-2">
            ← Back
          </button>
          <span className="text-gray-700">Public Property View</span>
        </div>

        <div className="flex items-center gap-2">
          {listingsLoading ? (
            <div className="text-sm text-gray-500">Loading listings…</div>
          ) : listingsError ? (
            <div className="text-sm text-red-600">{listingsError}</div>
          ) : (
            <select
              value={selectedListing}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
              aria-label="Select property"
            >
              <option value="">Select a property…</option>
              {listings.map((l) => (
                <option key={l.listingName || l} value={l.listingName || l}>
                  {l.listingName || l}
                </option>
              ))}
            </select>
          )}

          {/* Google toggle */}
          <label className="inline-flex items-center ml-2 text-sm">
            <input
              type="checkbox"
              checked={showGoogle}
              onChange={(e) => setShowGoogle(e.target.checked)}
              className="mr-2"
            />
            Google reviews
          </label>
        </div>
      </div>

      {/* Property header */}
      <div className="property-header mb-6">
        {selectedListing === "" ? (
          <div className="text-gray-500">Choose a property to view its details and approved reviews.</div>
        ) : loading ? (
          <div className="mb-4 flex items-center gap-3">
            <LoadingSpinner size={28} />
            <div className="text-gray-600">Loading property…</div>
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !localListing ? (
          <div className="text-gray-500">No property found for “{selectedListing}”.</div>
        ) : (
          <>
            {/* hero image */}
            {localListing.heroImage ? (
              <SafeImage
                src={localListing.heroImage}
                alt={localListing.listingName}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-56 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                No hero image
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{localListing.listingName}</h1>
                <p className="text-gray-600">
                  {localListing.address ? `${localListing.address}, ` : ""}
                  {localListing.city}
                  {localListing.country ? `, ${localListing.country}` : ""}
                </p>
                <Stars categories={localListing.categories || []} />
              </div>

              <div className="text-sm text-gray-700">
                <div className="font-semibold">From £{localListing.nightlyFrom} / night</div>
                <div>
                  {localListing.bedrooms} bd · {localListing.bathrooms} ba · sleeps {localListing.sleeps}
                  {localListing.sqft ? ` · ${localListing.sqft} sqft` : ""}
                </div>
              </div>
            </div>

            {localListing.highlights?.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-3">
                {localListing.highlights.map((h) => (
                  <li key={h} className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs">
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {localListing.gallery?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {localListing.gallery.map((src, i) => (
                  <SafeImage
                    key={i}
                    src={src}
                    alt={`${localListing.listingName} ${i + 1}`}
                    className="w-full h-36 object-cover rounded"
                  />
                ))}
              </div>
            )}

            {localListing.description && <p className="text-gray-700 mt-4">{localListing.description}</p>}

            {/* Admin placeId editor (shows when listing exists) */}
            <div className="mt-4">
              <AdminPlaceIdEditor
                listing={localListing}
                onUpdated={(updated) => {
                  // update local listing immediately with returned object
                  if (updated) {
                    setLocalListing((prev) => ({ ...(prev || {}), ...updated }));
                  } else {
                    // fallback: reassign to trigger any dependent effects
                    setLocalListing((prev) => ({ ...(prev || {}), placeId: localListing.placeId }));
                  }
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Reviews section (approved reviews) */}
      <div className="review-section mb-6">
        <h2 className="text-xl font-semibold mb-4">Guest Reviews</h2>

        {loading ? (
          <>
            <div className="mb-4 flex items-center gap-3">
              <LoadingSpinner size={28} />
              <div className="text-gray-600">Loading reviews…</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonReviewCard key={i} />
              ))}
            </div>
          </>
        ) : !reviews || reviews.length === 0 ? (
          <div className="text-gray-500">No approved reviews to display.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <div key={r._id} className="border p-4 rounded hover:shadow-lg transition-shadow">
                <div className="text-sm text-gray-500">{new Date(r.submittedAt).toLocaleDateString()}</div>
                <div className="mt-2">{r.publicReview}</div>
                <div className="text-sm text-gray-500 mt-2">— {r.guestName}</div>
                <Stars categories={r.categories || r.reviewCategory || []} />
                <div className="flex flex-wrap gap-1 mt-2">
                  {(r.categories || r.reviewCategory || []).map((c) => (
                    <span key={c.category} className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                      {c.category}: {c.rating}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google Reviews section (public reviews from Google Places) */}
      {showGoogle && (
        <div className="google-reviews-section">
          <h3 className="text-lg font-semibold mb-3">Google Reviews (public)</h3>

          {/* Loading / error states */}
          {googleLoading ? (
            <div className="mb-4 flex items-center gap-3">
              <LoadingSpinner size={20} />
              <div className="text-gray-600">Loading Google reviews…</div>
            </div>
          ) : googleError ? (
            <div className="text-red-600 mb-3">Failed to load Google reviews.</div>
          ) : !googleResult ? (
            <div className="text-gray-500 mb-3">No Google data available for this property.</div>
          ) : (
            <>
              {/* place summary */}
              <div className="mb-3 text-sm text-gray-600">
                {googleResult.name && <span className="font-semibold">{googleResult.name}</span>}{" "}
                {googleResult.address && <span>· {googleResult.address}</span>}
                {googleResult.user_ratings_total != null && (
                  <span className="ml-2">· {googleResult.user_ratings_total} reviews · {googleResult.rating} ★</span>
                )}
              </div>

              {(!googleResult.reviews || googleResult.reviews.length === 0) ? (
                <div className="text-gray-500">No Google reviews found for this listing.</div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {googleResult.reviews.map((r, i) => (
                    <div key={i} className="border p-3 rounded">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">{r.authorName}</div>
                        <div className="text-sm text-gray-600">{r.rating} ★</div>
                      </div>
                      <div className="text-sm text-gray-500">{r.relativeTimeDescription || (r.time ? new Date(r.time * 1000).toLocaleDateString() : "")}</div>
                      <div className="mt-2 text-gray-800">{r.text}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                Reviews supplied by Google Places API. Only a subset of public reviews may be shown.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
