"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Calendar, Clock, Film, Loader2, Ticket } from "lucide-react";

// Tab configurations dictionary mapping for scalable title text strings
const TAB_LABELS = {
  overview: 'Dashboard Overview',
  movies: 'Movie Library Catalog',
  users: 'System Profile Directory',
  seating: 'Auditorium Grid Topologies',
  cashier: 'On-Site Point of Sale Terminal'
};

export default function Header({ activeTab, setActiveTab }) {
  // Search and Suggestion dropdown states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Modal / Popup states
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);

  // Close suggestions if clicked outside the search element
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live Search Effect (Debounced API fetch)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `http://localhost:5000/film/get-all-film/${encodeURIComponent(searchQuery)}`,
        );
        if (response.ok) {
          const json = await response.json();
          setSearchResults(json.data || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Error fetching live search results:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce timeout

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle film selection: sets film metadata & requests showtimes simultaneously
  const handleSelectFilm = async (film) => {
    setShowDropdown(false);
    setSearchQuery("");
    setSelectedFilm(film);
    setIsLoadingShowtimes(true);
    setShowtimes([]);

    try {
      const response = await fetch(
        `http://localhost:5000/showtime/film/${film.film_id}`,
      );
      if (response.ok) {
        const json = await response.json();
        setShowtimes(json.data || []);
      }
    } catch (err) {
      console.error("Error fetching film showtimes:", err);
    } finally {
      setIsLoadingShowtimes(false);
    }
  };

  // Format incoming ISO Date string to localized readable text
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format "HH:MM:SS.000000" string down to a clean short duration timestamp
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.split(":").slice(0, 2).join(":");
  };

  return (
    <>
      <header className="no-print w-full bg-card text-card-foreground border border-border rounded-3xl p-4 flex justify-between items-center shadow-xs transition-colors duration-200 relative z-40">
        
        {/* Left Aligned Breadcrumb & Title Cluster */}
        <div className="flex flex-col gap-1">
          {/* Breadcrumb Navigation Trail */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            <span className="text-muted-foreground/60">Dashboards</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground font-black border-b-2 border-brand-lime pb-0.5">
              {activeTab}
            </span>
          </div>
          {/* Main Contextual Dynamic Heading */}
          <h1 className="text-sm font-black uppercase tracking-wider text-foreground mt-1">
            {TAB_LABELS[activeTab] || 'Admin Console Cluster'}
          </h1>
        </div>

        {/* Right Aligned Quick Actions Tray */}
        <div className="flex items-center gap-4">
          
          {/* Modern Styled Search Matrix (Expanded X-axis width) */}
          <div className="relative" ref={dropdownRef}>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
              size={14}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchQuery.trim().length >= 2 && setShowDropdown(true)
              }
              placeholder="Quick search films..."
              className="bg-input border border-border text-xs rounded-xl pl-9 pr-10 py-2 w-80 focus:outline-none focus:ring-1 focus:ring-brand-lime focus:border-brand-lime transition-all text-foreground placeholder:text-muted-foreground/50 font-medium"
            />
            {isSearching && (
              <Loader2
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground/60"
                size={14}
              />
            )}

            {/* Results Live Dropdown Overlay */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute right-0 left-0 mt-2 bg-card border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50 p-1">
                {searchResults.map((film) => (
                  <button
                    key={film.film_id}
                    onClick={() => handleSelectFilm(film)}
                    className="w-full text-left px-3 py-2 hover:bg-foreground/[0.04] rounded-lg transition-colors flex items-center gap-3 group"
                  >
                    {film.poster_image ? (
                      <img
                        src={film.poster_image}
                        alt={film.film_name}
                        className="w-7 h-10 object-cover rounded-md bg-muted flex-shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <Film size={12} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-foreground group-hover:text-brand-lime truncate">
                        {film.film_name}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <span className="bg-foreground/[0.05] px-1.5 py-0.5 rounded-sm">
                          {film.genre}
                        </span>
                        <span>•</span>
                        <span>{film.duration} mins</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CASHIER QUICK TRIGGER BUTTON */}
          {/* <button
            onClick={() => setActiveTab('cashier')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 ${
              activeTab === 'cashier'
                ? 'bg-brand-lime text-black shadow-md shadow-brand-lime/10'
                : 'bg-input hover:bg-foreground/[0.04] text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <Ticket size={14} /> Cashier
          </button> */}
        </div>
      </header>

      {/* Film Detail and Showtime Modal Overlay Popup */}
      {selectedFilm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-card text-card-foreground border border-border rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden relative max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Film Overview & Showtimes
              </span>
              <button
                onClick={() => setSelectedFilm(null)}
                className="p-1.5 rounded-lg border border-border hover:bg-foreground/[0.05] text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Main Film Specs */}
              <div className="flex flex-col sm:flex-row gap-5">
                {selectedFilm.poster_image && (
                  <img
                    src={selectedFilm.poster_image}
                    alt={selectedFilm.film_name}
                    className="w-full sm:w-28 h-40 object-cover rounded-xl border border-border bg-muted shadow-xs flex-shrink-0 mx-auto sm:mx-0"
                  />
                )}
                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-black text-foreground">
                    {selectedFilm.film_name}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-medium">
                    <span className="bg-brand-lime/10 text-brand-lime border border-brand-lime/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                      {selectedFilm.status}
                    </span>
                    <span className="text-muted-foreground/40">|</span>
                    <span className="text-muted-foreground">
                      {selectedFilm.genre}
                    </span>
                    <span className="text-muted-foreground/40">|</span>
                    <span className="text-muted-foreground">
                      {selectedFilm.duration} minutes
                    </span>
                    <span className="text-muted-foreground/40">|</span>
                    <span className="text-muted-foreground">
                      {selectedFilm.language}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {selectedFilm.description}
                  </p>
                  {selectedFilm.release_date && (
                    <div className="text-[11px] text-muted-foreground/80 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                      <Calendar size={12} />
                      <span>
                        Releasing: {formatDate(selectedFilm.release_date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Showtimes Processing Node */}
              <div className="border-t border-border pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <Clock size={13} className="text-brand-lime" /> Available Screenings
                </h3>

                {isLoadingShowtimes ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1.5">
                      Gathering showtimes...
                    </span>
                  </div>
                ) : showtimes.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                    No active runtime schedules found for this film.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {showtimes.map((show) => (
                      <div
                        key={show.showtime_id}
                        className="p-3 bg-muted/40 border border-border rounded-xl flex justify-between items-center group hover:border-foreground/20 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-foreground">
                            {show.screen_name}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar size={10} />
                            <span>{formatDate(show.show_date)}</span>
                          </div>
                        </div>
                        <div className="text-right font-mono bg-input border border-border px-2.5 py-1 rounded-lg text-xs font-semibold text-foreground group-hover:text-brand-lime transition-colors">
                          {formatTime(show.start_time)} - {formatTime(show.end_time)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}