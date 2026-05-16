"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CinemaBooking from "@/components/booking/CinemaBooking";
import { Footer } from "@/components/Footer";

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
        const res = await fetch(`http://localhost:5000/film/${movieId}`, { cache: "no-store" });
        const responseData = await res.json();
        
        if (responseData && responseData.data) {
          const film = responseData.data;
          
          setMovie({
            id: film.film_id,
            title: film.film_name || "Untitled Movie",
            genre: film.genre || "Drama",
            description: film.description || "No description available.",
            poster: film.poster_image || "/images/posters/fallback.jpg", 
            portrait: film.poster_image || "/images/posters/fallback.jpg", // Using poster as portrait if no separate portrait exists
            rating: "8.5",
            runtime: `${film.duration} min`
          });
        } else {
          throw new Error("Film item absent in backend");
        }
      } catch (err) {
        console.warn("⚠️ Backend record fetch unresolvable, processing fallback mock array:", err);
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
    <div className="relative min-h-screen w-full bg-[#0a0b10] text-white overflow-y-auto">
      
      {/* Background Portrait Graphic */}
      <div className="fixed top-0 right-0 w-full lg:w-[70%] h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b10] via-[#0a0b10]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-transparent z-10" />
        <img
          src={movie.portrait} 
          alt={movie.title}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            e.currentTarget.src = movie.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";
          }}
        />
      </div>

      <div className="relative z-20 flex flex-col pt-32 px-8 md:px-20">
        <div className="min-h-[70vh] flex flex-col justify-center">
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
        </div>

        {/* REVIEWS SECTION */}
        <section className="mt-20 mb-32 max-w-4xl">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 italic">
            User <span className="text-cyan-500">Reviews</span>
          </h2>

          {/* Add Review Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] mb-12">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Write a review</h3>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="text-2xl text-zinc-700 hover:text-amber-400 transition-colors">★</button>
              ))}
            </div>
            <textarea 
              placeholder="Share your thoughts about the film..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-cyan-500 transition-all min-h-[120px] mb-6"
            />
            <button className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-cyan-500 transition-all">
              Post Review
            </button>
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {[
              { name: "Nimansith Dinu", date: "2 days ago", rating: 5, text: "Absolutely breathtaking! The visuals and the score are on another level." },
              { name: "Shamilka Peiris", date: "1 week ago", rating: 4, text: "A cinematic masterpiece. Long but definitely worth the watch." }
            ].map((review, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-black uppercase text-sm tracking-tight">{review.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">{review.date}</p>
                  </div>
                  <div className="flex text-amber-400 text-xs">
                    {"★".repeat(review.rating)}
                  </div>
                </div>
                <p className="text-zinc-400 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />

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