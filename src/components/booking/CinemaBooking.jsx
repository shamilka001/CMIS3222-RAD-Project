"use client";

import { useState, useRef, useEffect } from "react";
import SeatSelector from "./SeatSelector";
export default function CinemaBooking({
  onBack,
  selectedMovie,
  selectedShowtime,
}) {
  const [stage, setStage] = useState("COUNT_PICKER"); // "COUNT_PICKER" | "TRANSITIONING" | "UI_READY" | "TICKET_VIEW"
  const [seatCount, setSeatCount] = useState(1);
  const [confirmedSeats, setConfirmedSeats] = useState([]);

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Force video to the very beginning and keep it paused
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, []);

  const startTransition = () => {
    setStage("TRANSITIONING");
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const checkVideoPosition = () => {
    if (
      videoRef.current &&
      videoRef.current.currentTime >= videoRef.current.duration - 0.1
    ) {
      videoRef.current.pause(); // Stay on the last frame
      setStage("UI_READY");
    }
  };

  // Switch to Ticket Preview instead of auto-printing
  const handlePrintTickets = (seatsToPrint) => {
    setConfirmedSeats(seatsToPrint);
    setStage("TICKET_VIEW");
  };

  // 1. ISOLATED TICKET PREVIEW & PRINT VIEW
  if (
    stage === "TICKET_VIEW" &&
    confirmedSeats.length > 0 &&
    selectedMovie &&
    selectedShowtime
  ) {
    return (
      <Tickets
        selectedMovie={selectedMovie}
        selectedShowtime={selectedShowtime}
        selectedSeats={confirmedSeats}
        onClose={onBack}
      />
    );
  }

  // 2. MAIN INTERACTIVE THEATER EXPERIENCE VIEW
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Background Video controlled by state */}
      <video
        ref={videoRef}
        src="/animations/theater_transition.mp4"
        muted
        playsInline
        onTimeUpdate={checkVideoPosition}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          stage === "UI_READY" ? "opacity-40" : "opacity-100"
        }`}
      />

      {/* Overlay UI */}
      <div className="relative z-[100] w-full max-w-4xl px-6">
        {/* PHASE 1: UI on top of START frame */}
        {stage === "COUNT_PICKER" && (
          <div className="mx-auto max-w-md text-center p-10 bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/10 animate-in fade-in zoom-in duration-500">
            <h1 className="text-3xl font-black text-white mb-8 tracking-tighter">
              SELECT TICKETS
            </h1>

            <div className="flex items-center justify-center gap-8 mb-10">
              <button
                onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                className="text-white text-4xl hover:text-blue-500 transition-colors"
              >
                -
              </button>
              <span className="text-7xl font-black text-white w-24">
                {seatCount}
              </span>
              <button
                onClick={() => setSeatCount(Math.min(10, seatCount + 1))}
                className="text-white text-4xl hover:text-blue-500 transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={startTransition}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg"
            >
              CONFIRM SEATS
            </button>
          </div>
        )}

        {/* PHASE 2: UI on top of END frame */}
        {stage === "UI_READY" && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <SeatSelector
              seatCount={seatCount}
              selectedMovie={selectedMovie}
              selectedShowtime={selectedShowtime}
              onPrintTickets={handlePrintTickets}
            />
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="absolute top-10 left-10 z-[110] text-white/50 hover:text-white font-bold transition-colors"
      >
        ← BACK
      </button>
    </div>
  );
}