import React, { useState, useEffect } from "react";
import { usePublicListing } from "../hooks/usePublicListing";
import { useListings } from "../hooks/useListing";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonReviewCard from "../components/SkeletonReviewCard";
import SafeImage from "../components/SafeImage";

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

  useEffect(() => {
    if (initialListingName) setSelectedListing(initialListingName);
  }, [initialListingName]);

  const handleChange = (e) => {
    setSelectedListing(e.target.value);
  };

  return (
    <div className="mt-6" aria-busy={loading}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <button onClick={onBack} className="text-blue-600 hover:underline mr-4">
            ← Back
          </button>
          <span className="text-gray-700">Public Property View</span>
        </div>

        <div>
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
        ) : !listing ? (
          <div className="text-gray-500">No property found for “{selectedListing}”.</div>
        ) : (
          <>
            <SafeImage
              src={listing.heroImage}
              alt={listing.listingName}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{listing.listingName}</h1>
                <p className="text-gray-600">
                  {listing.address ? `${listing.address}, ` : ""}
                  {listing.city}
                  {listing.country ? `, ${listing.country}` : ""}
                </p>
              </div>
              <div className="text-sm text-gray-700">
                <div className="font-semibold">From £{listing.nightlyFrom} / night</div>
                <div>
                  {listing.bedrooms} bd · {listing.bathrooms} ba · sleeps {listing.sleeps}
                  {listing.sqft ? ` · ${listing.sqft} sqft` : ""}
                </div>
              </div>
            </div>

            {listing.highlights?.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-3">
                {listing.highlights.map((h) => (
                  <li key={h} className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs">
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {listing.gallery?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {listing.gallery.map((src, i) => (
                  <SafeImage
                    key={i}
                    src={src}
                    alt={`${listing.listingName} ${i + 1}`}
                    className="w-full h-36 object-cover rounded"
                  />
                ))}
              </div>
            )}

            {listing.description && <p className="text-gray-700 mt-4">{listing.description}</p>}
          </>
        )}
      </div>

      {/* Reviews section */}
      <div className="review-section">
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
        ) : reviews.length === 0 ? (
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
    </div>
  );
}
