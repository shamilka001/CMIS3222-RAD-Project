"use client";

import { useEffect, useState, useRef } from "react";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar"; 
import Navdok from "../components/Navdok";
import { CinemaMap } from "../components/CinemaMap";
import LoginPage from "./login/page";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import { Footer } from "../components/Footer";

// Dynamically import the HeroParallax to avoid SSR issues with GSAP
const DynamicHeroParallax = dynamic(() => import('../components/Hero').then(mod => mod.HeroParallax), { ssr: false });

// Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

export default function UnifiedCinemaPage() {
  const [view, setView] = useState("home"); // "home", "transitioning", "contact", "login"
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  // FETCH LIVE DATA FROM NEON DB DIRECTLY ON MOUNT
  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await fetch("/api/movies", { cache: "no-store" });
        const dbMovies = await res.json();
        
        // Cleaned up the broken duplicate syntax blocks here
        if (dbMovies && dbMovies.length > 0) {
          const formatted = dbMovies.map(movie => ({
            id: movie.id,
            title: movie.title,
            genre: movie.genre,
            // Uses the database string path directly since you confirmed it already contains /images/posters/
            poster: movie.posterUrl || "/images/posters/fallback.jpg", 
            rating: movie.rating || "0.0"
          }));
          setRecommendedMovies(formatted);
        } else {
          throw new Error("No movies found in database");
        }
      } catch (error) {
        console.warn("⚠️ Neon DB data unavailable, running fallback local arrays pointing to public/images/posters/:", error);
        
        // Local fallback array strictly configured to read your public/images/posters/ directory files
        setRecommendedMovies([
          { id: 1, title: "Dune 2", genre: "Sci-Fi", poster: "/images/posters/dune.png", rating: "8.8" },
          { id: 2, title: "Deadpool 3", genre: "Action", poster: "/images/posters/deadpool.jpg", rating: "8.5" },
          { id: 3, title: "The Martian", genre: "Sci-Fi", poster: "/images/posters/martian.jpg", rating: "8.2" },
          { id: 4, title: "Mario Bros", genre: "Animation", poster: "/images/posters/mario.jpg", rating: "7.8" }
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  const triggerContactTransition = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setView("transitioning");
    }
  };

  const handleVideoEnded = () => {
    if (view === "transitioning") {
      setView("contact");
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* PERSISTENT NAVIGATION */}
      <Navbar 
        onContactClick={triggerContactTransition} 
        onHomeClick={() => setView("home")} 
        onLoginClick={() => setView("login")}
      />

      {/* MOBILE NAVIGATION */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:hidden">
        <Navdok 
          onContactClick={triggerContactTransition} 
          onHomeClick={() => setView("home")} 
          onLoginClick={() => setView("login")}
        />
      </div>

      {/* PERSISTENT VIDEO BACKGROUND */}
      <div className="fixed inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          src="/animations/contact.mp4"
          muted
          playsInline
          onEnded={handleVideoEnded}
          className={`w-full h-full object-cover transition-all duration-[1000ms] ease-in-out ${
            view === "home" ? "opacity-30 scale-105 blur-sm" : 
            view === "login" ? "opacity-20 blur-xl scale-110" : "opacity-40 scale-100 blur-0"
          }`}
        />
        <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ${view === "home" ? 'opacity-70' : 'opacity-20'}`} />
      </div>

      <AnimatePresence mode="wait">
        {/* HOME VIEW */}
        {view === "home" && (
          <motion.div 
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            className="relative z-10"
          >
            <section className="px-6 md:px-10 pt-32 pb-16">
              <DynamicHeroParallax />
            </section>

            <section className="px-10 pb-20">
              {loading ? (
                <div className="text-center py-20 font-black tracking-widest text-zinc-500 animate-pulse">
                  LOADING CINEMA FILMS...
                </div>
              ) : (
                <Swiper
                  modules={[EffectCoverflow, Autoplay]}
                  effect="coverflow"
                  centeredSlides={true}
                  slidesPerView={"auto"}
                  loop={true} 
                  loopPreventsSliding={false} 
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  coverflowEffect={{
                    rotate: 10,
                    stretch: 0,
                    depth: 150,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  className="py-12"
                >
                  {recommendedMovies.map((movie) => (
                    <SwiperSlide key={movie.id} className="max-w-[350px]">
                      <MovieCard movie={movie} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </section>
            <Footer />
          </motion.div>
        )}

        {/* LOGIN VIEW */}
        {view === "login" && (
          <motion.div 
            key="login-view"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative z-50 pt-20"
          >
            <LoginPage />
          </motion.div>
        )}

        {/* CONTACT VIEW */}
        {view === "contact" && (
          <motion.div 
            key="contact-view"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-20 min-h-screen flex flex-col items-center pt-32 p-6 lg:p-10"
          >
            <div className="w-full max-w-6xl mt-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-[400px] rounded-[3rem] overflow-hidden border border-white/10 mb-10 relative"
              >
                <CinemaMap />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8 text-left">
                  <div>
                    <h2 className="text-cyan-500 font-bold tracking-[0.3em] text-xs uppercase mb-2">Location</h2>
                    <p className="text-2xl font-black uppercase italic">K-Zone Moratuwa</p>
                  </div>
                  <div>
                    <h2 className="text-cyan-500 font-bold tracking-[0.3em] text-xs uppercase mb-2">Inquiries</h2>
                    <p className="text-xl font-bold text-white">mora@maxlite.com</p>
                  </div>
                </div>

                <div className="lg:col-span-8 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-12 text-left">
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input placeholder="Name" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-cyan-500 transition-all" />
                    <input placeholder="Email" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-cyan-500 transition-all" />
                    <textarea placeholder="Message" className="col-span-full w-full bg-white/5 p-5 rounded-2xl border border-white/10 h-32 outline-none focus:border-cyan-500 transition-all" />
                    <button type="submit" className="col-span-full bg-cyan-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:bg-white transition-all">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}