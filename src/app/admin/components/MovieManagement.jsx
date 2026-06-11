// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Film,
//   Calendar,
//   Plus,
//   Edit2,
//   Trash2,
//   X,
//   Clock,
//   Tag,
//   Search,
//   BarChart3,
//   Armchair,
//   CheckCircle2,
//   AlertCircle,
//   Video,
//   DollarSign,
//   TrendingUp,
//   Languages,
// } from "lucide-react";

// export default function MovieManagement() {
//   // Application Data States
//   const [movies, setMovies] = useState([]);
//   const [screens, setScreens] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);

//   // UI Modal Controls
//   const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
//   const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
//   const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

//   // Custom Alert / Notification Modal State
//   const [notification, setNotification] = useState(null);

//   // Active Target Trays
//   const [editingMovie, setEditingMovie] = useState(null);
//   const [activeMovieForScreening, setActiveMovieForScreening] = useState(null);
//   const [statsMovie, setStatsMovie] = useState(null);
//   const [statsScreenings, setStatsScreenings] = useState([]);
//   const [statsSelectedScreening, setStatsSelectedScreening] = useState(null);
//   const [bookedSeats, setBookedSeats] = useState([]);
//   const [loadingSeats, setLoadingSeats] = useState(false);

//   // Form Field Trays
//   const [movieForm, setMovieForm] = useState({
//     title: "",
//     genre: "",
//     duration: "",
//     description: "",
//     language: "English",
//     releaseDate: "",
//     posterImage: "",
//     trailerLink: "",
//     status: "Upcoming",
//   });

//   const [screeningForm, setScreeningForm] = useState({
//     screenId: "",
//     showDate: "",
//     startTime: "",
//     endTime: "",
//   });

//   // --- INITIAL DATA FETCH ENGINE ---
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       // 1. Fetch Movies
//       const filmRes = await fetch("http://localhost:5000/film/get-all-film");
//       const filmJson = await filmRes.json();

//       // 2. Fetch Screens for Dropdown Mapping References
//       const screenRes = await fetch("http://localhost:5000/screen/");
//       const screenJson = await screenRes.json();

//       if (screenJson && screenJson.data) {
//         setScreens(screenJson.data);
//       }

//       if (filmJson && filmJson.data) {
//         // Hydrate each movie with its related showtimes from backend
//         const hydratedMovies = await Promise.all(
//           filmJson.data.map(async (film) => {
//             try {
//               const stRes = await fetch(
//                 `http://localhost:5000/showtime/film/${film.film_id}`,
//               );
//               const stJson = await stRes.json();
//               return {
//                 id: film.film_id,
//                 title: film.film_name,
//                 genre: film.genre,
//                 duration: film.duration,
//                 description: film.description,
//                 language: film.language,
//                 releaseDate: film.release_date
//                   ? film.release_date.split("T")[0]
//                   : "",
//                 posterImage: film.poster_image,
//                 trailerLink: film.trailer_link,
//                 status: film.status,
//                 screenings: stJson.data || [],
//               };
//             } catch (e) {
//               return {
//                 id: film.film_id,
//                 title: film.film_name,
//                 genre: film.genre,
//                 duration: film.duration,
//                 description: film.description,
//                 language: film.language,
//                 releaseDate: film.release_date
//                   ? film.release_date.split("T")[0]
//                   : "",
//                 posterImage: film.poster_image,
//                 trailerLink: film.trailer_link,
//                 status: film.status,
//                 screenings: [],
//               };
//             }
//           }),
//         );
//         setMovies(hydratedMovies);
//       }
//     } catch (err) {
//       showNotice(
//         "error",
//         "Data Connection Failure",
//         "Could not synchronize with database records.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- LIVE RE-FETCH SUB-ROUTINE FOR SINGLE MOVIE ---
//   const refreshSingleMovieScreenings = async (movieId) => {
//     try {
//       const stRes = await fetch(
//         `http://localhost:5000/showtime/film/${movieId}`,
//       );
//       const stJson = await stRes.json();

//       setMovies((prev) =>
//         prev.map((m) =>
//           m.id === movieId ? { ...m, screenings: stJson.data || [] } : m,
//         ),
//       );
//       if (statsMovie && statsMovie.id === movieId) {
//         setStatsScreenings(stJson.data || []);
//       }
//     } catch (err) {
//       console.error("Error updates on screening context streams:", err);
//     }
//   };

//   // --- LIVE AUDITORIUM SEAT MAP FETCH MATRIX ---
//   // Updated to dynamically monitor both Selected Showtime and its associated Target Screen ID
//   useEffect(() => {
//     if (statsMovie && statsSelectedScreening) {
//       const screenId =
//         statsSelectedScreening.screen_id || statsSelectedScreening.screenId;
//       fetchBookedSeats(
//         statsMovie.id,
//         statsSelectedScreening.showtime_id,
//         screenId,
//       );
//     } else {
//       setBookedSeats([]);
//     }
//   }, [statsMovie, statsSelectedScreening]);

//   const fetchBookedSeats = async (filmId, showtimeId, screenId) => {
//     setLoadingSeats(true);
//     try {
//       // Fetches booked seats conditioned accurately upon the specific screen asset and showtime sequence
//       const res = await fetch(
//         `http://localhost:5000/book-seat/${filmId}/${showtimeId}?screenId=${screenId}`,
//       );
//       const json = await res.json();
//       if (json && json.data) {
//         setBookedSeats(json.data);
//       } else {
//         setBookedSeats([]);
//       }
//     } catch (err) {
//       setBookedSeats([]);
//     } finally {
//       setLoadingSeats(false);
//     }
//   };

//   // --- POPUP NOTIFICATION TRIGGER UTILITY ---
//   const showNotice = (type, title, message, onConfirm = null) => {
//     setNotification({ type, title, message, onConfirm });
//   };

//   const closeNotice = () => {
//     setNotification(null);
//   };

//   // --- DATA INTERMEDIARY PROFILE ACTIONS ---
//   const openMovieAdd = () => {
//     setEditingMovie(null);
//     setMovieForm({
//       title: "",
//       genre: "",
//       duration: "",
//       description: "",
//       language: "English",
//       releaseDate: "",
//       posterImage: "",
//       trailerLink: "",
//       status: "Upcoming",
//     });
//     setIsMovieModalOpen(true);
//   };

//   const openMovieEdit = (movie) => {
//     setEditingMovie(movie);
//     setMovieForm({
//       title: movie.title,
//       genre: movie.genre,
//       duration: movie.duration,
//       description: movie.description || "",
//       language: movie.language || "English",
//       releaseDate: movie.releaseDate || "",
//       posterImage: movie.posterImage || "",
//       trailerLink: movie.trailerLink || "",
//       status: movie.status || "Upcoming",
//     });
//     setIsMovieModalOpen(true);
//   };

//   const openStatsModal = (movie) => {
//     setStatsMovie(movie);
//     setStatsScreenings(movie.screenings);
//     setStatsSelectedScreening(
//       movie.screenings && movie.screenings.length > 0
//         ? movie.screenings[0]
//         : null,
//     );
//     setIsStatsModalOpen(true);
//   };

//   // --- FILM DATABASE MUTATION HANDLERS (CREATE / UPDATE / DELETE) ---
//   const handleMovieSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       film_name: movieForm.title,
//       genre: movieForm.genre,
//       duration: parseInt(movieForm.duration) || 120,
//       description: movieForm.description,
//       language: movieForm.language,
//       release_date: movieForm.releaseDate,
//       poster_image: movieForm.posterImage,
//       trailer_link: movieForm.trailerLink,
//       status: movieForm.status,
//     };
//     try {
//       let url = "http://localhost:5000/film/save";
//       let method = "POST";
//       if (editingMovie) {
//         url = `http://localhost:5000/film/update/${editingMovie.id}`;
//         method = "PUT";
//       }

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const resData = await res.json();

//       if (res.ok) {
//         showNotice(
//           "success",
//           "Catalog Updated",
//           `Successfully saved context tracking data for: ${movieForm.title}`,
//         );
//         setIsMovieModalOpen(false);
//         fetchAllData();
//       } else {
//         showNotice(
//           "error",
//           "Submission Fault",
//           resData.message || "Could not validate backend entity entries.",
//         );
//       }
//     } catch (err) {
//       showNotice(
//         "error",
//         "Network Error",
//         "The server rejected the operational persistence command thread.",
//       );
//     }
//   };

//   const triggerMovieDelete = (movieId, movieTitle) => {
//     showNotice(
//       "confirm",
//       "Purge Confirmation Required",
//       `Are you sure you want to permanently delete "${movieTitle}"? All automated screening tracks will be cleaned from structural storage matrices.`,
//       async () => {
//         try {
//           // FIXED: Adjusted fetch layout endpoint URL to align with your absolute backend routing pattern:
//           const res = await fetch(
//             `http://localhost:5000/film/delete/${movieId}`,
//             { method: "DELETE" },
//           );
//           const data = await res.json();
//           if (res.ok) {
//             showNotice(
//               "success",
//               "Record Cleared",
//               "The movie record has been successfully purged.",
//             );
//             fetchAllData();
//           } else {
//             showNotice(
//               "error",
//               "Purge Failure",
//               data.message || "Database engine denied requested operation.",
//             );
//           }
//         } catch (err) {
//           showNotice(
//             "error",
//             "Network Failure",
//             "Execution breakdown intercepted on live operational pipeline.",
//           );
//         }
//       },
//     );
//   };

//   // --- SHOWTIME ROUTINE HANDLERS (CREATE / DELETE) ---
//   const openScreeningAdd = (movie) => {
//     setActiveMovieForScreening(movie);
//     setScreeningForm({
//       screenId: screens.length > 0 ? screens[0].screen_id : "",
//       showDate: new Date().toISOString().split("T")[0],
//       startTime: "12:00",
//       endTime: "14:30",
//     });
//     setIsScreeningModalOpen(true);
//   };

//   const handleScreeningSubmit = async (e) => {
//     e.preventDefault();
//     if (!screeningForm.screenId) {
//       showNotice(
//         "error",
//         "Configuration Incomplete",
//         "Please register a valid target Screen allocation asset.",
//       );
//       return;
//     }

//     const payload = {
//       filmId: activeMovieForScreening.id,
//       screenId: screeningForm.screenId,
//       showDate: screeningForm.showDate,
//       startTime: screeningForm.startTime,
//       endTime: screeningForm.endTime,
//     };
//     try {
//       const res = await fetch("http://localhost:5000/showtime/save", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const resData = await res.json();

//       if (res.ok) {
//         showNotice(
//           "success",
//           "Showtime Verified",
//           "New programmed screening slot correctly written to memory logs.",
//         );
//         setIsScreeningModalOpen(false);
//         refreshSingleMovieScreenings(activeMovieForScreening.id);
//       } else {
//         showNotice(
//           "error",
//           "Schedule Refused",
//           resData.message ||
//             "Selected slot overlaps or breaks structural screening logic rules.",
//         );
//       }
//     } catch (err) {
//       showNotice(
//         "error",
//         "Server Timeout",
//         "Network layer failure during transactional transmission pipeline.",
//       );
//     }
//   };

//   const triggerScreeningDelete = (movieId, screeningId) => {
//     showNotice(
//       "confirm",
//       "Cancel Showtime Track",
//       "Are you sure you want to drop this individual programming session log?",
//       async () => {
//         try {
//           const res = await fetch(
//             `http://localhost:5000/showtime/delete/${screeningId}`,
//             { method: "DELETE" },
//           );
//           const data = await res.json();
//           if (res.ok) {
//             showNotice(
//               "success",
//               "Showtime Dropped",
//               "The projection session was removed safely.",
//             );
//             refreshSingleMovieScreenings(movieId);
//             if (statsSelectedScreening?.showtime_id === screeningId) {
//               setStatsSelectedScreening(null);
//             }
//           } else {
//             showNotice(
//               "error",
//               "Drop Failure",
//               data.message ||
//                 "Request was bounced by verification ledger engines.",
//             );
//           }
//         } catch (err) {
//           showNotice(
//             "error",
//             "Transaction Fault",
//             "Pipeline tracking timed out during deletion query execution.",
//           );
//         }
//       },
//     );
//   };

//   const filteredMovies = movies.filter(
//     (movie) =>
//       movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       movie.genre.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const seatRows = ["A", "B", "C", "D", "E", "F"];
//   const seatNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

//   if (loading) {
//     return (
//       <div className="w-full h-96 flex flex-col items-center justify-center space-y-4">
//         <div className="w-8 h-8 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" />
//         <span className="text-zinc-500 font-bold tracking-widest text-[10px] uppercase">
//           Recompiling Core Data Trees...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full space-y-4 p-4 text-foreground bg-zinc-950 min-h-screen">
//       {/* Alert Overlay Banner Trigger Notification Modal */}
//       {notification && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
//           <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm w-full text-center space-y-4 shadow-xl">
//             <div className="flex justify-center">
//               {notification.type === "error" ? (
//                 <AlertCircle className="text-red-500 w-10 h-10" />
//               ) : (
//                 <CheckCircle2 className="text-brand-lime w-10 h-10" />
//               )}
//             </div>
//             <h4 className="font-black text-sm uppercase tracking-wide">
//               {notification.title}
//             </h4>
//             <p className="text-xs text-muted-foreground">
//               {notification.message}
//             </p>
//             <div className="flex gap-2 justify-center pt-2">
//               {notification.onConfirm ? (
//                 <>
//                   <button
//                     onClick={closeNotice}
//                     className="px-4 py-2 border border-zinc-700 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => {
//                       notification.onConfirm();
//                       closeNotice();
//                     }}
//                     className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
//                   >
//                     Confirm Action
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={closeNotice}
//                   className="px-6 py-2 bg-brand-lime text-black rounded-xl text-xs font-black uppercase tracking-wider"
//                 >
//                   Dismiss
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Search and Action Row */}
//       <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xs">
//         <div className="relative w-full sm:w-80">
//           <Search
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
//             size={14}
//           />
//           <input
//             type="text"
//             placeholder="Search catalog by title or genre..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-white"
//           />
//         </div>
//         <button
//           onClick={openMovieAdd}
//           className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-lime text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shrink-0"
//         >
//           <Plus size={14} /> Register Film Entry
//         </button>
//       </div>

//       {/* Main Table Presentation View Container */}
//       <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
//         <div className="w-full overflow-x-auto">
//           <table className="w-full border-collapse text-left">
//             <thead>
//               <tr className="border-b border-zinc-800 bg-zinc-950/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
//                 <th className="p-4 pl-6 w-[30%]">Film Metadata & Details</th>
//                 <th className="p-4 w-[15%]">Genre Track</th>
//                 <th className="p-4 w-[10%]">Duration</th>
//                 <th className="p-4 w-[25%]">Active Programmed Screenings</th>
//                 <th className="p-4 pr-6 text-right w-[20%]">Actions Matrix</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-zinc-800/60 text-xs font-medium">
//               {filteredMovies.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="p-8 text-center text-muted-foreground/60 italic"
//                   >
//                     No cinematic records matched your search parameters.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredMovies.map((movie) => (
//                   <tr
//                     key={movie.id}
//                     className="hover:bg-white/[0.01] transition-colors group"
//                   >
//                     <td className="p-4 pl-6">
//                       <div className="flex items-center gap-3">
//                         <div className="h-12 w-9 rounded-md bg-zinc-950 overflow-hidden flex-shrink-0 border border-zinc-800">
//                           {movie.posterImage ? (
//                             <img
//                               src={movie.posterImage}
//                               alt=""
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 bg-zinc-900">
//                               <Film size={12} />
//                             </div>
//                           )}
//                         </div>
//                         <div className="truncate max-w-[220px]">
//                           <span className="font-bold block text-white group-hover:text-brand-lime transition-colors duration-150 truncate">
//                             {movie.title}
//                           </span>
//                           <span className="text-[9px] font-mono text-muted-foreground/50 block mt-0.5 truncate">
//                             ID: {movie.id}
//                           </span>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-4">
//                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-muted-foreground text-[11px] font-semibold">
//                         {movie.genre}
//                       </span>
//                     </td>

//                     <td className="p-4 text-muted-foreground font-mono">
//                       <span>{movie.duration} min</span>
//                     </td>

//                     <td className="p-4">
//                       <div className="space-y-1.5 max-w-[280px]">
//                         {!movie.screenings || movie.screenings.length === 0 ? (
//                           <span className="text-[10px] text-muted-foreground/40 italic block py-0.5">
//                             No showtimes live
//                           </span>
//                         ) : (
//                           <div className="flex flex-wrap gap-1">
//                             {movie.screenings.map((scr) => {
//                               const matchedScreen = screens.find(
//                                 (s) =>
//                                   s.screen_id === scr.screen_id ||
//                                   s.screen_id === scr.screenId,
//                               );
//                               const correctScreenName =
//                                 scr.screen_name ||
//                                 matchedScreen?.screen_name ||
//                                 "Screen";

//                               return (
//                                 <div
//                                   key={scr.showtime_id}
//                                   className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[10px] font-mono font-bold"
//                                 >
//                                   <span className="text-white">
//                                     {scr.start_time.substring(0, 5)}
//                                   </span>
//                                   <span className="text-muted-foreground/30 text-[8px]">
//                                     •
//                                   </span>
//                                   <span className="text-brand-lime text-[9px] font-semibold truncate max-w-[80px]">
//                                     {correctScreenName}
//                                   </span>
//                                   <button
//                                     onClick={() =>
//                                       triggerScreeningDelete(
//                                         movie.id,
//                                         scr.showtime_id,
//                                       )
//                                     }
//                                     className="ml-1 text-muted-foreground/30 hover:text-red-400 transition-colors"
//                                   >
//                                     <X size={10} />
//                                   </button>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         )}
//                         <button
//                           onClick={() => openScreeningAdd(movie)}
//                           className="text-[10px] text-brand-lime hover:underline font-black uppercase tracking-wider block pt-0.5"
//                         >
//                           + Program Showtime
//                         </button>
//                       </div>
//                     </td>

//                     <td className="p-4 pr-6 text-right">
//                       <div className="flex items-center justify-end gap-1">
//                         <button
//                           onClick={() => openStatsModal(movie)}
//                           className="p-2 rounded-lg text-brand-lime bg-brand-lime/[0.06] hover:bg-brand-lime hover:text-black border border-brand-lime/10 transition-all"
//                         >
//                           <BarChart3 size={13} />
//                         </button>
//                         <button
//                           onClick={() => openMovieEdit(movie)}
//                           className="p-2 rounded-lg text-muted-foreground/70 hover:text-white hover:bg-zinc-800 border border-transparent transition-all"
//                         >
//                           <Edit2 size={13} />
//                         </button>
//                         <button
//                           onClick={() =>
//                             triggerMovieDelete(movie.id, movie.title)
//                           }
//                           className="p-2 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 border border-transparent transition-all"
//                         >
//                           <Trash2 size={13} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- SIDE METRIC BOARD DRAWER PANEL --- */}
//       {isStatsModalOpen && statsMovie && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex justify-end">
//           <div className="bg-zinc-900 border-l border-zinc-800 w-full max-w-2xl h-full p-6 flex flex-col justify-between overflow-y-auto">
//             <div>
//               <div className="flex justify-between items-start border-b border-zinc-800 pb-4 mb-6">
//                 <div>
//                   <span className="text-[10px] font-bold text-brand-lime uppercase tracking-widest font-mono block mb-1">
//                     Seat Audit Mapping Engine
//                   </span>
//                   <h2 className="text-lg font-black text-white tracking-tight">
//                     {statsMovie.title}
//                   </h2>
//                   <p className="text-xs text-muted-foreground mt-0.5">
//                     {statsMovie.genre} • {statsMovie.duration} min
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setIsStatsModalOpen(false)}
//                   className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-muted-foreground hover:text-white transition-all"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
//                 <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
//                   <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">
//                     Designated Language
//                   </span>
//                   <div className="flex items-center gap-2 mt-1 text-white font-mono text-sm font-bold">
//                     <Languages size={16} className="text-brand-lime" />
//                     <span className="uppercase tracking-wider">
//                       {statsMovie.language || "English"}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
//                   <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">
//                     Live Booking Index Metrics
//                   </span>
//                   <div className="flex items-center gap-2 mt-1 text-white font-mono text-sm font-bold">
//                     <TrendingUp size={16} className="text-emerald-500" />
//                     <span>
//                       {statsSelectedScreening
//                         ? `${bookedSeats.length} Active Reservations`
//                         : "No Selection Triggered"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Dynamic Screen/Showtime Selection */}
//               <div className="space-y-2 mb-6">
//                 <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
//                   Select Active Screening Session Slot
//                 </label>
//                 {!statsScreenings || statsScreenings.length === 0 ? (
//                   <div className="p-4 bg-zinc-950 border border-dashed border-zinc-800 rounded-xl text-center text-xs italic text-muted-foreground/60">
//                     No active runtime showtimes available to compile analytics.
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {statsScreenings.map((scr) => {
//                       const isTarget =
//                         statsSelectedScreening?.showtime_id === scr.showtime_id;
//                       const matchedScreen = screens.find(
//                         (s) =>
//                           s.screen_id === scr.screen_id ||
//                           s.screen_id === scr.screenId,
//                       );
//                       const displayScreenName =
//                         scr.screen_name ||
//                         matchedScreen?.screen_name ||
//                         "Screen";
//                       return (
//                         <button
//                           key={scr.showtime_id}
//                           type="button"
//                           onClick={() => setStatsSelectedScreening(scr)}
//                           className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-3 ${
//                             isTarget
//                               ? "bg-brand-lime border-brand-lime text-black font-black"
//                               : "bg-zinc-950 border-zinc-800 text-white hover:border-zinc-600"
//                           }`}
//                         >
//                           <Clock size={13} />
//                           <div>
//                             <span className="block font-mono leading-none">
//                               {scr.start_time.substring(0, 5)} -{" "}
//                               {scr.end_time.substring(0, 5)}
//                             </span>
//                             <span
//                               className={`text-[8px] uppercase tracking-tight block mt-0.5 font-bold ${isTarget ? "text-black/60" : "text-muted-foreground"}`}
//                             >
//                               {displayScreenName} •{" "}
//                               {scr.show_date ? scr.show_date.split("T")[0] : ""}
//                             </span>
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Interactive Multi-Screen Conditional Topology Grid Map */}
//               {statsSelectedScreening && (
//                 <div className="border border-zinc-800 bg-zinc-950/20 rounded-2xl p-5 space-y-6">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
//                     <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
//                       <Armchair size={14} className="text-brand-lime" /> Screen
//                       Matrix Blueprint Map Layout
//                     </h4>
//                     <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground font-mono">
//                       <div className="flex items-center gap-1.5">
//                         <span className="w-2.5 h-2.5 rounded-xs bg-zinc-800 border border-zinc-700 block" />
//                         <span>Available</span>
//                       </div>
//                       <div className="flex items-center gap-1.5">
//                         <span className="w-2.5 h-2.5 rounded-xs bg-brand-lime block" />
//                         <span>Booked ({bookedSeats.length})</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="relative w-full max-w-sm mx-auto text-center pt-2">
//                     <div className="w-full h-1 bg-gradient-to-r from-transparent via-brand-lime/40 to-transparent rounded-full" />
//                     <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block mt-2">
//                       Auditorium Front Screen Vector
//                     </span>
//                   </div>

//                   {loadingSeats ? (
//                     <div className="py-12 text-center text-xs text-muted-foreground/60 italic">
//                       Scanning transaction logs for allocated seat arrays...
//                     </div>
//                   ) : (
//                     <div className="flex flex-col gap-2 max-w-md mx-auto pt-4">
//                       {seatRows.map((row) => (
//                         <div key={row} className="flex items-center gap-3">
//                           <span className="w-3 text-[10px] font-black font-mono text-muted-foreground/40">
//                             {row}
//                           </span>
//                           <div className="flex-1 grid grid-cols-10 gap-1.5">
//                             {seatNumbers.map((num) => {
//                               const seatCode = `${row}${num}`;
//                               const paddedSeatCode = `${row}0${num}`;
//                               const isBooked =
//                                 bookedSeats.includes(seatCode) ||
//                                 bookedSeats.includes(paddedSeatCode);

//                               return (
//                                 <div
//                                   key={seatCode}
//                                   className={`aspect-square rounded-md text-[8px] font-bold font-mono flex items-center justify-center transition-all ${
//                                     isBooked
//                                       ? "bg-brand-lime text-black font-black"
//                                       : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-500"
//                                   }`}
//                                   title={`Seat Node: ${seatCode} [${isBooked ? "Occupied" : "Vacant Available"}]`}
//                                 >
//                                   {num}
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
//               <button
//                 type="button"
//                 onClick={() => setIsStatsModalOpen(false)}
//                 className="px-5 py-2.5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all"
//               >
//                 Close Metrics Board
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- DIALOG MODAL A: REGISTER / EDIT FILM ENTRY --- */}
//       {isMovieModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-3xl p-6 shadow-xl relative text-white max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={() => setIsMovieModalOpen(false)}
//               className="absolute right-4 top-4 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-muted-foreground hover:text-white transition-all"
//             >
//               <X size={14} />
//             </button>
//             <h3 className="text-sm font-black tracking-tight mb-4 uppercase">
//               {editingMovie
//                 ? "Edit Catalog Item details"
//                 : "Register New Cinematic Production"}
//             </h3>
//             <form
//               onSubmit={handleMovieSubmit}
//               className="space-y-4 text-xs font-medium"
//             >
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                     Film Title
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={movieForm.title}
//                     onChange={(e) =>
//                       setMovieForm({ ...movieForm, title: e.target.value })
//                     }
//                     className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                     Genre Trace
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="e.g. Action / Sci-Fi"
//                     value={movieForm.genre}
//                     onChange={(e) =>
//                       setMovieForm({ ...movieForm, genre: e.target.value })
//                     }
//                     className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                     Runtime (Minutes)
//                   </label>
//                   <input
//                     type="number"
//                     required
//                     value={movieForm.duration}
//                     onChange={(e) =>
//                       setMovieForm({ ...movieForm, duration: e.target.value })
//                     }
//                     className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                     Track Language
//                   </label>
//                   <input
//                     type="text"
//                     value={movieForm.language}
//                     onChange={(e) =>
//                       setMovieForm({ ...movieForm, language: e.target.value })
//                     }
//                     className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                     Status Track
//                   </label>
//                   <select
//                     value={movieForm.status}
//                     onChange={(e) =>
//                       setMovieForm({ ...movieForm, status: e.target.value })
//                     }
//                     className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                   >
//                     <option value="Upcoming">Upcoming</option>
//                     <option value="Released">Released</option>
//                     <option value="Archived">Archived</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                   Release Target Date
//                 </label>
//                 <input
//                   type="date"
//                   value={movieForm.releaseDate}
//                   onChange={(e) =>
//                     setMovieForm({ ...movieForm, releaseDate: e.target.value })
//                   }
//                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                   Poster Image Stream URL
//                 </label>
//                 <input
//                   type="text"
//                   value={movieForm.posterImage}
//                   onChange={(e) =>
//                     setMovieForm({ ...movieForm, posterImage: e.target.value })
//                   }
//                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                   Trailer Link
//                 </label>
//                 <input
//                   type="text"
//                   value={movieForm.trailerLink}
//                   onChange={(e) =>
//                     setMovieForm({ ...movieForm, trailerLink: e.target.value })
//                   }
//                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                   Production Log Synopsis
//                 </label>
//                 <textarea
//                   rows={3}
//                   value={movieForm.description}
//                   onChange={(e) =>
//                     setMovieForm({ ...movieForm, description: e.target.value })
//                   }
//                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none resize-none"
//                 />
//               </div>
//               <div className="pt-2 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsMovieModalOpen(false)}
//                   className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-muted-foreground hover:text-white transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2 bg-brand-lime text-black font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
//                 >
//                   Commit Log Entity
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- DIALOG MODAL B: SCREENING SLOT GENERATION ENGINE --- */}
//       {isScreeningModalOpen && activeMovieForScreening && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-xl relative text-white">
//             <button
//               onClick={() => setIsScreeningModalOpen(false)}
//               className="absolute right-4 top-4 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-muted-foreground hover:text-white transition-all"
//             >
//               <X size={14} />
//             </button>
//             <h3 className="text-sm font-black tracking-tight mb-1 uppercase">
//               Program Showtime Matrix
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Adding screening window track metrics for:{" "}
//               <span className="font-bold text-white">
//                 {activeMovieForScreening.title}
//               </span>
//             </p>
//             <form
//               onSubmit={handleScreeningSubmit}
//               className="space-y-4 text-xs font-medium"
//             >
//               <div className="space-y-1">
//                 <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                   Target Screen Allocation Unit
//                 </label>
//                 <select
//                   required
//                   value={screeningForm.screenId}
//                   onChange={(e) =>
//                     setScreeningForm({
//                       ...screeningForm,
//                       screenId: e.target.value,
//                     })
//                   }
//                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                 >
//                   {screens.map((scr) => (
//                     <option key={scr.screen_id} value={scr.screen_id}>
//                       {scr.screen_name} ({scr.screen_type} - Cap: {scr.capacity}
//                       )
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                   Performance Target Date
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   value={screeningForm.showDate}
//                   onChange={(e) =>
//                     setScreeningForm({
//                       ...screeningForm,
//                       showDate: e.target.value,
//                     })
//                   }
//                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                     Start Time
//                   </label>
//                   <input
//                     type="time"
//                     required
//                     value={screeningForm.startTime}
//                     onChange={(e) =>
//                       setScreeningForm({
//                         ...screeningForm,
//                         startTime: e.target.value,
//                       })
//                     }
//                     className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[10px] uppercase font-bold text-muted-foreground">
//                     End Time
//                   </label>
//                   <input
//                     type="time"
//                     required
//                     value={screeningForm.endTime}
//                     onChange={(e) =>
//                       setScreeningForm({
//                         ...screeningForm,
//                         endTime: e.target.value,
//                       })
//                     }
//                     className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
//                   />
//                 </div>
//               </div>
//               <div className="pt-2 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsScreeningModalOpen(false)}
//                   className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-muted-foreground hover:text-white transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2 bg-brand-lime text-black font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
//                 >
//                   Write Show Track
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






"use client";

import React, { useState, useEffect } from "react";
import {
  Film,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  Clock,
  Tag,
  Search,
  BarChart3,
  Armchair,
  CheckCircle2,
  AlertCircle,
  Video,
  DollarSign,
  TrendingUp,
  Languages,
} from "lucide-react";

export default function MovieManagement() {
  // Application Data States
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // UI Modal Controls
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Custom Alert / Notification Modal State
  const [notification, setNotification] = useState(null);

  // Active Target Trays
  const [editingMovie, setEditingMovie] = useState(null);
  const [activeMovieForScreening, setActiveMovieForScreening] = useState(null);
  const [statsMovie, setStatsMovie] = useState(null);
  const [statsScreenings, setStatsScreenings] = useState([]);
  const [statsSelectedScreening, setStatsSelectedScreening] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);

  // Form Field Trays
  const [movieForm, setMovieForm] = useState({
    title: "",
    genre: "",
    duration: "",
    description: "",
    language: "English",
    releaseDate: "",
    posterImage: "",
    trailerLink: "",
    status: "Upcoming",
  });

  const [screeningForm, setScreeningForm] = useState({
    screenId: "",
    showDate: "",
    startTime: "",
    endTime: "",
  });

  // --- INITIAL DATA FETCH ENGINE ---
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Movies
      const filmRes = await fetch("http://localhost:5000/film/get-all-film");
      const filmJson = await filmRes.json();

      // 2. Fetch Screens for Dropdown Mapping References
      const screenRes = await fetch("http://localhost:5000/screen/");
      const screenJson = await screenRes.json();

      if (screenJson && screenJson.data) {
        setScreens(screenJson.data);
      }

      if (filmJson && filmJson.data) {
        // Hydrate each movie with its related showtimes from backend
        const hydratedMovies = await Promise.all(
          filmJson.data.map(async (film) => {
            try {
              const stRes = await fetch(
                `http://localhost:5000/showtime/film/${film.film_id}`,
              );
              const stJson = await stRes.json();
              return {
                id: film.film_id,
                title: film.film_name,
                genre: film.genre,
                duration: film.duration,
                description: film.description,
                language: film.language,
                releaseDate: film.release_date
                  ? film.release_date.split("T")[0]
                  : "",
                posterImage: film.poster_image,
                trailerLink: film.trailer_link,
                status: film.status,
                screenings: stJson.data || [],
              };
            } catch (e) {
              return {
                id: film.film_id,
                title: film.film_name,
                genre: film.genre,
                duration: film.duration,
                description: film.description,
                language: film.language,
                releaseDate: film.release_date
                  ? film.release_date.split("T")[0]
                  : "",
                posterImage: film.poster_image,
                trailerLink: film.trailer_link,
                status: film.status,
                screenings: [],
              };
            }
          }),
        );
        setMovies(hydratedMovies);
      }
    } catch (err) {
      showNotice(
        "error",
        "Data Connection Failure",
        "Could not synchronize with database records.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- LIVE RE-FETCH SUB-ROUTINE FOR SINGLE MOVIE ---
  const refreshSingleMovieScreenings = async (movieId) => {
    try {
      const stRes = await fetch(
        `http://localhost:5000/showtime/film/${movieId}`,
      );
      const stJson = await stRes.json();

      setMovies((prev) =>
        prev.map((m) =>
          m.id === movieId ? { ...m, screenings: stJson.data || [] } : m,
        ),
      );
      if (statsMovie && statsMovie.id === movieId) {
        setStatsScreenings(stJson.data || []);
      }
    } catch (err) {
      console.error("Error updates on screening context streams:", err);
    }
  };

  // --- LIVE AUDITORIUM SEAT MAP FETCH MATRIX ---
  useEffect(() => {
    if (statsMovie && statsSelectedScreening) {
      const screenId =
        statsSelectedScreening.screen_id || statsSelectedScreening.screenId;
      fetchBookedSeats(
        statsMovie.id,
        statsSelectedScreening.showtime_id,
        screenId,
      );
    } else {
      setBookedSeats([]);
    }
  }, [statsMovie, statsSelectedScreening]);

  const fetchBookedSeats = async (filmId, showtimeId, screenId) => {
    setLoadingSeats(true);
    try {
      const res = await fetch(
        `http://localhost:5000/book-seat/${filmId}/${showtimeId}?screenId=${screenId}`,
      );
      const json = await res.json();
      if (json && json.data) {
        setBookedSeats(json.data);
      } else {
        setBookedSeats([]);
      }
    } catch (err) {
      setBookedSeats([]);
    } finally {
      setLoadingSeats(false);
    }
  };

  // --- POPUP NOTIFICATION TRIGGER UTILITY ---
  const showNotice = (type, title, message, onConfirm = null) => {
    setNotification({ type, title, message, onConfirm });
  };

  const closeNotice = () => {
    setNotification(null);
  };

  // --- DATA INTERMEDIARY PROFILE ACTIONS ---
  const openMovieAdd = () => {
    setEditingMovie(null);
    setMovieForm({
      title: "",
      genre: "",
      duration: "",
      description: "",
      language: "English",
      releaseDate: "",
      posterImage: "",
      trailerLink: "",
      status: "Upcoming",
    });
    setIsMovieModalOpen(true);
  };

  const openMovieEdit = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      genre: movie.genre,
      duration: movie.duration,
      description: movie.description || "",
      language: movie.language || "English",
      releaseDate: movie.releaseDate || "",
      posterImage: movie.posterImage || "",
      trailerLink: movie.trailerLink || "",
      status: movie.status || "Upcoming",
    });
    setIsMovieModalOpen(true);
  };

  const openStatsModal = (movie) => {
    setStatsMovie(movie);
    setStatsScreenings(movie.screenings);
    setStatsSelectedScreening(
      movie.screenings && movie.screenings.length > 0
        ? movie.screenings[0]
        : null,
    );
    setIsStatsModalOpen(true);
  };

  // --- FILM DATABASE MUTATION HANDLERS (CREATE / UPDATE / DELETE) ---
  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      film_name: movieForm.title,
      genre: movieForm.genre,
      duration: parseInt(movieForm.duration) || 120,
      description: movieForm.description,
      language: movieForm.language,
      release_date: movieForm.releaseDate,
      poster_image: movieForm.posterImage,
      trailer_link: movieForm.trailerLink,
      status: movieForm.status,
    };
    try {
      let url = "http://localhost:5000/film/save";
      let method = "POST";
      if (editingMovie) {
        url = `http://localhost:5000/film/update/${editingMovie.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();

      if (res.ok) {
        showNotice(
          "success",
          "Catalog Updated",
          `Successfully saved context tracking data for: ${movieForm.title}`,
        );
        setIsMovieModalOpen(false);
        fetchAllData();
      } else {
        showNotice(
          "error",
          "Submission Fault",
          resData.message || "Could not validate backend entity entries.",
        );
      }
    } catch (err) {
      showNotice(
        "error",
        "Network Error",
        "The server rejected the operational persistence command thread.",
      );
    }
  };

  const triggerMovieDelete = (movieId, movieTitle) => {
    showNotice(
      "confirm",
      "Purge Confirmation Required",
      `Are you sure you want to permanently delete "${movieTitle}"? All automated screening tracks will be cleaned from structural storage matrices.`,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/film/delete/${movieId}`,
            { method: "DELETE" },
          );
          const data = await res.json();
          if (res.ok) {
            showNotice(
              "success",
              "Record Cleared",
              "The movie record has been successfully purged.",
            );
            fetchAllData();
          } else {
            showNotice(
              "error",
              "Purge Failure",
              data.message || "Database engine denied requested operation.",
            );
          }
        } catch (err) {
          showNotice(
            "error",
            "Network Failure",
            "Execution breakdown intercepted on live operational pipeline.",
          );
        }
      },
    );
  };

  // --- SHOWTIME ROUTINE HANDLERS (CREATE / DELETE) ---
  const openScreeningAdd = (movie) => {
    setActiveMovieForScreening(movie);
    setScreeningForm({
      screenId: screens.length > 0 ? screens[0].screen_id : "",
      showDate: new Date().toISOString().split("T")[0],
      startTime: "12:00",
      endTime: "14:30",
    });
    setIsScreeningModalOpen(true);
  };

  const handleScreeningSubmit = async (e) => {
    e.preventDefault();
    if (!screeningForm.screenId) {
      showNotice(
        "error",
        "Configuration Incomplete",
        "Please register a valid target Screen allocation asset.",
      );
      return;
    }

    // --- DEACTIVATED SCREEN VERIFICATION GUARD ---
    const matchingScreen = screens.find((s) => s.screen_id === screeningForm.screenId);
    if (matchingScreen && (matchingScreen.status === "deactive" || matchingScreen.status === "deactivated")) {
      showNotice(
        "error",
        "Scheduling Blocked",
        `Cannot assign a showtime to "${matchingScreen.screen_name}" because it is currently deactivated.`
      );
      return;
    }
    // ---------------------------------------------

    const payload = {
      filmId: activeMovieForScreening.id,
      screenId: screeningForm.screenId,
      showDate: screeningForm.showDate,
      startTime: screeningForm.startTime,
      endTime: screeningForm.endTime,
    };
    try {
      const res = await fetch("http://localhost:5000/showtime/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();

      if (res.ok) {
        showNotice(
          "success",
          "Showtime Verified",
          "New programmed screening slot correctly written to memory logs.",
        );
        setIsScreeningModalOpen(false);
        refreshSingleMovieScreenings(activeMovieForScreening.id);
      } else {
        showNotice(
          "error",
          "Schedule Refused",
          resData.message ||
            "Selected slot overlaps or breaks structural screening logic rules.",
        );
      }
    } catch (err) {
      showNotice(
        "error",
        "Server Timeout",
        "Network layer failure during transactional transmission pipeline.",
      );
    }
  };

  const triggerScreeningDelete = (movieId, screeningId) => {
    showNotice(
      "confirm",
      "Cancel Showtime Track",
      "Are you sure you want to drop this individual programming session log?",
      async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/showtime/delete/${screeningId}`,
            { method: "DELETE" },
          );
          const data = await res.json();
          if (res.ok) {
            showNotice(
              "success",
              "Showtime Dropped",
              "The projection session was removed safely.",
            );
            refreshSingleMovieScreenings(movieId);
            if (statsSelectedScreening?.showtime_id === screeningId) {
              setStatsSelectedScreening(null);
            }
          } else {
            showNotice(
              "error",
              "Drop Failure",
              data.message ||
                "Request was bounced by verification ledger engines.",
            );
          }
        } catch (err) {
          showNotice(
            "error",
            "Transaction Fault",
            "Pipeline tracking timed out during deletion query execution.",
          );
        }
      },
    );
  };

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const seatRows = ["A", "B", "C", "D", "E", "F"];
  const seatNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" />
        <span className="text-zinc-500 font-bold tracking-widest text-[10px] uppercase">
          Recompiling Core Data Trees...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-4 text-foreground bg-zinc-950 min-h-screen">
      {/* Alert Overlay Banner Trigger Notification Modal */}
      {notification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm w-full text-center space-y-4 shadow-xl">
            <div className="flex justify-center">
              {notification.type === "error" ? (
                <AlertCircle className="text-red-500 w-10 h-10" />
              ) : (
                <CheckCircle2 className="text-brand-lime w-10 h-10" />
              )}
            </div>
            <h4 className="font-black text-sm uppercase tracking-wide">
              {notification.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {notification.message}
            </p>
            <div className="flex gap-2 justify-center pt-2">
              {notification.onConfirm ? (
                <>
                  <button
                    onClick={closeNotice}
                    className="px-4 py-2 border border-zinc-700 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      notification.onConfirm();
                      closeNotice();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    Confirm Action
                  </button>
                </>
              ) : (
                <button
                  onClick={closeNotice}
                  className="px-6 py-2 bg-brand-lime text-black rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search and Action Row */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            size={14}
          />
          <input
            type="text"
            placeholder="Search catalog by title or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-white"
          />
        </div>
        <button
          onClick={openMovieAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-lime text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shrink-0"
        >
          <Plus size={14} /> Register Film Entry
        </button>
      </div>

      {/* Main Table Presentation View Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                <th className="p-4 pl-6 w-[30%]">Film Metadata & Details</th>
                <th className="p-4 w-[15%]">Genre Track</th>
                <th className="p-4 w-[10%]">Duration</th>
                <th className="p-4 w-[25%]">Active Programmed Screenings</th>
                <th className="p-4 pr-6 text-right w-[20%]">Actions Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs font-medium">
              {filteredMovies.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-muted-foreground/60 italic"
                  >
                    No cinematic records matched your search parameters.
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr
                    key={movie.id}
                    className="hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-9 rounded-md bg-zinc-950 overflow-hidden flex-shrink-0 border border-zinc-800">
                          {movie.posterImage ? (
                            <img
                              src={movie.posterImage}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 bg-zinc-900">
                              <Film size={12} />
                            </div>
                          )}
                        </div>
                        <div className="truncate max-w-[220px]">
                          <span className="font-bold block text-white group-hover:text-brand-lime transition-colors duration-150 truncate">
                            {movie.title}
                          </span>
                          <span className="text-[9px] font-mono text-muted-foreground/50 block mt-0.5 truncate">
                            ID: {movie.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-muted-foreground text-[11px] font-semibold">
                        {movie.genre}
                      </span>
                    </td>

                    <td className="p-4 text-muted-foreground font-mono">
                      <span>{movie.duration} min</span>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1.5 max-w-[280px]">
                        {!movie.screenings || movie.screenings.length === 0 ? (
                          <span className="text-[10px] text-muted-foreground/40 italic block py-0.5">
                            No showtimes live
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {movie.screenings.map((scr) => {
                              const matchedScreen = screens.find(
                                (s) =>
                                  s.screen_id === scr.screen_id ||
                                  s.screen_id === scr.screenId,
                              );
                              const correctScreenName =
                                scr.screen_name ||
                                matchedScreen?.screen_name ||
                                "Screen";

                              return (
                                <div
                                  key={scr.showtime_id}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[10px] font-mono font-bold"
                                >
                                  <span className="text-white">
                                    {scr.start_time.substring(0, 5)}
                                  </span>
                                  <span className="text-muted-foreground/30 text-[8px]">
                                    •
                                  </span>
                                  <span className="text-brand-lime text-[9px] font-semibold truncate max-w-[80px]">
                                    {correctScreenName}
                                  </span>
                                  <button
                                    onClick={() =>
                                      triggerScreeningDelete(
                                        movie.id,
                                        scr.showtime_id,
                                      )
                                    }
                                    className="ml-1 text-muted-foreground/30 hover:text-red-400 transition-colors"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <button
                          onClick={() => openScreeningAdd(movie)}
                          className="text-[10px] text-brand-lime hover:underline font-black uppercase tracking-wider block pt-0.5"
                        >
                          + Program Showtime
                        </button>
                      </div>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openStatsModal(movie)}
                          className="p-2 rounded-lg text-brand-lime bg-brand-lime/[0.06] hover:bg-brand-lime hover:text-black border border-brand-lime/10 transition-all"
                        >
                          <BarChart3 size={13} />
                        </button>
                        <button
                          onClick={() => openMovieEdit(movie)}
                          className="p-2 rounded-lg text-muted-foreground/70 hover:text-white hover:bg-zinc-800 border border-transparent transition-all"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() =>
                            triggerMovieDelete(movie.id, movie.title)
                          }
                          className="p-2 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 border border-transparent transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SIDE METRIC BOARD DRAWER PANEL --- */}
      {isStatsModalOpen && statsMovie && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-zinc-900 border-l border-zinc-800 w-full max-w-2xl h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-start border-b border-zinc-800 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-brand-lime uppercase tracking-widest font-mono block mb-1">
                    Seat Audit Mapping Engine
                  </span>
                  <h2 className="text-lg font-black text-white tracking-tight">
                    {statsMovie.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {statsMovie.genre} • {statsMovie.duration} min
                  </p>
                </div>
                <button
                  onClick={() => setIsStatsModalOpen(false)}
                  className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-muted-foreground hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">
                    Designated Language
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-white font-mono text-sm font-bold">
                    <Languages size={16} className="text-brand-lime" />
                    <span className="uppercase tracking-wider">
                      {statsMovie.language || "English"}
                    </span>
                  </div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">
                    Live Booking Index Metrics
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-white font-mono text-sm font-bold">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span>
                      {statsSelectedScreening
                        ? `${bookedSeats.length} Active Reservations`
                        : "No Selection Triggered"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Screen/Showtime Selection */}
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                  Select Active Screening Session Slot
                </label>
                {!statsScreenings || statsScreenings.length === 0 ? (
                  <div className="p-4 bg-zinc-950 border border-dashed border-zinc-800 rounded-xl text-center text-xs italic text-muted-foreground/60">
                    No active runtime showtimes available to compile analytics.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {statsScreenings.map((scr) => {
                      const isTarget =
                        statsSelectedScreening?.showtime_id === scr.showtime_id;
                      const matchedScreen = screens.find(
                        (s) =>
                          s.screen_id === scr.screen_id ||
                          s.screen_id === scr.screenId,
                      );
                      const displayScreenName =
                        scr.screen_name ||
                        matchedScreen?.screen_name ||
                        "Screen";
                      return (
                        <button
                          key={scr.showtime_id}
                          type="button"
                          onClick={() => setStatsSelectedScreening(scr)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-3 ${
                            isTarget
                              ? "bg-brand-lime border-brand-lime text-black font-black"
                              : "bg-zinc-950 border-zinc-800 text-white hover:border-zinc-600"
                          }`}
                        >
                          <Clock size={13} />
                          <div>
                            <span className="block font-mono leading-none">
                              {scr.start_time.substring(0, 5)} -{" "}
                              {scr.end_time.substring(0, 5)}
                            </span>
                            <span
                              className={`text-[8px] uppercase tracking-tight block mt-0.5 font-bold ${isTarget ? "text-black/60" : "text-muted-foreground"}`}
                            >
                              {displayScreenName} •{" "}
                              {scr.show_date ? scr.show_date.split("T")[0] : ""}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Interactive Multi-Screen Conditional Topology Grid Map */}
              {statsSelectedScreening && (
                <div className="border border-zinc-800 bg-zinc-950/20 rounded-2xl p-5 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Armchair size={14} className="text-brand-lime" /> Screen
                      Matrix Blueprint Map Layout
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-zinc-800 border border-zinc-700 block" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-brand-lime block" />
                        <span>Booked ({bookedSeats.length})</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full max-w-sm mx-auto text-center pt-2">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-brand-lime/40 to-transparent rounded-full" />
                    <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block mt-2">
                      Auditorium Front Screen Vector
                    </span>
                  </div>

                  {loadingSeats ? (
                    <div className="py-12 text-center text-xs text-muted-foreground/60 italic">
                      Scanning transaction logs for allocated seat arrays...
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-w-md mx-auto pt-4">
                      {seatRows.map((row) => (
                        <div key={row} className="flex items-center gap-3">
                          <span className="w-3 text-[10px] font-black font-mono text-muted-foreground/40">
                            {row}
                          </span>
                          <div className="flex-1 grid grid-cols-10 gap-1.5">
                            {seatNumbers.map((num) => {
                              const seatCode = `${row}${num}`;
                              const paddedSeatCode = `${row}0${num}`;
                              const isBooked =
                                bookedSeats.includes(seatCode) ||
                                bookedSeats.includes(paddedSeatCode);

                              return (
                                <div
                                  key={seatCode}
                                  className={`aspect-square rounded-md text-[8px] font-bold font-mono flex items-center justify-center transition-all ${
                                    isBooked
                                      ? "bg-brand-lime text-black font-black"
                                      : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-500"
                                  }`}
                                  title={`Seat Node: ${seatCode} [${isBooked ? "Occupied" : "Vacant Available"}]`}
                                >
                                  {num}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsStatsModalOpen(false)}
                className="px-5 py-2.5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                Close Metrics Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DIALOG MODAL A: REGISTER / EDIT FILM ENTRY --- */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-3xl p-6 shadow-xl relative text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsMovieModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-muted-foreground hover:text-white transition-all"
            >
              <X size={14} />
            </button>
            <h3 className="text-sm font-black tracking-tight mb-4 uppercase">
              {editingMovie
                ? "Edit Catalog Item details"
                : "Register New Cinematic Production"}
            </h3>
            <form
              onSubmit={handleMovieSubmit}
              className="space-y-4 text-xs font-medium"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Film Title
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.title}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, title: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Genre Trace
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Action / Sci-Fi"
                    value={movieForm.genre}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, genre: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Runtime (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={movieForm.duration}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, duration: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Track Language
                  </label>
                  <input
                    type="text"
                    value={movieForm.language}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, language: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Status Track
                  </label>
                  <select
                    value={movieForm.status}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, status: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Released">Released</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Release Target Date
                </label>
                <input
                  type="date"
                  value={movieForm.releaseDate}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, releaseDate: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Poster Image Stream URL
                </label>
                <input
                  type="text"
                  value={movieForm.posterImage}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, posterImage: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Trailer Link
                </label>
                <input
                  type="text"
                  value={movieForm.trailerLink}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, trailerLink: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Production Log Synopsis
                </label>
                <textarea
                  rows={3}
                  value={movieForm.description}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, description: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMovieModalOpen(false)}
                  className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-muted-foreground hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-lime text-black font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
                >
                  Commit Log Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DIALOG MODAL B: SCREENING SLOT GENERATION ENGINE --- */}
      {isScreeningModalOpen && activeMovieForScreening && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-xl relative text-white">
            <button
              onClick={() => setIsScreeningModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-muted-foreground hover:text-white transition-all"
            >
              <X size={14} />
            </button>
            <h3 className="text-sm font-black tracking-tight mb-1 uppercase">
              Program Showtime Matrix
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Adding screening window track metrics for:{" "}
              <span className="font-bold text-white">
                {activeMovieForScreening.title}
              </span>
            </p>
            <form
              onSubmit={handleScreeningSubmit}
              className="space-y-4 text-xs font-medium"
            >
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Target Screen Allocation Unit
                </label>
                <select
                  required
                  value={screeningForm.screenId}
                  onChange={(e) =>
                    setScreeningForm({
                      ...screeningForm,
                      screenId: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                >
                  {screens.map((scr) => (
                    <option key={scr.screen_id} value={scr.screen_id}>
                      {scr.screen_name} ({scr.screen_type} - Cap: {scr.capacity}) 
                      {(scr.status === "deactive" || scr.status === "deactivated") ? " ⚠️ [DEACTIVE]" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Performance Target Date
                </label>
                <input
                  type="date"
                  required
                  value={screeningForm.showDate}
                  onChange={(e) =>
                    setScreeningForm({
                      ...screeningForm,
                      showDate: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={screeningForm.startTime}
                    onChange={(e) =>
                      setScreeningForm({
                        ...screeningForm,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={screeningForm.endTime}
                    onChange={(e) =>
                      setScreeningForm({
                        ...screeningForm,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScreeningModalOpen(false)}
                  className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-muted-foreground hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-lime text-black font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
                >
                  Write Show Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}