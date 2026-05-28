// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// export default function SeatSelector({
//   seatCount,
//   filmId: propFilmId,
//   showtimeId: propShowtimeId,
// }) {
//   const [seatsData, setSeatsData] = useState([]);
//   const [bookedSeats, setBookedSeats] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [resolvedFilmId, setResolvedFilmId] = useState(propFilmId || "");
//   const [initialLayoutLoading, setInitialLayoutLoading] = useState(true);
//   const [availabilityLoading, setAvailabilityLoading] = useState(false);

//   const searchParams = useSearchParams();
//   const showtimeId = propShowtimeId || searchParams.get("showtimeId");

//   // Phase A: Fetch Seating Grid Configuration Map
//   useEffect(() => {
//     async function fetchStaticLayout() {
//       try {
//         const response = await fetch("http://127.0.0.1:5000/seat/");
//         if (!response.ok) throw new Error("Layout engine exception");
//         const result = await response.json();
//         if (result && result.data) setSeatsData(result.data);
//       } catch (e) {
//         console.error("Seating layout breakdown:", e);
//       } finally {
//         setInitialLayoutLoading(false);
//       }
//     }
//     fetchStaticLayout();
//   }, []);

//   // Phase B: Resolve Film ID dynamically using runtime API details if prop is absent
//   useEffect(() => {
//     if (propFilmId) {
//       setResolvedFilmId(propFilmId);
//       return;
//     }
//     if (!showtimeId) return;

//     async function autoResolveMovieMeta() {
//       try {
//         const response = await fetch(
//           `http://127.0.0.1:5000/showtime/${showtimeId}`,
//         );
//         const result = await response.json();
//         if (result && result.data && result.data.film_id) {
//           setResolvedFilmId(result.data.film_id);
//         }
//       } catch (err) {
//         console.error(
//           "Failed auto-resolving layout metadata relationship details:",
//           err,
//         );
//       }
//     }
//     autoResolveMovieMeta();
//   }, [propFilmId, showtimeId]);

//   // Phase C: Fetch Seating Occupancy Map Matrix data securely
//   useEffect(() => {
//     if (!resolvedFilmId || !showtimeId) return;

//     async function fetchAvailability() {
//       try {
//         setAvailabilityLoading(true);
//         const response = await fetch(
//           `http://127.0.0.1:5000/book-seat/${resolvedFilmId}/${showtimeId}`,
//           { cache: "no-store" },
//         );
//         if (!response.ok) throw new Error("Network occupancy syncing error.");
//         const result = await response.json();
//         if (result && result.data) {
//           setBookedSeats(result.data);
//         }
//         setSelectedSeats([]);
//       } catch (err) {
//         console.error("Availability map refresh stream broke:", err);
//       } finally {
//         setAvailabilityLoading(false);
//       }
//     }
//     fetchAvailability();
//   }, [resolvedFilmId, showtimeId]);

//   function toggleSeat(seatObj) {
//     const seatLabel = `${seatObj.row_label}${seatObj.seat_number}`;
//     if (
//       bookedSeats.includes(seatLabel) ||
//       seatObj.seat_type === "DAMAGE" ||
//       availabilityLoading
//     )
//       return;

//     const isAlreadySelected = selectedSeats.some(
//       (s) => s.seat_id === seatObj.seat_id,
//     );
//     if (isAlreadySelected) {
//       setSelectedSeats(
//         selectedSeats.filter((s) => s.seat_id !== seatObj.seat_id),
//       );
//     } else if (selectedSeats.length < seatCount) {
//       setSelectedSeats([...selectedSeats, seatObj]);
//     }
//   }

//   async function handleProceedToPayment() {
//     if (!showtimeId) {
//       alert(
//         "Error: Missing showtime routing runtime pointer reference parameters.",
//       );
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Authentication token missing. Please log in again.");
//       return;
//     }

//     // Dynamic extraction of user_id from the stored JWT token
//     let currentUserId;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       currentUserId = payload.id; // Extracts the real user ID mapping matching your profile configuration
//     } catch (e) {
//       console.error("Token decoding fault handled:", e);
//       alert("Your session token is malformed. Please log in again.");
//       return;
//     }

//     if (!currentUserId) {
//       alert("Invalid session profile tracking setup. Please sign in.");
//       return;
//     }

//     const formattedSeatLabels = selectedSeats.map(
//       (s) => `${s.row_label}${s.seat_number}`,
//     );

//     const payload = {
//       userId: currentUserId, // Dynamic active authenticated user context pointer
//       showtimeId: String(showtimeId),
//       seats: formattedSeatLabels,
//     };

//     try {
//       const response = await fetch("http://127.0.0.1:5000/booking/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert(`Booking secured successfully! ID: ${result.data.bookingId}`);
//         setBookedSeats((prev) => [...prev, ...formattedSeatLabels]);
//         setSelectedSeats([]);
//       } else if (response.status === 409) {
//         alert(`Reservation Intercepted: ${result.message}`);

//         const refreshResponse = await fetch(
//           `http://127.0.0.1:5000/book-seat/${resolvedFilmId}/${showtimeId}`,
//           { cache: "no-store" },
//         );
//         const refreshResult = await refreshResponse.json();
//         if (refreshResult.data) setBookedSeats(refreshResult.data);
//         setSelectedSeats([]);
//       } else {
//         alert(`Booking declined: ${result.message}`);
//       }
//     } catch (error) {
//       console.error("Execution checkout breakdown:", error);
//       alert(
//         "Network processing error encountered completing your reservation.",
//       );
//     }
//   }

//   const isComplete = selectedSeats.length === seatCount;

//   if (initialLayoutLoading) {
//     return (
//       <div className="text-white text-center p-10 font-medium tracking-wider animate-pulse">
//         Building theater layout asset matrix...
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center relative">
//       <div className="w-full max-w-xl mb-12">
//         <div className="w-full h-1 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,1)]" />
//         <p className="text-center text-[10px] tracking-[0.5em] text-white/30 uppercase mt-4">
//           Screen
//         </p>
//       </div>

//       <div className="flex flex-wrap gap-6 justify-center mb-8 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
//         <div className="flex items-center gap-2">
//           <div className="w-4 h-4 bg-white/10 rounded-t-md border-t border-white/20" />{" "}
//           Available
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-4 h-4 bg-cyan-500 rounded-t-md" /> Selected
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-4 h-4 bg-red-950/40 border border-red-900/40 text-red-500 rounded-t-md flex items-center justify-center text-[9px]">
//             ✕
//           </div>{" "}
//           Occupied
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-4 h-4 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-t-md flex items-center justify-center text-[9px]">
//             🛠
//           </div>{" "}
//           Damaged
//         </div>
//       </div>

//       <div
//         className={`grid grid-cols-10 gap-3 mb-10 transition-opacity duration-200 ${availabilityLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`}
//       >
//         {seatsData.map((seat) => {
//           const seatLabel = `${seat.row_label}${seat.seat_number}`;
//           const isSelected = selectedSeats.some(
//             (s) => s.seat_id === seat.seat_id,
//           );
//           const isBooked = bookedSeats.includes(seatLabel);
//           const isDamaged = seat.seat_type === "DAMAGE";
//           const isDisabled =
//             isBooked ||
//             isDamaged ||
//             (!isSelected && selectedSeats.length >= seatCount);

//           return (
//             <button
//               key={seat.seat_id}
//               onClick={() => toggleSeat(seat)}
//               disabled={isDisabled}
//               className={`w-10 h-10 rounded-t-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center border-t-2 ${
//                 isSelected
//                   ? "bg-cyan-500 text-black border-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
//                   : isBooked
//                     ? "bg-red-950/20 text-red-500/40 border-red-900/30 line-through cursor-not-allowed"
//                     : isDamaged
//                       ? "bg-zinc-900/50 text-zinc-600 border-zinc-800 cursor-not-allowed"
//                       : isDisabled
//                         ? "bg-white/5 text-white/10 border-white/5 opacity-40"
//                         : "bg-white/10 text-white/40 border-white/10 hover:bg-white/20 hover:text-white"
//               }`}
//             >
//               {isDamaged
//                 ? "🛠"
//                 : isBooked
//                   ? "✕"
//                   : `${seat.row_label}${seat.seat_number}`}
//             </button>
//           );
//         })}
//       </div>

//       <div className="w-full flex items-center justify-between p-8 bg-black/60 backdrop-blur-xl rounded-[40px] border border-white/10">
//         <div className="flex flex-col">
//           <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">
//             Seats
//           </span>
//           <span className="text-xl font-black text-white">
//             {selectedSeats.length > 0
//               ? selectedSeats
//                   .map((s) => `${s.row_label}${s.seat_number}`)
//                   .sort()
//                   .join(", ")
//               : "—"}
//           </span>
//         </div>
//         <button
//           disabled={!isComplete || availabilityLoading}
//           onClick={handleProceedToPayment}
//           className={`px-10 py-4 rounded-2xl font-black transition-all ${
//             isComplete && !availabilityLoading
//               ? "bg-white text-black hover:bg-cyan-500 active:scale-95 cursor-pointer"
//               : "bg-white/10 text-white/20 cursor-not-allowed"
//           }`}
//         >
//           {availabilityLoading
//             ? "SYNCING..."
//             : isComplete
//               ? "PROCEED TO PAYMENT"
//               : `SELECT ${seatCount - selectedSeats.length} MORE`}
//         </button>
//       </div>
//     </div>
//   );
// }

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

  // Checkout / Payment Transition State
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  });

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

  // Phase B: Resolve Film ID dynamically
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
        console.error("Failed auto-resolving layout metadata:", err);
      }
    }
    autoResolveMovieMeta();
  }, [propFilmId, showtimeId]);

  // Phase C: Fetch Seating Occupancy Map Matrix
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
        if (result && result.data) setBookedSeats(result.data);
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

  // Handle Initial Step: Creating the PENDING Booking
  async function handleProceedToPayment() {
    if (!showtimeId) {
      alert("Error: Missing showtime parameters.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      return;
    }

    let currentUserId;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload.id;
    } catch (e) {
      alert("Your session token is malformed.");
      return;
    }

    const formattedSeatLabels = selectedSeats.map(
      (s) => `${s.row_label}${s.seat_number}`,
    );

    const payload = {
      userId: currentUserId,
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
        // Capture the bookingId from backend to route into the payment screen view
        setCurrentBookingId(result.data.bookingId);
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
        "Network processing error encountered processing your reservation.",
      );
    }
  }

  // Handle Mock Payment Form Submission
  async function handleMockPaymentSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setPaymentProcessing(true);

    const paymentPayload = {
      bookingId: currentBookingId,
      amount: selectedSeats.length * 12.5, // Sample static ticket price metric calculation
      paymentMethod: "CARD",
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentPayload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          "Transaction complete! Your seats have been claimed successfully.",
        );
        const formattedSeatLabels = selectedSeats.map(
          (s) => `${s.row_label}${s.seat_number}`,
        );
        setBookedSeats((prev) => [...prev, ...formattedSeatLabels]);
        // Clear transaction layout state environments
        setSelectedSeats([]);
        setCurrentBookingId(null);
      } else {
        alert(`Payment error: ${result.message}`);
      }
    } catch (err) {
      console.error("Payment pipeline interruption:", err);
      alert("Network exception verifying checkout transaction.");
    } finally {
      setPaymentProcessing(false);
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

  // Render Modern Payment View State if booking transaction is initialized
  if (currentBookingId) {
    const computedTotal = (selectedSeats.length * 12.5).toFixed(2);
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-black/60 backdrop-blur-xl rounded-[40px] border border-white/10 text-white shadow-2xl">
        <div className="mb-6">
          <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest block mb-1">
            Checkout Process
          </span>
          <h2 className="text-2xl font-black tracking-tight">SECURE PAYMENT</h2>
          <p className="text-xs text-white/40 mt-1">
            Booking Reference ID: {currentBookingId}
          </p>
        </div>

        {/* Cyberpunk Interactive Card Summary Visualization */}
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-cyan-600 via-zinc-900 to-black p-6 border border-cyan-500/30 relative overflow-hidden mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-xs tracking-widest font-mono text-cyan-400">
              CREDIT CARD
            </span>
            <span className="text-lg font-black italic tracking-tighter">
              CINEMA NET
            </span>
          </div>
          <div className="mt-8 font-mono text-base tracking-[0.25em]">
            {cardData.number
              ? cardData.number.replace(/(\d{4})/g, "$1 ").trim()
              : "•••• •••• •••• ••••"}
          </div>
          <div className="mt-6 flex justify-between items-end font-mono">
            <div>
              <p className="text-[8px] text-white/40 uppercase">Card Holder</p>
              <p className="text-xs tracking-wide uppercase truncate max-w-[180px]">
                {cardData.name || "YOUR FULL NAME"}
              </p>
            </div>
            <div>
              <p className="text-[8px] text-white/40 uppercase">Expires</p>
              <p className="text-xs">{cardData.expiry || "MM/YY"}</p>
            </div>
          </div>
        </div>

        {/* Pricing Matrix */}
        <div className="space-y-2 mb-6 border-y border-white/5 py-4 text-sm font-medium">
          <div className="flex justify-between text-white/60">
            <span>Seats Selected:</span>
            <span className="text-white font-mono">
              {selectedSeats
                .map((s) => `${s.row_label}${s.seat_number}`)
                .join(", ")}
            </span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Ticket Base Rate:</span>
            <span>{selectedSeats.length} × $12.50</span>
          </div>
          <div className="flex justify-between text-base font-black border-t border-dashed border-white/10 pt-2 text-cyan-400">
            <span>TOTAL AMOUNT:</span>
            <span>${computedTotal}</span>
          </div>
        </div>

        {/* Secure Form Fields */}
        <form onSubmit={handleMockPaymentSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider block mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) =>
                setCardData({ ...cardData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider block mb-1">
              Card Number
            </label>
            <input
              type="text"
              required
              maxLength={16}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="4111222233334444"
              value={cardData.number}
              onChange={(e) =>
                setCardData({
                  ...cardData,
                  number: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider block mb-1">
                Expiration
              </label>
              <input
                type="text"
                required
                maxLength={5}
                placeholder="MM/YY"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-center focus:outline-none focus:border-cyan-500 transition-colors"
                value={cardData.expiry}
                onChange={(e) =>
                  setCardData({ ...cardData, expiry: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider block mb-1">
                Security Code (CVC)
              </label>
              <input
                type="password"
                required
                maxLength={3}
                placeholder="•••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-center focus:outline-none focus:border-cyan-500 transition-colors"
                value={cardData.cvc}
                onChange={(e) =>
                  setCardData({
                    ...cardData,
                    cvc: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentBookingId(null)}
              className="w-1/3 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-xl text-xs font-bold uppercase transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={paymentProcessing}
              className="w-2/3 bg-cyan-500 text-black font-black py-4 rounded-xl text-xs transition-all tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-400 disabled:opacity-40"
            >
              {paymentProcessing ? "PROCESSING PAYMENT..." : "AUTHORIZE CHARGE"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Default Grid Display State
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