import React from "react";

/**
 * Lightweight skeleton card for review items
 * Variation: pass `compact` to reduce height
 */
export default function SkeletonReviewCard({ compact = false }) {
  return (
    <div className={`border border-gray-200 rounded p-4 ${compact ? "h-28" : "h-36"} animate-pulse bg-white`}>
      <div className="flex justify-between items-center mb-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-end mt-3">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}
