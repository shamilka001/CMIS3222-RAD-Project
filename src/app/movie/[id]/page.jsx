"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from 'react';
import CinemaBooking from "@/components/booking/CinemaBooking";

/**
 * 2D Fallback Component
 * This only shows if the user navigates here normally WITHOUT clicking "Book Now"
 */
function SeatSelector2D({ movie, onBack, onStartCinematic }) {
  const [seatCount, setSeatCount] = useState(1);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 p-10 text-center">
        <button onClick={onBack} className="text-white/30 mb-6 hover:text-white transition block mx-auto">← Back</button>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">{movie.title}</h1>
        <p className="text-white/40 mb-10">{movie.genre}</p>
        
        <h2 className="text-xl font-medium text-white mb-6">Standard Selection</h2>
        
        <div className="flex items-center justify-center gap-8 mb-10">
          <button onClick={() => setSeatCount(Math.max(1, seatCount - 1))} className="w-12 h-12 rounded-2xl border border-white/10 text-white">-</button>
          <span className="text-7xl font-black text-cyan-500">{seatCount}</span>
          <button onClick={() => setSeatCount(Math.min(10, seatCount + 1))} className="w-12 h-12 rounded-2xl border border-white/10 text-white">+</button>
        </div>
        
        <button 
          onClick={onStartCinematic}
          className="w-full py-4 rounded-2xl font-bold bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default function MovieDetailPage({ params }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Check the URL for ?mode=cinematic
  const isCinematicMode = searchParams.get("mode") === "cinematic";

  const unwrappedParams = React.use(params);
  const movieId = unwrappedParams.id;

  useEffect(() => {
    const movies = {
      1: { id: 1, title: "Dune 2", genre: "Sci-Fi", duration: "2h 46m", rating: 8.8 },
      2: { id: 2, title: "Deadpool 3", genre: "Action", duration: "2h 10m", rating: 8.5 },
      3: { id: 3, title: "The Martian", genre: "Sci-Fi", duration: "2h 24m", rating: 8.2 },
      4: { id: 4, title: "Mario Bros", genre: "Animation", duration: "1h 32m", rating: 7.8 }
    };
    setMovie(movies[movieId]);
    setLoading(false);
  }, [movieId]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-widest">LOADING...</div>;
  if (!movie) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Movie not found</div>;

  /**
   * DIRECT CINEMATIC FLOW
   * If the user clicked "Book Now" on the Home Page, this block executes.
   * It skips the 2D UI and shows the Video + Seat Counter UI immediately.
   */
  if (isCinematicMode) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black">
        <CinemaBooking 
          movie={movie} 
          onBack={() => router.push("/")} 
        />
      </div>
    );
  }

  /**
   * STANDARD FLOW
   * Only shows if mode=cinematic is NOT in the URL
   */
  return (
    <SeatSelector2D 
        movie={movie} 
        onBack={() => router.push("/")} 
        onStartCinematic={() => router.push(`?mode=cinematic`)} 
    />
  );
}