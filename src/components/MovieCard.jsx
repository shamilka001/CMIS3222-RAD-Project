// src/components/MovieCard.jsx
"use client";

import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-5 rounded-[2rem] shadow-2xl flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
      
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full aspect-[2/3] object-cover rounded-[1.5rem] shadow-xl mb-4"
        onError={(e) => {
          // Fallback image if the poster doesn't exist
          e.target.src = "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster";
        }}
      />

      <h2 className="text-xl font-bold text-white text-center">
        {movie.title}
      </h2>

      <p className="text-zinc-400 mb-6">{movie.genre}</p>

      <Link href={`/movie/${movie.id}`} className="w-full">
        <button className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-105 transition-all duration-300">
          Book Seat
        </button>
      </Link>
    </div>
  );
}