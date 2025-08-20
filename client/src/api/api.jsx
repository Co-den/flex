import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "https://flex-1-o88e.onrender.com";


const pluck = (p) => p.then((r) => r.data.result);

// Fetch all reviews
export const fetchAll = async () => {
  try {
    const res = await axios.get(`${API}/api/reviews/hostaway`);
    return res.data.result;
  } catch (err) {
    console.error("Hostaway fetch failed:", err.message);
    return mockReviews;
  }
};

// Toggle approval status of a review
export const toggleApprove = (id) =>
  axios.patch(`${API}/api/reviews/${id}/approve`).then((res) => res.result);

// Fetch public reviews for a specific listing
export const fetchPublic = async (listingName) => {
  try {
    const res = await axios.get(`/api/reviews/public/${encodeURIComponent(listingName)}`);
    //very important to Make sure this matches your backend response
    //if it doesn't it wont show any result or data
    return res.data.result; 
  } catch (err) {
    console.error("Error fetching public reviews:", err.message);
    return [];
  }
};


export const fetchPublicListing = (listingName) =>
  pluck(axios.get(`${API}/api/listings/public/${encodeURIComponent(listingName)}`));


export const fetchListings = () => pluck(axios.get(`${API}/api/listings`));