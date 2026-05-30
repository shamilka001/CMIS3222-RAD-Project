"use client";

import { useRouter } from "next/navigation";

export default function MovieCard({ movie }) {
  const router = useRouter();

  const handleQuickBook = () => {
    router.push(`/movie/${movie.id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(parseFloat(rating) / 2);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? "text-amber-400" : "text-zinc-700"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-zinc-950 border border-white/5 p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center transition-all duration-500 hover:border-cyan-500/30 group">
      
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-[2rem] mb-6 shadow-2xl">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
          onClick={() => router.push(`/movie/${movie.id}`)}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster";
          }}
        />
        
        {/* Top Info Overlay */}
        <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-white border border-white/10">
          {movie.runtime || "120 MIN"}
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-cyan-400">
              <span>{movie.genre}</span>
              <div className="flex gap-0.5">{renderStars(movie.rating)}</div>
           </div>
        </div>
      </div>

      <div className="w-full px-2 text-left">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-1 truncate">{movie.title}</h2>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">
          {movie.producer || "MAXLITE STUDIOS"}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
             <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Rating</span>
             <span className="text-sm font-black text-white italic">★ {movie.rating}</span>
          </div>
          <button 
            onClick={handleQuickBook}
            className="flex-1 py-3 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-cyan-500 transition-all active:scale-95 shadow-lg"
          >
            Sourcing Seats
          </button>
        </div>
      </div>
    </div>
  );
}