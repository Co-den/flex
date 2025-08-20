// client/src/components/KPIs.jsx
import React from "react";

export default function KPIs({ performance = {}, listing }) {
  // tolerance: ensure numbers
  const avg = (performance?.avgRating !== undefined && performance.avgRating !== null)
    ? Number(performance.avgRating).toFixed(2)
    : "--";
  const total = Number(performance?.totalReviews ?? 0);
  const approved = Number(performance?.approvedCount ?? 0);
  const showPublic = Number(performance?.showPublicCount ?? 0);
  const approvalPct = total ? Math.round((approved / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Avg Rating</div>
        <div className="text-2xl font-bold">{avg} ⭐</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Total Reviews</div>
        <div className="text-2xl font-bold">{total}</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Approved</div>
        <div className="text-2xl font-bold">{approved} ({approvalPct}%)</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">Published</div>
        <div className="text-2xl font-bold">{showPublic}</div>
      </div>
    </div>
  );
}
