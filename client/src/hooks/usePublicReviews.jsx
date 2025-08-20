import { useEffect, useState } from "react";
import { fetchPublic } from "../api/api";

const usePublicReviews = (listingName) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!listingName) {
      setReviews([]);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await fetchPublic(listingName);
        setReviews(res || []);
      } catch (err) {
        console.error("Error fetching public reviews:", err.message);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    })();
  }, [listingName]);

  return { reviews, loading, error };
}

export default usePublicReviews;