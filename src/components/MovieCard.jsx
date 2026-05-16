"use client";

import { useRouter } from "next/navigation";

export default function MovieCard({ movie }) {
  const router = useRouter();

  const handleQuickBook = () => {
    /** * This links the card to your John Wick detail page.
     * We REMOVED the ?mode=cinematic here so the user sees 
     * the beautiful detail page first.
     */
    router.push(`/movie/${movie.id}`);
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-5 rounded-[2rem] shadow-2xl flex flex-col items-center transition-all duration-300 hover:scale-105">
      
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full aspect-[2/3] object-cover rounded-[1.5rem] mb-4 cursor-pointer"
        onClick={() => router.push(`/movie/${movie.id}`)}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster";
        }}
      />

      <h2 className="text-xl font-bold text-white text-center">{movie.title}</h2>
      <p className="text-zinc-400 mb-6">{movie.genre}</p>

      <button 
        onClick={handleQuickBook}
        className="w-full py-3 rounded-full bg-blue-600 text-white font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-blue-500 transition-all active:scale-95"
      >
        Book Now
      </button>
    </div>
  );
}