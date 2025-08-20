// client/src/pages/DashboardPage.jsx
import React from "react";
import { useReviews } from "../hooks/useReviews";
import { usePerformance, useTrends } from "../hooks/useReports";
import ControlsBar from "../components/ControlsBar";
import KPIs from "../components/KPIs";
import TrendChart from "../components/TrendChart";
import ReviewCard from "../components/ReviewCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonReviewCard from "../components/SkeletonReviewCard";

export default function DashboardPage() {
  const {
    reviews, listings,
    query, setQuery,
    listingFilter, setListingFilter,
    categoryFilter, setCategoryFilter,
    channelFilter, setChannelFilter,
    minRating, setMinRating,
    dateFrom, setDateFrom, dateTo, setDateTo,
    page, setPage, limit,
    loading, meta, refresh,
    toggleApprove, toggleShowPublic,
  } = useReviews();

  // performance for KPI (fetch last 30 days by default)
  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const to = new Date().toISOString();
  const { data: perfData } = usePerformance(from, to);
  // find performance row for current listing
  const perfForListing = perfData.find(p => p._id === listingFilter) || {};

  // trends for selected listing
  const { data: trends } = useTrends(listingFilter === "All" ? "" : listingFilter, from, to);

  return (
    <div>
      <ControlsBar
        listings={listings}
        listingFilter={listingFilter} setListingFilter={setListingFilter}
        query={query} setQuery={setQuery}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        channelFilter={channelFilter} setChannelFilter={setChannelFilter}
        minRating={minRating} setMinRating={setMinRating}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
        onRefresh={refresh}
        onExport={() => {
          // export filtered via existing logic - quick reuse:
          const csvRows = [
            ["guestName","listingName","submittedAt","rating","publicReview","approved","showPublic"].join(","),
            ...reviews.map(r => [
              `"${(r.guestName||"").replace(/"/g,'""')}"`,
              `"${(r.listingName||"").replace(/"/g,'""')}"`,
              `"${r.submittedAt ? new Date(r.submittedAt).toISOString() : ""}"`,
              `${r.rating ?? ""}`,
              `"${(r.publicReview||"").replace(/"/g,'""')}"`,
              `${r.approved ? "true": "false"}`,
              `${r.showPublic ? "true" : "false"}`,
            ].join(","))
          ].join("\n");
          const blob = new Blob([csvRows], { type: "text/csv" });
          const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `reviews_export_${Date.now()}.csv`; a.click(); a.remove();
        }}
      />

      <KPIs performance={perfForListing} listing={listingFilter} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* left column: property list & trends */}
        <div className="lg:col-span-1">
          <div className="p-4 bg-white rounded shadow mb-4">
            <h4 className="font-semibold mb-2">Properties</h4>
            <div className="space-y-2 max-h-64 overflow-auto">
              {perfData.map(p => (
                <div key={p._id} className="flex items-center justify-between">
                  <button className={`text-left w-full py-2 ${p._id === listingFilter ? 'font-bold' : ''}`} onClick={() => setListingFilter(p._id)}>
                    {p._id}
                    <div className="text-xs text-gray-500">{Math.round(p.avgRating * 10)/10} avg • {p.totalReviews} reviews</div>
                  </button>
                  <div className="text-sm">{Math.round((p.approvedCount / Math.max(1, p.totalReviews)) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h4 className="font-semibold mb-3">Trends (30d)</h4>
            {trends?.length ? <TrendChart series={trends} /> : <div className="text-gray-500">No trend data</div>}
          </div>
        </div>

        {/* main column: review list */}
        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold mb-3">Reviews ({meta.total ?? reviews.length})</h3>

          {loading ? (
            <>
              <div className="mb-4 flex items-center gap-3"><LoadingSpinner size={28}/><div>Loading...</div></div>
              <div className="grid gap-3">
                {Array.from({length:6}).map((_,i) => <SkeletonReviewCard key={i} />)}
              </div>
            </>
          ) : (
            <div className="grid gap-3">
              {reviews.map(r => (
                <ReviewCard key={r._id} review={r}
                            onToggleApprove={() => toggleApprove(r._id)}
                            onToggleShowPublic={() => toggleShowPublic(r._id)}
                />
              ))}
            </div>
          )}

          {/* pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page}</div>
            <div className="flex gap-2">
              <button disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
              <button onClick={() => setPage(p => p+1)} className="px-3 py-1 bg-gray-200 rounded">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
