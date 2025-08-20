// client/src/components/ControlsBar.jsx
import React from "react";

export default function ControlsBar({
  listings,
  listingFilter, setListingFilter,
  query, setQuery,
  categoryFilter, setCategoryFilter,
  channelFilter, setChannelFilter,
  minRating, setMinRating,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  onRefresh, onExport,
  categories = ["cleanliness", "communication", "value", "facilities"],
  channels = ["Airbnb", "Booking", "Direct"]
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <div className="flex gap-2 items-center flex-wrap">
        <select value={listingFilter} onChange={(e)=>setListingFilter(e.target.value)} className="px-3 py-2 border rounded">
          <option value="All">All listings</option>
          {listings.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <select value={channelFilter} onChange={(e)=>setChannelFilter(e.target.value)} className="px-3 py-2 border rounded">
          <option value="">All channels</option>
          {channels.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <input placeholder="Search guest/text" value={query} onChange={(e)=>setQuery(e.target.value)}
               className="px-3 py-2 border rounded w-56" />
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Rating ≥</label>
          <input type="number" min="0" max="10" value={minRating} onChange={(e)=>setMinRating(Number(e.target.value))}
                 className="w-20 px-2 py-2 border rounded"/>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">From</label>
          <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} className="px-2 py-2 text-gray-600 border rounded"/>
          <label className="text-sm text-gray-600">To</label>
          <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} className="px-2 py-2 text-gray-600 border rounded"/>
        </div>

        <select value={categoryFilter} onChange={(e)=>setCategoryFilter(e.target.value)} className="px-3 py-2  border rounded">
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <button onClick={onRefresh} className="px-3 py-2 bg-gray-200 rounded">Refresh</button>
        <button onClick={onExport} className="px-3 py-2 bg-yellow-500 text-white rounded">Export</button>
      </div>
    </div>
  );
}
