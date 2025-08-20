import React, { useState, useEffect, useRef } from "react";
import PublicPage from "./pages/PublicPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [publicListing, setPublicListing] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // load last selected listing
  useEffect(() => {
    const saved = localStorage.getItem("publicListing");
    if (saved) setPublicListing(saved);
  }, []);

  useEffect(() => {
    // close mobile menu on outside click
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const openPublic = (listingName) => {
    if (listingName) {
      setPublicListing(listingName);
      localStorage.setItem("publicListing", listingName);
    }
    setView("public");
    setMobileMenuOpen(false);
  };

  const openDashboard = () => {
    setView("dashboard");
    setMobileMenuOpen(false);
  };

  return (
    <div className="p-5 font-sans">
      <header className="bg-gray-100 rounded px-4 py-3 mb-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl text-gray-800 font-bold text-center sm:text-left">
              FlexLiving Reviews
            </h1>
          </div>

          {/* Desktop buttons (md+) */}
          <div className="hidden md:flex items-center gap-3">
         <button
              onClick={openDashboard}
              className="px-4 py-2 bg-orange-600 text-white font-semibold rounded hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              Dashboard
            </button>
            <button
              onClick={() => openPublic(publicListing || "")}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Public Page
            </button>
          </div>

          {/* Mobile: stacked full-width buttons (small screens) */}
          <div className="flex md:hidden items-center gap-2">
            {/* compact inline buttons for slightly larger phones (>=sm) */}
            <div className="hidden sm:flex gap-2">
  <button
                onClick={openDashboard}
                className="px-3 py-2 bg-orange-600 text-white rounded text-sm w-full"
                style={{ minWidth: 110 }}
              >
                Dashboard
              </button>
              <button
                onClick={() => openPublic(publicListing || "")}
                className="px-3 py-2 bg-green-600 text-white rounded text-sm w-full"
                style={{ minWidth: 110 }}
              >
                Public
              </button>
            
            </div>

            {/* hamburger for very small screens */}
            <div className="sm:hidden relative" ref={menuRef}>
              <button
                onClick={() => setMobileMenuOpen((s) => !s)}
                className="p-2 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
                aria-expanded={mobileMenuOpen}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>

              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow z-50">
                  <button
                    onClick={() => openPublic(publicListing || "")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Public Page
                  </button>
                  <button
                    onClick={openDashboard}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {view === "public" && (
          <PublicPage listingName={publicListing} onBack={() => setView("dashboard")} />
        )}
        {view === "dashboard" && (
          <DashboardPage
            onShowPublic={(listingName) => {
              setPublicListing(listingName);
              localStorage.setItem("publicListing", listingName);
              setView("public");
            }}
          />
        )}
      </main>
    </div>
  );
}