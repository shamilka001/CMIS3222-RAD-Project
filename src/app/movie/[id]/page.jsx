"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CinemaBooking from "@/components/booking/CinemaBooking";

function MovieDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const movieId = params.id;
  const isCinematicMode = searchParams.get("mode") === "cinematic";

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getMovieDetail() {
      try {
        const res = await fetch("/api/movies", { cache: "no-store" });
        const dbMovies = await res.json();
        
        const selectedMovie = dbMovies.find(m => String(m.id) === String(movieId));

        if (selectedMovie) {
          // 1. Grab whatever path strings are available in your data row
          const rawPoster = selectedMovie.posterUrl || selectedMovie.poster_url || "";
          const rawPortrait = selectedMovie.portraitUrl || selectedMovie.portrait_url || "";
          
          let finalPortraitPath = "";

          // 2. SMART PORTRAIT ROUTING FILTER
          if (rawPortrait && rawPortrait.trim() !== "") {
            // If you have a specific portrait column populated, prioritize it completely
            finalPortraitPath = rawPortrait;
          } else if (rawPoster) {
            // If missing a portrait column, convert the swiper poster path on the fly
            if (rawPoster.includes("wick.jpg")) {
              finalPortraitPath = rawPoster.replace("wick.jpg", "wickportrait.jpg");
            } else if (rawPoster.includes("mari")) {
              // Keeps 'mari' safe if it serves as both poster and portrait background
              finalPortraitPath = rawPoster; 
            } else if (rawPoster.includes("ints")) {
              finalPortraitPath = rawPoster.replace("ints", "intsportrait.jpg"); // Add if you have an intsportrait file
            } else if (rawPoster.includes("dune")) {
              finalPortraitPath = rawPoster.replace("dune", "duneportrait.jpg"); // Add if you have a duneportrait file
            } else {
              // Safe universal fall-back to the swiper poster path so the background is never empty
              finalPortraitPath = rawPoster;
            }
          } else {
            finalPortraitPath = "/images/posters/fallback.jpg";
          }

          setMovie({
            id: selectedMovie.id,
            title: selectedMovie.title || "Untitled Movie",
            genre: selectedMovie.genre || "Drama",
            description: selectedMovie.description || "No description available.",
            poster: rawPoster, // Keep the swiper asset for the bottom previews tray
            portrait: finalPortraitPath, // Load the targeted large background graphic
            rating: selectedMovie.rating || "0.0"
          });
        } else {
          throw new Error("Movie item absent in Neon dataset");
        }
      } catch (err) {
        console.warn("⚠️ Neon DB record fetch unresolvable, processing fallback mock array:", err);
        setMovie({
          id: movieId,
          title: "John Wick",
          genre: "Action, Thriller",
          description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything.",
          poster: "/images/posters/wick.jpg",
          portrait: "/images/posters/wickportrait.jpg" 
        });
      } finally {
        setLoading(false);
      }
    }

    if (movieId) getMovieDetail();
  }, [movieId]);

  const handleGoToCinematic = () => {
    router.push(`/movie/${movieId}?mode=cinematic`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b10] flex items-center justify-center text-zinc-500 font-black tracking-widest uppercase animate-pulse">
        Sourcing Film Files...
      </div>
    );
  }

  if (!movie) return null;

  if (isCinematicMode) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black">
        <CinemaBooking 
          movie={movie} 
          onBack={() => router.push(`/movie/${movieId}`)} 
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0a0b10] text-white overflow-hidden">
      
      {/* Background Portrait Graphic - Clean, high-resolution background asset */}
      <div className="absolute top-0 right-0 w-full lg:w-[70%] h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b10] via-[#0a0b10]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-transparent z-10" />
        <img
          src={movie.portrait} 
          alt={movie.title}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            // Fall back immediately to the working swiper image path if a portrait asset is completely missing on your machine
            e.currentTarget.src = movie.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";
          }}
        />
      </div>

      <div className="relative z-20 flex flex-col justify-center min-h-screen px-8 md:px-20 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-6 mb-8 text-gray-400 font-medium">
          <span>Today</span>
          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
          <span className="uppercase text-sm tracking-widest text-cyan-500 font-bold">
            {movie.genre}
          </span>
          {movie.rating && (
            <>
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
              <span className="text-sm font-bold text-amber-400">★ {movie.rating}</span>
            </>
          )}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }}
          className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter mb-4 leading-[0.9]"
        >
          {movie.title.includes(" ") ? (
            <>
              {movie.title.split(' ')[0]} <br /> {movie.title.split(' ').slice(1).join(' ')}
            </>
          ) : (
            movie.title
          )}
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl text-gray-400 mb-10 max-w-xl bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
          {movie.description}
        </motion.p>

        <div className="flex flex-wrap items-center gap-4 mb-20">
          <motion.button 
            onClick={handleGoToCinematic}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-cyan-500 text-black px-10 py-5 rounded-full font-black uppercase tracking-widest shadow-lg shadow-cyan-500/40"
          >
            Select Seats
          </motion.button>

          <button className="px-10 py-5 rounded-full border border-white/20 font-bold hover:bg-white/10 transition-all">
            Watch Trailer
          </button>
        </div>

        {/* MOVIE TRAY - Renders your working Swiper image references cleanly here */}
        <div className="flex items-end gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 relative w-24 h-36 rounded-xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <img 
                src={movie.poster} 
                className="w-full h-full object-cover" 
                alt="preview poster thumbnail" 
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <Link href="/" className="absolute top-10 left-10 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Home
      </Link>
    </div>
  );
}

export default function MovieDetailPage() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen" />}>
      <MovieDetailContent />
    </Suspense>
  );
}