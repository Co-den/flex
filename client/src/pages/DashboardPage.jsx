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
  const [animateIn, setAnimateIn] = React.useState(false);
  const activeListing = chartListing || listingFilter;

  // Memoized filtered reviews
  const filtered = React.useMemo(
    () =>
      reviews.filter((r) => {
        const text = (r.publicReview || "").toLowerCase();
        const guest = (r.guestName || "").toLowerCase();
        const listing = (r.listingName || "").toLowerCase();
        const qLower = (query || "").toLowerCase();

        const matchesQuery =
          text.includes(qLower) || guest.includes(qLower) || listing.includes(qLower);

        const matchesListing =
          !activeListing || activeListing === "All" ? true : r.listingName === activeListing;

        return matchesQuery && matchesListing;
      }),
    [reviews, query, activeListing]
  );

  // Animate cards in when loading completes
  React.useEffect(() => {
    if (loading) {
      setAnimateIn(false);
      return;
    }
    const t = setTimeout(() => setAnimateIn(true), 60);
    return () => clearTimeout(t);
  }, [loading]);

  // Export currently filtered reviews to CSV
  const exportFilteredCSV = () => {
    if (!filtered.length) {
      alert("No reviews to export (filtered set is empty).");
      return;
    }

    const headers = [
      "guestName",
      "listingName",
      "submittedAt",
      "rating",
      "publicReview",
      "categories",
      "channel",
      "_id",
      "approved",
    ];

    const lines = [
      headers.join(","),
      ...filtered.map((r) => {
        const vals = [
          `"${(r.guestName || "").replace(/"/g, '""')}"`,
          `"${(r.listingName || "").replace(/"/g, '""')}"`,
          `"${r.submittedAt ? new Date(r.submittedAt).toISOString() : ""}"`,
          `${r.rating ?? ""}`,
          `"${(r.publicReview || "").replace(/"/g, '""')}"`,
          `"${(Array.isArray(r.categories) ? r.categories.map(c => `${c.category}:${c.rating}`).join("|") : "")}"`,
          `"${(r.channel || "").replace(/"/g, '""')}"`,
          `"${r._id}"`,
          `${r.approved ? "true" : "false"}`,
        ];
        return vals.join(",");
      }),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `filtered_reviews_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

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
      {/* Responsive controls: stacked on mobile, horizontal on md+ */}
      <section className="mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: search + sort group */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-80">
              <label htmlFor="search" className="sr-only">
                Search reviews
              </label>
              <input
                id="search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search text / guest / listing"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="w-full sm:w-56">
              <label htmlFor="listingFilter" className="sr-only">
                Filter by listing
              </label>
              <select
                id="listingFilter"
                value={listingFilter}
                onChange={(e) => setListingFilter(e.target.value)}
                className="w-full mt-2 sm:mt-0 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {listings.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={refresh}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm min-w-[88px]"
            >
              Refresh
            </button>

            <button
              onClick={exportFilteredCSV}
              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-400 text-sm min-w-[88px]"
            >
              Export CSV
            </button>

            <button
              onClick={() => {
                setQuery("");
                setListingFilter("All");
              }}
              className="px-3 py-2 bg-white border rounded hover:bg-gray-50 text-sm min-w-[88px]"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Reviews{" "}
          {loading ? <span className="text-sm text-gray-500"> (loading…)</span> : `(${filtered.length})`}
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
              <div
                key={r._id}
                className={`transform transition-all duration-400 ${
                  animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                <ReviewCard review={r} onToggleApprove={() => handleToggleApprove(r._id)} />
              </div>
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