import { useEffect, useState } from "react";
import { fetchPublicListing } from "../api/api";



export function usePublicListing(listingName) {
  const [data, setData] = useState({ listing: null, reviews: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!listingName) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchPublicListing(listingName); // returns { listing, reviews }
        setData({ listing: res.listing || null, reviews: res.reviews || [] });
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load listing");
        setData({ listing: null, reviews: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, [listingName]);

  return { ...data, loading, error };
}
