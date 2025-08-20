import React, { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import PublicPage from "./pages/PublicPage";
import "./App.css";

const App = () => {
  const [view, setView] = useState("dashboard");
  const [publicListing, setPublicListing] = useState("");

  return (
    <div className="p-5 font-sans">
      <header className="flex justify-between items-center mb-4 px-4 py-2 bg-gray-100">
        <h1 className="text-xl text-gray-800 font-bold">
          FlexLiving Reviews (MERN)
        </h1>
        <div className="space-x-2">
          <button
            onClick={() => setView("dashboard")}
            className="px-3 py-1 bg-orange-600 text-white font-bold rounded hover:bg-orange-500"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setPublicListing("Studio – Kingsland Road");
              setView("public");
            }}
            className="px-3 py-1 bg-green-600 text-white font-bold rounded hover:bg-green-500"
          >
            Public Page
          </button>
        </div>
      </header>

      {view === "dashboard" && (
        <DashboardPage onShowPublic={(listingName) => {
          setPublicListing(listingName);
          setView("public");
        }} />
      )}

      {view === "public" && (
        <PublicPage
          listingName={publicListing}
          onBack={() => setView("dashboard")}
        />
      )}
    </div>
  );
};

export default App;
