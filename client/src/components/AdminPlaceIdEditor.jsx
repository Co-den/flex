// client/src/components/AdminPlaceIdEditor.jsx
import React, { useState } from "react";
import axios from "axios";

export default function AdminPlaceIdEditor({ listing, onUpdated }) {
  // listing assumed to have _id and placeId
  const [placeId, setPlaceId] = useState(listing?.placeId || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function save() {
    if (!listing?._id) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.patch(`/api/admin/listings/${listing._id}/placeId`, { placeId });
      setSuccess("Saved");
      if (onUpdated) onUpdated(res.data.result);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 2500);
    }
  }

  return (
    <div className="mt-3 p-3 border rounded bg-gray-50">
      <div className="text-sm text-gray-600 mb-2">Google Place ID (admin)</div>
      <div className="flex gap-2">
        <input
          value={placeId}
          onChange={(e) => setPlaceId(e.target.value)}
          placeholder="ChIJ..."
          className="border px-3 py-2 rounded flex-1"
        />
        <button onClick={save} disabled={saving} className="px-3 py-2 bg-green-600 text-white rounded">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      <div className="text-xs text-gray-500 mt-2">
        If you don’t know the Place ID, search the place in Google Maps or use the server search endpoint.
      </div>
    </div>
  );
}
