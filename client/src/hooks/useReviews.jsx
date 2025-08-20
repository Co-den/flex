import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchAll, toggleApprove as apiToggleApprove } from "../api/api";

/**
 * useReviews
 * - fetches reviews on mount
 * - exposes reviews, listings, filter/query state, handlers, and refresh()
 */
export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState("");
  const [listingFilter, setListingFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // fetchAll should return an array (the backend result)
      const data = await fetchAll();
      // if your API wrapper returns { status, result } use: const data = (await fetchAll())?.result || []
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError(err?.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch on mount
  useEffect(() => {
    load();
  }, [load]);

  // refresh callable by UI
  const refresh = useCallback(() => load(), [load]);

  // toggle approval (updates local state with returned updated review)
  const handleToggleApprove = useCallback(
    async (id) => {
      try {
        const updated = await apiToggleApprove(id);
        // if apiToggleApprove returns {status,result} adjust accordingly
        const updatedDoc = updated && updated._id ? updated : updated?.result ?? updated;
        setReviews((prev) => prev.map((r) => (r._id === updatedDoc._id ? updatedDoc : r)));
      } catch (err) {
        console.error("Failed to toggle approval:", err);
      }
    },
    []
  );

  // listings array including "All"
  const listings = useMemo(() => ["All", ...Array.from(new Set(reviews.map((r) => r.listingName).filter(Boolean)))], [reviews]);

  return {
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
  };
}
