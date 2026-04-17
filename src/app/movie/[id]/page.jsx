// src/app/movie/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as React from 'react';
import dynamic from 'next/dynamic';

const AutoCameraTheater = dynamic(
  () => import('@/components/AutoCameraTheater'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-yellow-400 border-r-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Cinema Experience...</p>
        </div>
      </div>
    )
  }
);

// 2D Seat Selection Component
function SeatSelector2D({ movie, onBack, onUpgradeTo3D }) {
  const [seatCount, setSeatCount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1);

  const rows = ["A", "B", "C", "D", "E", "F"];
  const seatsPerRow = 10;

  const handleCountConfirm = () => {
    if (seatCount > 0) setStep(2);
  };

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else if (selectedSeats.length < seatCount) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBookingConfirm = () => {
    if (selectedSeats.length === seatCount) {
      alert(`✅ Booking Confirmed!\n\nMovie: ${movie.title}\nSeats: ${selectedSeats.join(", ")}\nTotal: $${(selectedSeats.length * 12.99).toFixed(2)}`);
      onBack();
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 py-12">
          <button onClick={onBack} className="text-white mb-8 hover:text-yellow-400 transition">← Back to Movies</button>
          
          <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
            <p className="text-gray-400 mb-8">{movie.genre} • {movie.duration}</p>
            
            <h2 className="text-2xl font-bold text-white mb-4">How many seats?</h2>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <button onClick={() => setSeatCount(Math.max(0, seatCount - 1))} className="w-14 h-14 bg-gray-700 rounded-full text-white text-2xl hover:bg-gray-600">-</button>
              <span className="text-6xl font-bold text-yellow-400">{seatCount}</span>
              <button onClick={() => setSeatCount(Math.min(10, seatCount + 1))} className="w-14 h-14 bg-gray-700 rounded-full text-white text-2xl hover:bg-gray-600">+</button>
            </div>
            
            <button onClick={handleCountConfirm} disabled={seatCount === 0} className={`w-full py-3 rounded-full font-bold ${seatCount > 0 ? "bg-yellow-500 text-black hover:scale-105" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
              Continue to Seat Selection
            </button>
            
            <button onClick={onUpgradeTo3D} className="mt-4 text-purple-400 hover:text-purple-300 transition">
              🎬 Experience Cinematic 3D View →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        <button onClick={() => setStep(1)} className="text-white mb-8 hover:text-yellow-400">← Back</button>
        
        <div className="bg-gray-800/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Select Your Seats</h2>
          <p className="text-gray-400 text-center mb-8">Select exactly {seatCount} seat{seatCount !== 1 ? "s" : ""}</p>
          
          <div className="text-center mb-8">
            <div className="w-64 h-1 bg-yellow-400 mx-auto rounded-full mb-2" />
            <p className="text-gray-500 text-sm">SCREEN</p>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[650px]">
              {rows.map((row) => (
                <div key={row} className="flex justify-center mb-2">
                  <div className="w-8 text-gray-400 font-bold">{row}</div>
                  {[...Array(seatsPerRow)].map((_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isSelectable = selectedSeats.length < seatCount || isSelected;
                    return (
                      <button key={seatId} onClick={() => isSelectable && toggleSeat(seatId)} className={`w-10 h-10 m-1 rounded-t-lg text-sm transition ${isSelected ? "bg-yellow-500 text-black" : isSelectable ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-800 text-gray-600 cursor-not-allowed"}`}>
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div><p className="text-gray-400">Selected Seats</p><p className="text-xl font-bold text-white">{selectedSeats.join(", ") || "None"}</p></div>
              <div><p className="text-gray-400">Total</p><p className="text-2xl font-bold text-yellow-400">${(selectedSeats.length * 12.99).toFixed(2)}</p></div>
            </div>
            <button onClick={handleBookingConfirm} disabled={selectedSeats.length !== seatCount} className={`w-full py-3 rounded-full font-bold ${selectedSeats.length === seatCount ? "bg-yellow-500 text-black hover:scale-105" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MovieDetailPage({ params }) {
  const [movie, setMovie] = useState(null);
  const [useAutoCamera, setUseAutoCamera] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleBookingComplete = (bookingData) => {
    alert(`✨ Booking Confirmed!\n\nMovie: ${bookingData.movie}\nSeats: ${bookingData.seats.join(", ")}\nTotal: $${bookingData.total.toFixed(2)}`);
    router.push("/");
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  if (!movie) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Movie not found</div></div>;
  if (useAutoCamera) return <AutoCameraTheater movie={movie} onBookingComplete={handleBookingComplete} onBack={() => setUseAutoCamera(false)} />;
  return <SeatSelector2D movie={movie} onBack={() => router.push("/")} onUpgradeTo3D={() => setUseAutoCamera(true)} />;
}