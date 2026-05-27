// "use client";

// import { useEffect, useState, useRef } from "react";
// import MovieCard from "../components/MovieCard";
// import Navbar from "../components/Navbar";
// import Navdok from "../components/Navdok";
// import { CinemaMap } from "../components/CinemaMap";
// import LoginPage from "./login/page";
// import { motion, AnimatePresence } from "framer-motion";
// import dynamic from "next/dynamic";
// import { Footer } from "../components/Footer";

// // Dynamically import the HeroParallax to avoid SSR issues with GSAP
// const DynamicHeroParallax = dynamic(
//   () => import("../components/Hero").then((mod) => mod.HeroParallax),
//   { ssr: false },
// );

// // Swiper components
// import { Swiper, SwiperSlide } from "swiper/react";
// import { EffectCoverflow, Autoplay, FreeMode } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/effect-coverflow";
// import "swiper/css/free-mode";

// export default function UnifiedCinemaPage() {
//   const [view, setView] = useState("home"); // "home", "about", "transitioning", "contact", "login"
//   const [recommendedMovies, setRecommendedMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const videoRef = useRef(null);

//   // FETCH LIVE DATA FROM BACKEND DIRECTLY ON MOUNT
//   useEffect(() => {
//     async function loadMovies() {
//       try {
//         const res = await fetch("http://localhost:5000/film/get-all-film", {
//           cache: "no-store",
//         });
//         const responseData = await res.json();

//         if (responseData && responseData.data && responseData.data.length > 0) {
//           const formatted = responseData.data.map((movie) => ({
//             id: movie.film_id,
//             title: movie.film_name,
//             genre: movie.genre,
//             poster: movie.poster_image || "/images/posters/fallback.jpg",
//             rating: "8.5", // Mocking rating as it's not in the new schema yet
//             producer: "MaxLite Studios",
//             runtime: `${movie.duration} min`,
//           }));
//           setRecommendedMovies(formatted);
//         } else {
//           throw new Error("No movies found in backend");
//         }
//       } catch (error) {
//         console.warn(
//           "⚠️ Backend film data unavailable, running fallback local arrays:",
//           error,
//         );

//         setRecommendedMovies([
//           {
//             id: 1,
//             title: "John Wick 4",
//             genre: "Action",
//             poster: "/images/posters/wick.jpg",
//             rating: "8.8",
//             producer: "Lionsgate",
//             runtime: "169 min",
//           },
//           {
//             id: 2,
//             title: "Super Mario",
//             genre: "Animation",
//             poster: "/images/posters/mari.jpg",
//             rating: "8.5",
//             producer: "Nintendo",
//             runtime: "92 min",
//           },
//           {
//             id: 3,
//             title: "Interstellar",
//             genre: "Sci-Fi",
//             poster: "/images/posters/ints.jpg",
//             rating: "9.2",
//             producer: "Syncopy",
//             runtime: "169 min",
//           },
//           {
//             id: 4,
//             title: "Baba Yaga",
//             genre: "Action",
//             poster: "/images/posters/wick.jpg",
//             rating: "8.2",
//             producer: "Lionsgate",
//             runtime: "120 min",
//           },
//           {
//             id: 5,
//             title: "Mario Kart",
//             genre: "Animation",
//             poster: "/images/posters/mari.jpg",
//             rating: "7.8",
//             producer: "Nintendo",
//             runtime: "95 min",
//           },
//           {
//             id: 6,
//             title: "Space Odyssey",
//             genre: "Sci-Fi",
//             poster: "/images/posters/ints.jpg",
//             rating: "9.5",
//             producer: "Warner Bros",
//             runtime: "142 min",
//           },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadMovies();
//   }, []);

//   // Catch dynamic redirect signals coming from sub-folders (like movie/[id]/page.jsx)
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const action = urlParams.get("action");

//     if (action === "contact") {
//       window.history.replaceState({}, document.title, window.location.pathname);
//       setTimeout(() => {
//         triggerContactTransition();
//       }, 150);
//     } else if (action === "about") {
//       window.history.replaceState({}, document.title, window.location.pathname);
//       setView("about");
//     } else if (action === "login") {
//       window.history.replaceState({}, document.title, window.location.pathname);
//       setView("login");
//     }
//   }, []);

//   const triggerContactTransition = async () => {
//     if (videoRef.current) {
//       try {
//         videoRef.current.currentTime = 0;
//         await videoRef.current.play();
//         setView("transitioning");
//       } catch (error) {
//         console.warn("Video playback failed, jumping to contact:", error);
//         setView("contact");
//       }
//     } else {
//       setView("contact");
//     }
//   };

//   const handleVideoEnded = () => {
//     if (view === "transitioning") {
//       setView("contact");
//     }
//   };

//   return (
//     <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
//       {/* PERSISTENT NAVIGATION WITH ALL INNER ACTIONS BOUNDED TO COMPONENT STATES */}
//       <Navbar
//         onContactClick={triggerContactTransition}
//         onHomeClick={() => setView("home")}
//         onAboutClick={() => setView("about")}
//         onLoginClick={() => setView("login")}
//       />

//       {/* MOBILE NAVIGATION */}
//       <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:hidden">
//         <Navdok
//           onContactClick={triggerContactTransition}
//           onHomeClick={() => setView("home")}
//           onAboutClick={() => setView("about")}
//           onLoginClick={() => setView("login")}
//         />
//       </div>

//       {/* PERSISTENT VIDEO BACKGROUND */}
//       <div className="fixed inset-0 z-0 bg-black">
//         <video
//           ref={videoRef}
//           muted
//           playsInline
//           preload="auto"
//           onEnded={handleVideoEnded}
//           className={`w-full h-full object-cover transition-all duration-[1000ms] ease-in-out ${
//             view === "home"
//               ? "opacity-30 scale-105 blur-sm"
//               : view === "about"
//                 ? "opacity-20 blur-lg scale-105"
//                 : view === "login"
//                   ? "opacity-20 blur-xl scale-110"
//                   : "opacity-40 scale-100 blur-0"
//           }`}
//         >
//           <source src="/animations/contact.mp4" type="video/mp4" />
//         </video>
//         <div
//           className={`absolute inset-0 bg-black transition-opacity duration-1000 ${view === "home" ? "opacity-70" : "opacity-20"}`}
//         />
//       </div>

//       <AnimatePresence mode="wait">
//         {/* HOME VIEW */}
//         {view === "home" && (
//           <motion.div
//             key="home-view"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
//             className="relative z-10"
//           >
//             <section className="px-6 md:px-10 pt-32 pb-16">
//               <DynamicHeroParallax
//                 detailsTitle="Precision Sound Meets Unreal Depth"
//                 detailsDesc="Step into a world where every pixel is perfect and every sound is felt. MaxLite brings the future of entertainment to Moratuwa."
//               />
//             </section>

//             <motion.section
//               initial={{ opacity: 0, x: 100 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 1.2, ease: "easeOut" }}
//               viewport={{ once: true }}
//               className="px-10 pb-20"
//             >
//               {loading ? (
//                 <div className="text-center py-20 font-black tracking-widest text-zinc-500 animate-pulse">
//                   LOADING CINEMA FILMS...
//                 </div>
//               ) : (
//                 <div className="flex flex-wrap justify-center gap-8 py-12">
//                   {recommendedMovies.slice(0, 5).map((movie) => (
//                     <div key={movie.id} className="w-full max-w-[320px]">
//                       <MovieCard movie={movie} />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </motion.section>
//             <Footer />
//           </motion.div>
//         )}

//         {/* UNIFIED ABOUT US VIEW (INTEGRATED SINGLE PAGE ELEMENT) */}
//         {view === "about" && (
//           <motion.div
//             key="about-view"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -30 }}
//             className="relative z-10 pt-32"
//           >
//             <DynamicHeroParallax
//               title={
//                 <>
//                   About <span className="text-cyan-500">Us</span>
//                 </>
//               }
//               subtitle="The Future of Cinema in Moratuwa"
//               detailsTitle="Crafting Unforgettable Cinematic Memories"
//               detailsDesc="Since our inception, MaxLite has pushed the boundaries of what a local cinema can be. We bring global standards to your doorstep."
//             />

//             <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
//                 <motion.div
//                   initial={{ opacity: 0, x: -50 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 1 }}
//                   viewport={{ once: true }}
//                 >
//                   <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 italic">
//                     Our <span className="text-cyan-500">Vision</span>
//                   </h2>
//                   <p className="text-zinc-400 text-lg leading-relaxed mb-6">
//                     MaxLite Cinema was born from a desire to redefine the
//                     movie-going experience in Moratuwa. We combine
//                     state-of-the-art projection technology with immersive sound
//                     systems to bring you closer to the action than ever before.
//                   </p>
//                   <p className="text-zinc-400 text-lg leading-relaxed">
//                     Our mission is to create a community hub for film lovers,
//                     offering not just movies, but unforgettable experiences that
//                     stay with you long after the credits roll.
//                   </p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 1 }}
//                   viewport={{ once: true }}
//                   className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10"
//                 >
//                   <img
//                     src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
//                     alt="Cinema Interior"
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
//                 </motion.div>
//               </div>

//               <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-10">
//                 {[
//                   {
//                     title: "4K Projection",
//                     desc: "Crystal clear visuals with the latest laser technology.",
//                   },
//                   {
//                     title: "Dolby Atmos",
//                     desc: "Immersive 360-degree soundscapes for true depth.",
//                   },
//                   {
//                     title: "Premium Seating",
//                     desc: "Luxurious recliner seats for maximum comfort.",
//                   },
//                 ].map((feature, idx) => (
//                   <motion.div
//                     key={idx}
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: idx * 0.2 }}
//                     viewport={{ once: true }}
//                     className="p-10 rounded-[2.5rem] bg-zinc-950 border border-white/5 hover:border-cyan-500/30 transition-colors"
//                   >
//                     <h3 className="text-xl font-black uppercase tracking-widest text-cyan-500 mb-4">
//                       {feature.title}
//                     </h3>
//                     <p className="text-zinc-500 leading-relaxed">
//                       {feature.desc}
//                     </p>
//                   </motion.div>
//                 ))}
//               </div>
//             </section>
//             <Footer />
//           </motion.div>
//         )}

//         {/* LOGIN VIEW */}
//         {view === "login" && (
//           <motion.div
//             key="login-view"
//             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 1.05 }}
//             className="relative z-50 pt-20"
//           >
//             <LoginPage />
//           </motion.div>
//         )}

//         {/* CONTACT VIEW */}
//         {view === "contact" && (
//           <motion.div
//             key="contact-view"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             className="relative z-20 min-h-screen flex flex-col items-center pt-32 p-6 lg:p-10"
//           >
//             <div className="w-full max-w-6xl mt-12">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="w-full h-[400px] rounded-[3rem] overflow-hidden border border-white/10 mb-10 relative"
//               >
//                 <CinemaMap />
//               </motion.div>

//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//                 <div className="lg:col-span-4 space-y-8 text-left">
//                   <div>
//                     <h2 className="text-cyan-500 font-bold tracking-[0.3em] text-xs uppercase mb-2">
//                       Location
//                     </h2>
//                     <p className="text-2xl font-black uppercase italic">
//                       K-Zone Moratuwa
//                     </p>
//                   </div>
//                   <div>
//                     <h2 className="text-cyan-500 font-bold tracking-[0.3em] text-xs uppercase mb-2">
//                       Inquiries
//                     </h2>
//                     <p className="text-xl font-bold text-white">
//                       mora@maxlite.com
//                     </p>
//                   </div>
//                 </div>

//                 <div className="lg:col-span-8 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-12 text-left">
//                   <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <input
//                       placeholder="Name"
//                       className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-cyan-500 transition-all"
//                     />
//                     <input
//                       placeholder="Email"
//                       className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-cyan-500 transition-all"
//                     />
//                     <textarea
//                       placeholder="Message"
//                       className="col-span-full w-full bg-white/5 p-5 rounded-2xl border border-white/10 h-32 outline-none focus:border-cyan-500 transition-all"
//                     />
//                     <button
//                       type="submit"
//                       className="col-span-full bg-cyan-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:bg-white transition-all"
//                     >
//                       Send Message
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             </div>
//             <Footer />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </main>
//   );
// }










"use client";

import { useEffect, useState, useRef } from "react";
// Import useRouter for faster, native Next.js SPA navigation transitions
import { useRouter } from "next/navigation";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import Navdok from "../components/Navdok";
import { CinemaMap } from "../components/CinemaMap";
import LoginPage from "./login/page";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
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
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
        setView("transitioning");
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
        <Navdok
          onContactClick={triggerContactTransition}
          onHomeClick={() => setView("home")}
          onAboutClick={() => setView("about")}
          onLoginClick={() => setView("login")}
        />
      </div>

      {/* PERSISTENT VIDEO BACKGROUND */}
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
              : view === "about"
                ? "opacity-20 blur-lg scale-105"
                : view === "login"
                  ? "opacity-20 blur-xl scale-110"
                  : "opacity-40 scale-100 blur-0"
          }`}
        >
          <source src="/animations/contact.mp4" type="video/mp4" />
        </video>
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-1000 ${view === "home" ? "opacity-70" : "opacity-20"}`}
        />
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

                      {/* Live Showtime Badges Block */}
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
                                    // FIXED: Redirects smoothly directly to your dynamic route folder /movie/[id]
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

        {/* UNIFIED ABOUT US VIEW */}
        {view === "about" && (
          <motion.div
            key="about-view"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="relative z-10 pt-32"
          >
            <DynamicHeroParallax
              title={
                <>
                  About <span className="text-cyan-500">Us</span>
                </>
              }
              subtitle="The Future of Cinema in Moratuwa"
              detailsTitle="Crafting Unforgettable Cinematic Memories"
              detailsDesc="Since our inception, MaxLite has pushed the boundaries of what a local cinema can be. We bring global standards to your doorstep."
            />

            <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 italic">
                    Our <span className="text-cyan-500">Vision</span>
                  </h2>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                    MaxLite Cinema was born from a desire to redefine the
                    movie-going experience in Moratuwa. We combine
                    state-of-the-art projection technology with immersive sound
                    systems to bring you closer to the action than ever before.
                  </p>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Our mission is to create a community hub for film lovers,
                    offering not just movies, but unforgettable experiences that
                    stay with you long after the credits roll.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                  className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10"
                >
                  <img
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
                    alt="Cinema Interior"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
                </motion.div>
              </div>

              <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  {
                    title: "4K Projection",
                    desc: "Crystal clear visuals with the latest laser technology.",
                  },
                  {
                    title: "Dolby Atmos",
                    desc: "Immersive 360-degree soundscapes for true depth.",
                  },
                  {
                    title: "Premium Seating",
                    desc: "Luxurious recliner seats for maximum comfort.",
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.2 }}
                    viewport={{ once: true }}
                    className="p-10 rounded-[2.5rem] bg-zinc-950 border border-white/5 hover:border-cyan-500/30 transition-colors"
                  >
                    <h3 className="text-xl font-black uppercase tracking-widest text-cyan-500 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-500 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
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
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
