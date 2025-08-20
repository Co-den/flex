import React, { useState, useEffect, useRef } from "react";
import PublicPage from "./pages/PublicPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [publicListing, setPublicListing] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // close mobile menu on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  const openPublic = (listingName) => {
    setPublicListing(listingName);
    setView("public");
    setMobileMenuOpen(false);
  };

  const openDashboard = () => {
    setView("dashboard");
    setMobileMenuOpen(false);
  };

  return (
    <div className="p-5 font-sans">
      <header className="flex items-center justify-between mb-4 px-4 py-2 bg-gray-100 rounded">
        <h1 className="text-xl text-gray-800 font-bold">FlexLiving Reviews</h1>

        {/* Desktop / wide screens */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => openPublic("Studio – Kingsland Road")}
            className="px-3 py-1 bg-green-600 text-white font-bold rounded hover:bg-green-500"
          >
            Public Page
          </button>

          <button
            onClick={openDashboard}
            className="px-3 py-1 bg-orange-600 text-white font-bold rounded hover:bg-orange-500"
          >
            Dashboard
          </button>
        </div>

        {/* Mobile: hamburger menu */}
        <div className="md:hidden relative" ref={menuRef}>
          <button
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((s) => !s)}
            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
            title="Open menu"
          >
            {/* simple hamburger icon */}
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Dropdown */}
          {mobileMenuOpen && (
            <div
              id="mobile-menu"
              role="menu"
              aria-label="Mobile menu"
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50"
            >
              <button
                role="menuitem"
                onClick={() => openPublic("Studio – Kingsland Road")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Public Page
              </button>
              <button
                role="menuitem"
                onClick={openDashboard}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Pages */}
      <main>
        {view === "public" && (
          <PublicPage listingName={publicListing} onBack={() => setView("dashboard")} />
        )}

        {view === "dashboard" && (
          <DashboardPage
            onShowPublic={(listingName) => {
              setPublicListing(listingName);
              setView("public");
            }}
          />
        )}
      </main>
    </div>
  );
}