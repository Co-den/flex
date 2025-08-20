import React from "react";

// Stars component
function Stars({ reviewCategory }) {
  const validRatings = reviewCategory.filter(c => c.rating != null);
  if (validRatings.length === 0) return null;
  const avg = validRatings.reduce((sum, c) => sum + c.rating, 0) / validRatings.length;
  const fullStars = Math.round(avg / 2); // 10-scale → 5 stars

  return (
    <div className="flex gap-1 mt-1 text-yellow-500">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < fullStars ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function ReviewCard({ review, onToggleApprove }) {
  return (
    <div className="border border-gray-200 p-4 rounded hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold">{review.guestName}</div>
        <button
          onClick={onToggleApprove}
          className={`px-2 py-1 text-sm rounded ${
            review.approved ? "bg-green-600 text-white" : "bg-gray-300"
          }`}
        >
          {review.approved ? "Approved" : "Approve"}
        </button>
      </div>
      <div className="text-gray-700">{review.publicReview}</div>
      <Stars reviewCategory={review.categories || []} />
      <div className="flex flex-wrap gap-1 mt-2">
        {review.categories?.map(c => (
          <span
            key={c.category}
            className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800"
          >
            {c.category}: {c.rating}
          </span>
        ))}
      </div>
      <div className="text-gray-500 text-sm mt-1">
        {new Date(review.submittedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
