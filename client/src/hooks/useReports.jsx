// client/src/hooks/useReports.js
import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "https://flex-1-o88e.onrender.com";

export function usePerformance(from, to) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const qs = [];
        if (from) qs.push(`from=${encodeURIComponent(from)}`);
        if (to) qs.push(`to=${encodeURIComponent(to)}`);
        const res = await axios.get(
          `${API_BASE}/api/reviews/reports/performance${
            qs.length ? "?" + qs.join("&") : ""
          }`
        );
        setData(res.data?.result || []);
      } catch (e) {
        console.error("usePerformance error", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [from, to]);
  return { data, loading };
}

export function useTrends(listing, from, to, interval = "day") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const qs = [];
        if (listing) qs.push(`listing=${encodeURIComponent(listing)}`);
        if (from) qs.push(`from=${encodeURIComponent(from)}`);
        if (to) qs.push(`to=${encodeURIComponent(to)}`);
        if (interval) qs.push(`interval=${interval}`);
        const res = await axios.get(
          `${API_BASE}/api/reviews/reports/trends${
            qs.length ? "?" + qs.join("&") : ""
          }`
        );
        setData(res.data?.result || []);
      } catch (e) {
        console.error("useTrends error", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [listing, from, to, interval]);
  return { data, loading };
}
