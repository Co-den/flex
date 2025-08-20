import React from "react";
import ReviewCard from "../components/ReviewCard";
import { useReviews } from "../hooks/useReviews";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonReviewCard from "../components/SkeletonReviewCard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardPage = () => {
  const {
    reviews,
    listings,
    query,
    setQuery,
    listingFilter,
    setListingFilter,
    handleToggleApprove,
    refresh,
    loading,
    error,
  } = useReviews();

  const [chartListing, setChartListing] = React.useState(null);
  const activeListing = chartListing || listingFilter;

  // Filter using the correct fields (publicReview, guestName, listingName)
  const filtered = reviews.filter((r) => {
    const text = (r.publicReview || "").toLowerCase();
    const guest = (r.guestName || "").toLowerCase();
    const listing = (r.listingName || "").toLowerCase();
    const qLower = (query || "").toLowerCase();

    const matchesQuery =
      text.includes(qLower) || guest.includes(qLower) || listing.includes(qLower);

    const matchesListing =
      !activeListing || activeListing === "All" ? true : r.listingName === activeListing;

    return matchesQuery && matchesListing;
  });

  const listingSummary = listings
    .filter((l) => l !== "All")
    .map((l) => {
      const total = reviews.filter((r) => r.listingName === l).length;
      const approved = reviews.filter((r) => r.listingName === l && r.approved).length;
      return { listing: l, total, approved };
    });

  const chartData = {
    labels: listingSummary.map((s) => s.listing),
    datasets: [
      {
        label: "Approved",
        data: listingSummary.map((s) => s.approved),
        backgroundColor: listingSummary.map((s) =>
          s.listing === chartListing ? "#16a34a" : "#4ade80"
        ),
      },
      {
        label: "Total",
        data: listingSummary.map((s) => s.total),
        backgroundColor: listingSummary.map((s) =>
          s.listing === chartListing ? "#2563eb" : "#60a5fa"
        ),
      },
    ],
  };

  const handleChartClick = (event, elements) => {
    if (!elements || elements.length === 0) return;
    const index = elements[0].index;
    const clickedListing = chartData.labels[index];
    setChartListing((prev) => (prev === clickedListing ? null : clickedListing));
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    onClick: handleChartClick,
  };

  return (
    <>
      <section className="flex gap-2 mb-4" aria-hidden={loading}>
        <input
          className="border px-3 py-2 rounded w-full max-w-xs"
          placeholder="Search text/guest/listing"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={listingFilter}
          onChange={(e) => setListingFilter(e.target.value)}
        >
          {listings.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          onClick={refresh}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Reviews {loading ? <span className="text-sm text-gray-500"> (loading…)</span> : `(${filtered.length})`}
        </h2>

        {loading ? (
          <>
            <div className="mb-4 flex items-center gap-3">
              <LoadingSpinner size={28} />
              <div className="text-gray-600">Loading reviews…</div>
            </div>

            <div className="grid gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonReviewCard key={i} />
              ))}
            </div>
          </>
        ) : error ? (
          <div className="text-red-600">Failed to load reviews: {error}</div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((r) => (
              <ReviewCard
                key={r._id}
                review={r}
                onToggleApprove={() => handleToggleApprove(r._id)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-gray-500">No reviews match your filters.</div>
            )}
          </div>
        )}
      </section>

      <section className="mt-6">
        <h3 className="text-md font-semibold mb-2">Listing Summary</h3>
        {listingSummary.map(({ listing, total, approved }) => (
          <div key={listing} className="mb-1 text-sm">
            {listing}: {approved}/{total} approved
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h3 className="text-md font-semibold mb-2">Approval Chart</h3>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={chartData} options={chartOptions} />
          {chartListing && (
            <button
              onClick={() => setChartListing(null)}
              className="mt-3 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              Clear chart filter
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
