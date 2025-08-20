// client/src/hooks/useGoogleReviews.js
import { useEffect, useState } from "react";
import axios from "axios";

export function useGoogleReviews({ placeId, q }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;
    if (!placeId && !q) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = placeId ? { placeId } : { q };
        const res = await axios.get("/api/external/google-reviews", { params });
        if (!canceled) setResult(res.data.result);
      } catch (err) {
        if (!canceled) setError(err);
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [placeId, q]);

  return { loading, result, error };
}
