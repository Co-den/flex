// client/src/hooks/useReviews.js
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export function useReviews(initial = {}) {
  const [reviews, setReviews] = useState([]);
  const [listings, setListings] = useState(["All"]);
  const [query, setQuery] = useState(initial.q || "");
  const [listingFilter, setListingFilter] = useState(initial.listing || "All");
  const [categoryFilter, setCategoryFilter] = useState(initial.category || "");
  const [channelFilter, setChannelFilter] = useState(initial.channel || "");
  const [minRating, setMinRating] = useState(initial.minRating || 0);
  const [dateFrom, setDateFrom] = useState(initial.from || "");
  const [dateTo, setDateTo] = useState(initial.to || "");
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, page: 1 });

  const buildQuery = useCallback(() => {
    const q = new URLSearchParams();
    if (query) q.set("q", query);
    if (listingFilter && listingFilter !== "All") q.set("listing", listingFilter);
    if (categoryFilter) q.set("category", categoryFilter);
    if (channelFilter) q.set("channel", channelFilter);
    if (minRating) q.set("minRating", minRating);
    if (dateFrom) q.set("from", dateFrom);
    if (dateTo) q.set("to", dateTo);
    q.set("page", page);
    q.set("limit", limit);
    return q.toString();
  }, [query, listingFilter, categoryFilter, channelFilter, minRating, dateFrom, dateTo, page, limit]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQuery();
      const res = await axios.get(`${API_BASE}/api/reviews?${qs}`);
      const data = res.data?.result ?? [];
      setReviews(data);
      setMeta(res.data?.meta ?? { total: data.length, page });
      // derive listings set if empty
      const names = Array.from(new Set(data.map(r => r.listingName).filter(Boolean)));
      setListings(prev => Array.from(new Set(["All", ...prev, ...names])));
    } catch (err) {
      console.error("useReviews.load error:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [buildQuery, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  // refresh manually
  const refresh = useCallback(() => load(), [load]);

  // optimistic toggle approve
  const toggleApprove = useCallback(async (id) => {
    setReviews(prev => prev.map(r => r._id === id ? { ...r, approved: !r.approved } : r));
    try {
      await axios.patch(`${API_BASE}/api/reviews/${id}/approve`);
    } catch (err) {
      console.error("toggleApprove failed", err);
      // rollback
      setReviews(prev => prev.map(r => r._id === id ? { ...r, approved: !r.approved } : r));
    }
  }, []);

  // optimistic toggle showPublic
  const toggleShowPublic = useCallback(async (id) => {
    setReviews(prev => prev.map(r => r._id === id ? { ...r, showPublic: !r.showPublic } : r));
    try {
      await axios.patch(`${API_BASE}/api/reviews/${id}/show-public`);
    } catch (err) {
      console.error("toggleShowPublic failed", err);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, showPublic: !r.showPublic } : r));
    }
  }, []);

  return {
    reviews,
    listings,
    query, setQuery,
    listingFilter, setListingFilter,
    categoryFilter, setCategoryFilter,
    channelFilter, setChannelFilter,
    minRating, setMinRating,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    page, setPage, limit,
    loading, meta, refresh,
    toggleApprove, toggleShowPublic,
  };
}
