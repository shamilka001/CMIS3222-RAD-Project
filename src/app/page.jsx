
"use client";

import { useEffect, useState, useRef } from "react";
// Import useRouter for faster, native Next.js SPA navigation transitions
import { useRouter } from "next/navigation";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import Navdok from "../components/Navdok";
import Testimonials from "../components/Testimonials";
import { CinemaMap } from "../components/CinemaMap";
import LoginPage from "./login/page";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";
import { Footer } from "../components/Footer";

// Dynamically import the HeroParallax to avoid SSR issues with GSAP
const DynamicHeroParallax = dynamic(
  () => import("../components/Hero").then((mod) => mod.HeroParallax),
  { ssr: false },
);

// Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/free-mode";

export default function UnifiedCinemaPage() {
  const router = useRouter(); // Initialize router instance
  const [view, setView] = useState("home"); // "home", "about", "transitioning", "contact", "login"
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef(null);

  // FETCH LIVE DATA FROM BACKEND DIRECTLY ON MOUNT
  useEffect(() => {
    async function loadMoviesAndShowtimes() {
      try {
        setErrorMsg("");

        // Fetch both films and showtimes simultaneously
        const [filmsRes, showtimesRes] = await Promise.all([
          fetch("http://localhost:5000/film/get-all-film", {
            cache: "no-store",
          }),
          fetch("http://localhost:5000/showtime/", { cache: "no-store" }),
        ]);

        const filmsData = await filmsRes.json();
        const showtimesData = await showtimesRes.json();

        if (filmsData && filmsData.data && filmsData.data.length > 0) {
          const fetchedShowtimes = showtimesData?.data || [];

          const formatted = filmsData.data.map((movie) => {
            // Find all showtimes associated with this specific film ID
            const matchingShowtimes = fetchedShowtimes
              .filter((st) => st.film_id === movie.film_id)
              .map((st) => {
                // Parse date and time strings accurately to build a clean comparison timestamp
                const cleanDateString = st.show_date.split("T")[0];
                const cleanTimeString = st.start_time.substring(0, 5);
                const showtimeExpiryDate = new Date(
                  `${cleanDateString}T${cleanTimeString}:00`,
                );
                const isPast = showtimeExpiryDate < new Date();

                return {
                  showtimeId: st.showtime_id,
                  startTime: cleanTimeString, // Formats "10:00:00.000000" to "10:00"
                  endTime: st.end_time.substring(0, 5),
                  screenName: st.screen_name,
                  isPast: isPast, // Flag used to explicitly disable past show dates
                  date: new Date(st.show_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }),
                };
              });

            return {
              id: movie.film_id,
              title: movie.film_name,
              genre: movie.genre,
              poster: movie.poster_image || "/images/posters/fallback.jpg",
              rating: "8.5", // Mocking rating as it's not in the new schema yet
              producer: "MaxLite Studios",
              runtime: `${movie.duration} min`,
              showtimes: matchingShowtimes, // Appended live showtimes array
            };
          });

          setRecommendedMovies(formatted);
        } else {
          throw new Error("No movies found in database.");
        }
      } catch (error) {
        console.error("Backend fetch failure:", error);
        setErrorMsg(
          "⚠️ Failed to load movie schedules. Please check connection.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMoviesAndShowtimes();
  }, []);

  // Catch dynamic redirect signals coming from sub-folders (like movie/[id]/page.jsx)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("action");

    if (action === "contact") {
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        triggerContactTransition();
      }, 150);
    } else if (action === "about") {
      window.history.replaceState({}, document.title, window.location.pathname);
      setView("about");
    } else if (action === "login") {
      window.history.replaceState({}, document.title, window.location.pathname);
      setView("login");
    }
  }, []);

  const triggerContactTransition = async () => {
    // Ensure window resets scroll location before displaying transition setups
    window.scrollTo({ top: 0 });
    
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        // Ensure video layer is visible to play it smoothly
        setView("transitioning");
        await videoRef.current.play();
      } catch (error) {
        console.warn("Video playback failed, jumping to contact:", error);
        setView("contact");
      }
    } else {
      setView("contact");
    }
  };

  const handleVideoEnded = () => {
    if (view === "transitioning") {
      setView("contact");
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* PERSISTENT NAVIGATION WITH ALL INNER ACTIONS BOUNDED TO COMPONENT STATES */}
      <Navbar
        onContactClick={triggerContactTransition}
        onHomeClick={() => setView("home")}
        onAboutClick={() => setView("about")}
        onLoginClick={() => setView("login")}
      />

      {/* MOBILE NAVIGATION */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:hidden">
        
      </div>

      {/* PERSISTENT VIDEO BACKGROUND */}
      {(view !== "about") && (
        <div className="fixed inset-0 z-0 bg-black">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            className={`w-full h-full object-cover transition-all duration-[1000ms] ease-in-out ${
              view === "home"
                ? "opacity-30 scale-105 blur-sm"
                : view === "login"
                  ? "opacity-20 blur-xl scale-110"
                  : view === "contact"
                    ? "opacity-0 scale-100 blur-0" // Hides the transition video completely once on the contact view
                    : "opacity-100 scale-100 blur-0" 
            }`}
          >
            <source src="/animations/contact.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            className="relative z-10"
          >
            <section className="px-6 md:px-10 pt-32 pb-16">
              <DynamicHeroParallax
                detailsTitle="Precision Sound Meets Unreal Depth"
                detailsDesc="Step into a world where every pixel is perfect and every sound is felt. MaxLite brings the future of entertainment to Moratuwa."
              />
            </section>

            <motion.section
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="px-10 pb-20"
            >
              {loading ? (
                <div className="text-center py-20 font-black tracking-widest text-zinc-500 animate-pulse">
                  LOADING CINEMA FILMS...
                </div>
              ) : errorMsg ? (
                <div className="text-center py-20 font-bold tracking-wider text-red-500/80 bg-red-500/5 max-w-xl mx-auto rounded-3xl border border-red-500/10">
                  {errorMsg}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-8 py-12">
                  {recommendedMovies.slice(0, 5).map((movie) => (
                    <div
                      key={movie.id}
                      className="w-full max-w-[320px] flex flex-col gap-4"
                    >
                      <MovieCard movie={movie} />

                      {movie.showtimes && movie.showtimes.length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-md">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-400">
                            Available Showtimes
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {movie.showtimes.map((st) => (
                              <button
                                key={st.showtimeId}
                                disabled={st.isPast}
                                onClick={() => {
                                  if (!st.isPast) {
                                    router.push(
                                      `/movie/${movie.id}?showtimeId=${st.showtimeId}`,
                                    );
                                  }
                                }}
                                className={`flex flex-col border rounded-lg px-2.5 py-1.5 text-center min-w-[70px] transition-all relative overflow-hidden ${
                                  st.isPast
                                    ? "bg-zinc-950/40 border-zinc-800/50 opacity-25 line-through cursor-not-allowed pointer-events-none select-none"
                                    : "bg-black/40 border-white/5 hover:border-cyan-500/50 hover:bg-cyan-950/20 active:scale-95 cursor-pointer"
                                }`}
                              >
                                <span
                                  className={`text-[9px] font-medium ${st.isPast ? "text-zinc-600" : "text-white/40"}`}
                                >
                                  {st.date}
                                </span>
                                <span
                                  className={`text-xs font-black mt-0.5 ${st.isPast ? "text-zinc-500" : "text-white"}`}
                                >
                                  {st.startTime}
                                </span>
                                <span
                                  className={`text-[8px] font-bold uppercase tracking-tight mt-0.5 truncate max-w-[65px] ${st.isPast ? "text-zinc-600" : "text-cyan-500/80"}`}
                                >
                                  {st.screenName}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
            <Footer />
          </motion.div>
        )}

        {/* FULL-WIDTH SCROLLABLE ABOUT US VIEW */}
        {view === "about" && (
          <motion.div
            key="about-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            className="relative z-10 w-full"
          >
            <AboutView />
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
            {/* Loop wrapper code removed completely here to stop indefinite background cycles */}

            <div className="w-full max-w-6xl mt-12 relative z-10">
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
                    <h2 className="text-cyan-500 font-bold tracking-[0.3em] text-xs uppercase mb-2">
                      Location
                    </h2>
                    <p className="text-2xl font-black uppercase italic">
                      K-Zone Moratuwa
                    </p>
                  </div>
                  <div>
                    <h2 className="text-cyan-500 font-bold tracking-[0.3em] text-xs uppercase mb-2">
                      Inquiries
                    </h2>
                    <p className="text-xl font-bold text-white">
                      mora@maxlite.com
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-8 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-12 text-left">
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      placeholder="Name"
                      className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-cyan-500 transition-all"
                    />
                    <input
                      placeholder="Email"
                      className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-cyan-500 transition-all"
                    />
                    <textarea
                      placeholder="Message"
                      className="col-span-full w-full bg-white/5 p-5 rounded-2xl border border-white/10 h-32 outline-none focus:border-cyan-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="col-span-full bg-cyan-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:bg-white transition-all"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="relative z-10 w-full mt-8">
              <Footer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// --- SUB-COMPONENT: ABOUT US VIEW ---
function AboutView() {
  const containerRef = useRef(null);
  const headerContainerRef = useRef(null);
  
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  // activeVideo state manages background tracks: "none", "bg1", "sp", or "sp2"
  const [activeVideo, setActiveVideo] = useState("none");

  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const video3Ref = useRef(null);

  // Testimonial data tailored to your cinematic/infrastructure theme
const cinemaTestimonials = [
  {
    text: "The 4K matrix screens at the Moratuwa K-Zone setup are mind-blowing. The visual depth and structural luxury completely redefine the local entertainment experience.",
    highlight: "redefine the local entertainment experience",
    image: "/images/users/1.jpg",
    name: "Priya Kapoor",
    role: "Production Director",
  },
  {
    text: "Experiencing the 360-degree acoustic setup is surreal. The clean directional sound pressure makes you feel like you are inside the movie.",
    highlight: "clean directional sound pressure",
    image: "/images/users/2.jpg",
    name: "Rohit Verma",
    role: "Audio Engineer",
  },
  {
    text: "Next-level architecture and hyper-realistic displays. The custom projection mapping spaces bring an unprecedented level of immersion to the audience.",
    highlight: "unprecedented level of immersion",
    image: "/images/users/ross.jpg",
    name: "Roshan Perera",
    role: "Creative Lead",
  },
  {
    text: "The high-fidelity audio layers provide perfect clarity. You can hear every subtle detail in the room grid, completely isolating you from the outside world.",
    highlight: "high-fidelity audio layers",
    image: "/images/users/shami.jpg",
    name: "Shamilka Peiris",
    role: "Technical Reviewer",
  },
  {
    text: "The AI analytics insights are invaluable for strategic planning. Forecasting behavior and trends has never been easier.",
    highlight: "AI analytics insights",
    image: "/images/users/din.jpg",
    name: "Dinuja Nimansith",
    role: "Backend Developer",
  },
];

  // Synchronize layout element background video instances
  useEffect(() => {
    if (activeVideo === "bg1") {
      video1Ref.current?.play().catch(() => {});
      if (video2Ref.current) { video2Ref.current.pause(); video2Ref.current.currentTime = 0; }
      if (video3Ref.current) { video3Ref.current.pause(); video3Ref.current.currentTime = 0; }
    } else if (activeVideo === "sp") {
      video2Ref.current?.play().catch(() => {});
      if (video1Ref.current) { video1Ref.current.pause(); video1Ref.current.currentTime = 0; }
      if (video3Ref.current) { video3Ref.current.pause(); video3Ref.current.currentTime = 0; }
    } else if (activeVideo === "sp2") {
      video3Ref.current?.play().catch(() => {});
      if (video1Ref.current) { video1Ref.current.pause(); video1Ref.current.currentTime = 0; }
      if (video2Ref.current) { video2Ref.current.pause(); video2Ref.current.currentTime = 0; }
    } else {
      if (video1Ref.current) { video1Ref.current.pause(); video1Ref.current.currentTime = 0; }
      if (video2Ref.current) { video2Ref.current.pause(); video2Ref.current.currentTime = 0; }
      if (video3Ref.current) { video3Ref.current.pause(); video3Ref.current.currentTime = 0; }
    }
  }, [activeVideo]);

  // Core Scroll Hooks for layout animations bound to viewport windows instead of overflow divs
  const { scrollYProgress } = useScroll();

  const { scrollYProgress: headerScrollProgress } = useScroll({
    target: headerContainerRef,
    offset: ["start start", "end start"],
  });

  // Intersection Observer configuration setup
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -30% 0px", 
      threshold: 0.1,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetId = entry.target.getAttribute("data-section-id");
          if (targetId === "1") setActiveVideo("bg1");
          else if (targetId === "2") setActiveVideo("sp");
          else if (targetId === "3") setActiveVideo("sp2");
          else setActiveVideo("none"); 
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    if (headerContainerRef.current) observer.observe(headerContainerRef.current);
    if (section1Ref.current) observer.observe(section1Ref.current);
    if (section2Ref.current) observer.observe(section2Ref.current);
    if (section3Ref.current) observer.observe(section3Ref.current);

    return () => observer.disconnect();
  }, []);

  // Top Hero Parallax Speeds
  const headerBgY = useTransform(headerScrollProgress, [0, 1], ["0%", "20%"]);
  const headerMidY = useTransform(headerScrollProgress, [0, 1], ["0%", "35%"]);
  const headerTextY = useTransform(headerScrollProgress, [0, 1], ["0%", "50%"]);
  const headerForeY = useTransform(headerScrollProgress, [0, 1], ["0%", "-15%"]);

  // Elements floating overlay alignment speeds
  const foreAssetY = useTransform(scrollYProgress, [0, 1], ["5%", "-10%"]);
  const cardContentY = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);

  // Text Fade Variant Parameters
  const textFadeVariant = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div ref={containerRef} className="w-full relative bg-black">
      
      {/* ─── PINNED FIXED BACKGROUND BLOCK (STAYS COMPLETELY MOTIONLESS) ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-black">
        {/* Video 1 Container: bg1.mp4 */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeVideo === "bg1" ? "opacity-100" : "opacity-0"}`}>
          <video
            ref={video1Ref}
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/images/about/bg1.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Video 2 Container: sp.mp4 */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeVideo === "sp" ? "opacity-100" : "opacity-0"}`}>
          <video
            ref={video2Ref}
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/images/about/sp.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Video 3 Container: sp2.mp4 */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeVideo === "sp2" ? "opacity-100" : "opacity-0"}`}>
          <video
            ref={video3Ref}
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/images/about/sp2.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* ─── MAIN HERO PARALLAX: FULL EDGE-TO-EDGE VIEWPORT ─── */}
      <div 
        ref={headerContainerRef} 
        data-section-id="0"
        className="relative h-screen w-full overflow-hidden border-b border-white/10 z-10"
      >
        {/* Layer 1: Background Image */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-100 scale-105"
          style={{ 
            backgroundImage: "url('/images/hero/bg.jpg')",
            y: headerBgY 
          }}
        />

        {/* Layer 2: Midground Element Layer */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
          style={{ 
            backgroundImage: "url('/images/hero/mid.png')",
            y: headerMidY 
          }}
        />

        {/* Layer 3: Text Content */}
        <motion.div 
          style={{ y: headerTextY }}
          className="absolute inset-0 flex flex-col items-center justify-start pt-32 md:pt-70 z-10 px-6 text-center select-none pointer-events-none"
        >
          <h1 className="text-[16vw] md:text-[9vw] font-black text-white italic tracking-tighter uppercase max-w-7xl leading-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]">
            ABOUT US
          </h1>
        </motion.div>

        {/* Layer 4: Foreground Overlay Asset */}
        <motion.div 
          style={{ y: headerForeY }}
          className="absolute inset-0 flex items-end justify-center z-20 pointer-events-none"
        >
          <img 
            src="/images/hero/fore.png" 
            alt="Foreground Asset" 
            className="h-[85vh] md:h-[85%] w-auto object-cover md:object-contain filter drop-shadow-[0_35px_35px_rgba(0,0,0,0.95)]" 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-25 pointer-events-none" />
      </div>

      {/* ─── FULL-WIDTH STRIPES PACKED VERTICALLY ─── */}
      <div className="w-full space-y-0 relative z-10">
        
        {/* SECTION 1: MAXLITE INFRASTRUCTURE */}
        <div 
          ref={section1Ref} 
          data-section-id="1" 
          className="relative h-[600px] w-full overflow-hidden border-b border-white/5 bg-transparent"
        >
          {/* CONTENT CARD LAYER */}
          <div className="absolute inset-0 z-30 flex items-center justify-start px-8 md:px-24 pointer-events-none">
            <motion.div
              style={{ y: cardContentY }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={textFadeVariant}
              className="max-w-xl text-left pointer-events-auto"
            >
              <span className="text-cyan-500 font-mono tracking-widest font-bold text-xs uppercase block mb-3">
                // 01 PREMIUM INFRASTRUCTURE
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic mb-4">
                Next-Level Architecture
              </h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
                Redefining the structural entertainment experience layout in Moratuwa with hyper-realistic screen matrices.
              </p>
            </motion.div>
          </div>

          {/* FOREGROUND ASSET LAYER */}
          <motion.div 
            style={{ y: foreAssetY }}
            className="absolute inset-0 flex items-end justify-end px-8 md:px-24 z-20 pointer-events-none"
          >
            <img 
              src="/images/about/hero1.png" 
              alt="Hardware Asset" 
              className="h-[80%] w-auto object-contain filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.9)]" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </motion.div>
        </div>

        {/* SECTION 2: 360 SOUND ACOUSTICS */}
        <div 
          ref={section2Ref} 
          data-section-id="2" 
          className="relative h-[600px] w-full overflow-hidden border-b border-white/5 bg-transparent"
        >
          <div className="absolute inset-0 z-30 flex items-center justify-end px-8 md:px-24 pointer-events-none">
            <motion.div
              style={{ y: cardContentY }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={textFadeVariant}
              className="max-w-xl text-left pointer-events-auto"
            >
              <span className="text-cyan-500 font-mono tracking-widest font-bold text-xs uppercase block mb-3">
                // 02 360 ACOUSTICS
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic mb-4">High-Fidelity Audio Layers</h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
                Discover custom high-fidelity production acoustic hardware setups delivering clean directional sound pressure inside the room grid.
              </p>
            </motion.div>
          </div>

          <motion.div 
            style={{ y: foreAssetY }}
            className="absolute inset-0 flex items-end justify-start px-8 md:px-24 z-20 pointer-events-none"
          >
            <img 
              src="/images/about/hero2.png" 
              alt="Audio Asset" 
              className="h-[80%] w-auto object-contain filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.9)]" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </motion.div>
        </div>

        {/* SECTION 3: VISION LUXURY */}
        <div 
          ref={section3Ref} 
          data-section-id="3" 
          className="relative h-[600px] w-full overflow-hidden bg-transparent"
        >
          <div className="absolute inset-0 z-30 flex items-center justify-start px-8 md:px-24 pointer-events-none">
            <motion.div
              style={{ y: cardContentY }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={textFadeVariant}
              className="max-w-xl text-left pointer-events-auto"
            >
              <span className="text-cyan-500 font-mono tracking-widest font-bold text-xs uppercase block mb-3">
                // 03 4K MATRIX LAUNCH
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic mb-4">Immersive Visual Depth</h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
                Step into ultimate structural luxury options and bright projection mapping spaces across K-Zone cinema configurations.
              </p>
            </motion.div>
          </div>

          <motion.div 
            style={{ y: foreAssetY }}
            className="absolute inset-0 flex items-end justify-end px-8 md:px-24 z-20 pointer-events-none"
          >
            <img 
              src="/images/about/hero3.png" 
              alt="Visual Asset" 
              className="h-[80%] w-auto object-contain filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.9)]" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </motion.div>
        </div>

      </div>

      {/* SECTION 4: TESTIMONIALS */}
        <div className="relative py-24 w-full overflow-hidden bg-transparent z-30">
          
          {/* Header restricted to container for center alignment */}
          <div className="container mx-auto px-6 mb-16 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={textFadeVariant}
              className="text-center"
            >
              <span className="text-cyan-500 font-mono tracking-widest font-bold text-xs uppercase block mb-3">
                // 04 CLIENT REVIEWS
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic">
                Experience Speaks
              </h3>
            </motion.div>
          </div>

          {/* Carousels broken out of the container for full-width edge-to-edge scroll */}
          <div className="space-y-6 relative z-10 w-full">
            <TestimonialsCarousel 
              cardHeight={220} 
              direction="left" 
              speed={35} 
              testimonials={cinemaTestimonials}
            />
            <TestimonialsCarousel 
              cardHeight={220} 
              direction="right" 
              speed={40} 
              testimonials={cinemaTestimonials}
            />
          </div>
          
          {/* Subtle gradient overlay to blend into the bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none -z-10" />
        </div>

      {/* Footer Block */}
      <div className="w-full px-6 md:px-10 border-t border-white/10 py-12 relative z-10 bg-black">
        <div className="w-full max-w-7xl mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}