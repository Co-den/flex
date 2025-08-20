import { useEffect, useState } from "react";
import { fetchListings } from "../api/api";

export function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchListings(); // array of listings
        setListings(res || []);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { listings, loading, error };
}
