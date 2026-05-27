"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SeatSelector({
  seatCount,
  filmId: propFilmId,
  showtimeId: propShowtimeId,
}) {
  const [seatsData, setSeatsData] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [resolvedFilmId, setResolvedFilmId] = useState(propFilmId || "");
  const [initialLayoutLoading, setInitialLayoutLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const searchParams = useSearchParams();
  const showtimeId = propShowtimeId || searchParams.get("showtimeId");

  // Phase A: Fetch Seating Grid Configuration Map
  useEffect(() => {
    async function fetchStaticLayout() {
      try {
        const response = await fetch("http://127.0.0.1:5000/seat/");
        if (!response.ok) throw new Error("Layout engine exception");
        const result = await response.json();
        if (result && result.data) setSeatsData(result.data);
      } catch (e) {
        console.error("Seating layout breakdown:", e);
      } finally {
        setInitialLayoutLoading(false);
      }
    }
    fetchStaticLayout();
  }, []);

  // Phase B: Resolve Film ID dynamically using runtime API details if prop is absent
  useEffect(() => {
    if (propFilmId) {
      setResolvedFilmId(propFilmId);
      return;
    }
    if (!showtimeId) return;

    async function autoResolveMovieMeta() {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/showtime/${showtimeId}`,
        );
        const result = await response.json();
        if (result && result.data && result.data.film_id) {
          setResolvedFilmId(result.data.film_id);
        }
      } catch (err) {
        console.error(
          "Failed auto-resolving layout metadata relationship details:",
          err,
        );
      }
    }
    autoResolveMovieMeta();
  }, [propFilmId, showtimeId]);

  // Phase C: Fetch Seating Occupancy Map Matrix data securely
  useEffect(() => {
    if (!resolvedFilmId || !showtimeId) return;

    async function fetchAvailability() {
      try {
        setAvailabilityLoading(true);
        const response = await fetch(
          `http://127.0.0.1:5000/book-seat/${resolvedFilmId}/${showtimeId}`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error("Network occupancy syncing error.");
        const result = await response.json();
        if (result && result.data) {
          setBookedSeats(result.data);
        }
        setSelectedSeats([]);
      } catch (err) {
        console.error("Availability map refresh stream broke:", err);
      } finally {
        setAvailabilityLoading(false);
      }
    }
    fetchAvailability();
  }, [resolvedFilmId, showtimeId]);

  function toggleSeat(seatObj) {
    const seatLabel = `${seatObj.row_label}${seatObj.seat_number}`;
    if (
      bookedSeats.includes(seatLabel) ||
      seatObj.seat_type === "DAMAGE" ||
      availabilityLoading
    )
      return;

    const isAlreadySelected = selectedSeats.some(
      (s) => s.seat_id === seatObj.seat_id,
    );
    if (isAlreadySelected) {
      setSelectedSeats(
        selectedSeats.filter((s) => s.seat_id !== seatObj.seat_id),
      );
    } else if (selectedSeats.length < seatCount) {
      setSelectedSeats([...selectedSeats, seatObj]);
    }
  }

  async function handleProceedToPayment() {
    if (!showtimeId) {
      alert(
        "Error: Missing showtime routing runtime pointer reference parameters.",
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      return;
    }

    // Dynamic extraction of user_id from the stored JWT token
    let currentUserId;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload.id; // Extracts the real user ID mapping matching your profile configuration
    } catch (e) {
      console.error("Token decoding fault handled:", e);
      alert("Your session token is malformed. Please log in again.");
      return;
    }

    if (!currentUserId) {
      alert("Invalid session profile tracking setup. Please sign in.");
      return;
    }

    const formattedSeatLabels = selectedSeats.map(
      (s) => `${s.row_label}${s.seat_number}`,
    );

    const payload = {
      userId: currentUserId, // Dynamic active authenticated user context pointer
      showtimeId: String(showtimeId),
      seats: formattedSeatLabels,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/booking/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Booking secured successfully! ID: ${result.data.bookingId}`);
        setBookedSeats((prev) => [...prev, ...formattedSeatLabels]);
        setSelectedSeats([]);
      } else if (response.status === 409) {
        alert(`Reservation Intercepted: ${result.message}`);

        const refreshResponse = await fetch(
          `http://127.0.0.1:5000/book-seat/${resolvedFilmId}/${showtimeId}`,
          { cache: "no-store" },
        );
        const refreshResult = await refreshResponse.json();
        if (refreshResult.data) setBookedSeats(refreshResult.data);
        setSelectedSeats([]);
      } else {
        alert(`Booking declined: ${result.message}`);
      }
    } catch (error) {
      console.error("Execution checkout breakdown:", error);
      alert(
        "Network processing error encountered completing your reservation.",
      );
    }
  }

  const isComplete = selectedSeats.length === seatCount;

  if (initialLayoutLoading) {
    return (
      <div className="text-white text-center p-10 font-medium tracking-wider animate-pulse">
        Building theater layout asset matrix...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center relative">
      <div className="w-full max-w-xl mb-12">
        <div className="w-full h-1 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,1)]" />
        <p className="text-center text-[10px] tracking-[0.5em] text-white/30 uppercase mt-4">
          Screen
        </p>
      </div>

      <div className="flex flex-wrap gap-6 justify-center mb-8 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/10 rounded-t-md border-t border-white/20" />{" "}
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-500 rounded-t-md" /> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-950/40 border border-red-900/40 text-red-500 rounded-t-md flex items-center justify-center text-[9px]">
            ✕
          </div>{" "}
          Occupied
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-t-md flex items-center justify-center text-[9px]">
            🛠
          </div>{" "}
          Damaged
        </div>
      </div>

      <div
        className={`grid grid-cols-10 gap-3 mb-10 transition-opacity duration-200 ${availabilityLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`}
      >
        {seatsData.map((seat) => {
          const seatLabel = `${seat.row_label}${seat.seat_number}`;
          const isSelected = selectedSeats.some(
            (s) => s.seat_id === seat.seat_id,
          );
          const isBooked = bookedSeats.includes(seatLabel);
          const isDamaged = seat.seat_type === "DAMAGE";
          const isDisabled =
            isBooked ||
            isDamaged ||
            (!isSelected && selectedSeats.length >= seatCount);

          return (
            <button
              key={seat.seat_id}
              onClick={() => toggleSeat(seat)}
              disabled={isDisabled}
              className={`w-10 h-10 rounded-t-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center border-t-2 ${
                isSelected
                  ? "bg-cyan-500 text-black border-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : isBooked
                    ? "bg-red-950/20 text-red-500/40 border-red-900/30 line-through cursor-not-allowed"
                    : isDamaged
                      ? "bg-zinc-900/50 text-zinc-600 border-zinc-800 cursor-not-allowed"
                      : isDisabled
                        ? "bg-white/5 text-white/10 border-white/5 opacity-40"
                        : "bg-white/10 text-white/40 border-white/10 hover:bg-white/20 hover:text-white"
              }`}
            >
              {isDamaged
                ? "🛠"
                : isBooked
                  ? "✕"
                  : `${seat.row_label}${seat.seat_number}`}
            </button>
          );
        })}
      </div>

      <div className="w-full flex items-center justify-between p-8 bg-black/60 backdrop-blur-xl rounded-[40px] border border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">
            Seats
          </span>
          <span className="text-xl font-black text-white">
            {selectedSeats.length > 0
              ? selectedSeats
                  .map((s) => `${s.row_label}${s.seat_number}`)
                  .sort()
                  .join(", ")
              : "—"}
          </span>
        </div>
        <button
          disabled={!isComplete || availabilityLoading}
          onClick={handleProceedToPayment}
          className={`px-10 py-4 rounded-2xl font-black transition-all ${
            isComplete && !availabilityLoading
              ? "bg-white text-black hover:bg-cyan-500 active:scale-95 cursor-pointer"
              : "bg-white/10 text-white/20 cursor-not-allowed"
          }`}
        >
          {availabilityLoading
            ? "SYNCING..."
            : isComplete
              ? "PROCEED TO PAYMENT"
              : `SELECT ${seatCount - selectedSeats.length} MORE`}
        </button>
      </div>
    </div>
  );
}
