// "use client";

// import { useState } from "react";
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
//   DollarSign,
//   Armchair,
//   CheckCircle2,
//   AlertCircle,
//   TrendingUp,
// } from "lucide-react";

// export default function MovieManagement() {
//   // 1. Fully Articulated Mock Data Store with Revenue and Seat Availability Matrix Arrays
//   const [movies, setMovies] = useState([
//     {
//       id: "mov_1",
//       title: "Dune: Part Two",
//       genre: "Sci-Fi / Adventure",
//       duration: "166 min",
//       screenings: [
//         {
//           id: "scr_1",
//           time: "05:15 PM",
//           screen: "Screen 01",
//           format: "IMAX 2D",
//           ticketPrice: 15.0,
//           totalSeats: 40,
//           bookedSeats: ["A1", "A2", "A3", "B1", "B2", "C4", "C5", "D8"],
//           expectedRevenue: 600.0,
//           receivedRevenue: 120.0,
//         },
//         {
//           id: "scr_2",
//           time: "09:30 PM",
//           screen: "Screen 04",
//           format: "IMAX 2D",
//           ticketPrice: 15.0,
//           totalSeats: 40,
//           bookedSeats: [
//             "A1",
//             "A2",
//             "B5",
//             "B6",
//             "C1",
//             "C2",
//             "C3",
//             "D1",
//             "D2",
//             "D3",
//             "D4",
//           ],
//           expectedRevenue: 600.0,
//           receivedRevenue: 165.0,
//         },
//       ],
//     },
//     {
//       id: "mov_2",
//       title: "Everything Everywhere All at Once",
//       genre: "Sci-Fi / Action",
//       duration: "139 min",
//       screenings: [
//         {
//           id: "scr_3",
//           time: "02:00 PM",
//           screen: "Screen 02",
//           format: "Standard 2D",
//           ticketPrice: 12.5,
//           totalSeats: 40,
//           bookedSeats: ["A4", "A5", "B1", "B2", "D5"],
//           expectedRevenue: 500.0,
//           receivedRevenue: 62.5,
//         },
//       ],
//     },
//     {
//       id: "mov_3",
//       title: "Interstellar",
//       genre: "Sci-Fi / Drama",
//       duration: "169 min",
//       screenings: [],
//     },
//   ]);

//   // UI Modal Controls
//   const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
//   const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
//   const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

//   // Active State Target Trays
//   const [editingMovie, setEditingMovie] = useState(null);
//   const [activeMovieForScreening, setActiveMovieForScreening] = useState(null);
//   const [statsMovie, setStatsMovie] = useState(null);
//   const [statsSelectedScreening, setStatsSelectedScreening] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Form Field Trays
//   const [movieForm, setMovieForm] = useState({
//     title: "",
//     genre: "",
//     duration: "",
//   });
//   const [screeningForm, setScreeningForm] = useState({
//     time: "",
//     screen: "Screen 01",
//     format: "Standard 2D",
//     ticketPrice: "15.00",
//   });

//   // --- REVENUE CALCULATION ENGINES ---
//   const calculateLifetimeMovieRevenue = (movie) => {
//     if (!movie.screenings || movie.screenings.length === 0) return 0;
//     return movie.screenings.reduce(
//       (sum, scr) => sum + (scr.receivedRevenue || 0),
//       0,
//     );
//   };

//   // --- DATA INTERMEDIARY OPERATIONS ---
//   const openMovieAdd = () => {
//     setEditingMovie(null);
//     setMovieForm({ title: "", genre: "", duration: "" });
//     setIsMovieModalOpen(true);
//   };

//   const openMovieEdit = (movie) => {
//     setEditingMovie(movie);
//     setMovieForm({
//       title: movie.title,
//       genre: movie.genre,
//       duration: movie.duration,
//     });
//     setIsMovieModalOpen(true);
//   };

//   const openStatsModal = (movie) => {
//     setStatsMovie(movie);
//     // Default select the first available screening context if it exists
//     setStatsSelectedScreening(
//       movie.screenings && movie.screenings.length > 0
//         ? movie.screenings[0]
//         : null,
//     );
//     setIsStatsModalOpen(true);
//   };

//   const handleMovieSubmit = (e) => {
//     e.preventDefault();
//     if (editingMovie) {
//       setMovies((prev) =>
//         prev.map((m) =>
//           m.id === editingMovie.id ? { ...m, ...movieForm } : m,
//         ),
//       );
//     } else {
//       const newMovie = {
//         id: `mov_${Date.now()}`,
//         ...movieForm,
//         screenings: [],
//       };
//       setMovies((prev) => [...prev, newMovie]);
//     }
//     setIsMovieModalOpen(false);
//   };

//   const handleMovieDelete = (movieId) => {
//     if (
//       confirm(
//         "Permanently wipe this feature and clear all schedules from the catalog?",
//       )
//     ) {
//       setMovies((prev) => prev.filter((m) => m.id !== movieId));
//     }
//   };

//   const handleScreeningSubmit = (e) => {
//     e.preventDefault();
//     const price = parseFloat(screeningForm.ticketPrice) || 12.0;
//     const newScreening = {
//       id: `scr_${Date.now()}`,
//       time: screeningForm.time,
//       screen: screeningForm.screen,
//       format: screeningForm.format,
//       ticketPrice: price,
//       totalSeats: 40,
//       bookedSeats: [],
//       expectedRevenue: price * 40,
//       receivedRevenue: 0,
//     };
//     setMovies((prev) =>
//       prev.map((m) => {
//         if (m.id === activeMovieForScreening.id) {
//           return { ...m, screenings: [...m.screenings, newScreening] };
//         }
//         return m;
//       }),
//     );
//     setIsScreeningModalOpen(false);
//   };

//   const handleScreeningDelete = (movieId, screeningId) => {
//     setMovies((prev) =>
//       prev.map((m) => {
//         if (m.id === movieId) {
//           return {
//             ...m,
//             screenings: m.screenings.filter((s) => s.id !== screeningId),
//           };
//         }
//         return m;
//       }),
//     );
//     // Adjust modal view sync if currently tracking active variables
//     if (statsSelectedScreening?.id === screeningId) {
//       setStatsSelectedScreening(null);
//     }
//   };

//   // Row generation parsing array loop
//   const filteredMovies = movies.filter(
//     (movie) =>
//       movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       movie.genre.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   // Generate an abstract 4x10 alphanumeric cinema auditorium layout matrix grid
//   const seatRows = ["A", "B", "C", "D"];
//   const seatNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

//   return (
//     <div className="w-full space-y-4 animate-fadeIn">
//       {/* Control Configuration Filtering Matrix Row */}
//       <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card border border-border rounded-2xl p-4 shadow-xs">
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
//             className="w-full bg-input border border-border text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
//           />
//         </div>
//         <button
//           onClick={openMovieAdd}
//           className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-lime text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0"
//         >
//           <Plus size={14} /> Add New Movie
//         </button>
//       </div>

//       {/* COMPREHENSIVE FULL-PAGE ADMINISTRATION DATA TABLE MATRIX */}
//       <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
//         <div className="w-full overflow-x-auto custom-scrollbar">
//           <table className="w-full border-collapse text-left">
//             <thead>
//               <tr className="border-b border-border bg-input/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
//                 <th className="p-4 pl-6 w-[25%]">Film Metadata & Details</th>
//                 <th className="p-4 w-[15%]">Genre Track</th>
//                 <th className="p-4 w-[12%]">Duration</th>
//                 <th className="p-4 w-[23%]">Active Programmed Screenings</th>
//                 <th className="p-4 w-[13%]">Lifetime Gross</th>
//                 <th className="p-4 pr-6 text-right w-[12%]">Actions Matrix</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border/60 text-xs font-medium text-foreground">
//               {filteredMovies.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="6"
//                     className="p-8 text-center text-muted-foreground/60 italic"
//                   >
//                     No cinematic records matched your search parameters.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredMovies.map((movie) => (
//                   <tr
//                     key={movie.id}
//                     className="hover:bg-foreground/[0.01] transition-colors group"
//                   >
//                     {/* Identity Segment */}
//                     <td className="p-4 pl-6">
//                       <div className="flex items-center gap-3">
//                         <div className="h-8 w-8 rounded-lg bg-brand-lime/[0.08] text-brand-lime flex items-center justify-center shrink-0 border border-brand-lime/10">
//                           <Film size={14} />
//                         </div>
//                         <div>
//                           <span className="font-bold text-foreground block group-hover:text-brand-lime transition-colors duration-150">
//                             {movie.title}
//                           </span>
//                           <span className="text-[9px] font-mono text-muted-foreground/50 block mt-0.5">
//                             {movie.id}
//                           </span>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Genre Array Component */}
//                     <td className="p-4">
//                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-foreground/[0.03] border border-border text-muted-foreground text-[11px] font-semibold">
//                         {movie.genre}
//                       </span>
//                     </td>

//                     {/* Clock Metric Node */}
//                     <td className="p-4 text-muted-foreground font-mono">
//                       <span className="flex items-center gap-1.5">
//                         {movie.duration}
//                       </span>
//                     </td>

//                     {/* Screening Badging Array Fields */}
//                     <td className="p-4">
//                       <div className="space-y-1.5 max-w-[280px]">
//                         {movie.screenings.length === 0 ? (
//                           <span className="text-[10px] text-muted-foreground/40 italic block py-0.5">
//                             No showtimes live
//                           </span>
//                         ) : (
//                           <div className="flex flex-wrap gap-1">
//                             {movie.screenings.map((scr) => (
//                               <div
//                                 key={scr.id}
//                                 className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-input border border-border rounded text-[10px] font-mono font-bold group/badge"
//                               >
//                                 <span className="text-foreground">
//                                   {scr.time}
//                                 </span>
//                                 <span className="text-muted-foreground/30 text-[8px]">
//                                   •
//                                 </span>
//                                 <span className="text-brand-lime text-[9px] font-semibold">
//                                   {scr.screen.split(" ")[1]}
//                                 </span>
//                                 <button
//                                   onClick={() =>
//                                     handleScreeningDelete(movie.id, scr.id)
//                                   }
//                                   className="ml-1 text-muted-foreground/30 hover:text-red-400 transition-colors"
//                                   title="Cancel Showtime"
//                                 >
//                                   <X size={10} />
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                         <button
//                           onClick={() => {
//                             setActiveMovieForScreening(movie);
//                             setScreeningForm({
//                               time: "",
//                               screen: "Screen 01",
//                               format: "Standard 2D",
//                               ticketPrice: "15.00",
//                             });
//                             setIsScreeningModalOpen(true);
//                           }}
//                           className="text-[10px] text-brand-lime hover:underline font-black uppercase tracking-wider block pt-0.5"
//                         >
//                           + Add Showtime
//                         </button>
//                       </div>
//                     </td>

//                     {/* Column 5: Movie Gross Revenue Analytics Layer */}
//                     <td className="p-4 font-mono font-bold">
//                       <span className="text-brand-lime-dark dark:text-brand-lime text-xs">
//                         ${calculateLifetimeMovieRevenue(movie).toFixed(2)}
//                       </span>
//                     </td>

//                     {/* Column 6: Operations Actions Interface Cluster */}
//                     <td className="p-4 pr-6 text-right">
//                       <div className="flex items-center justify-end gap-1">
//                         <button
//                           onClick={() => openStatsModal(movie)}
//                           className="p-2 rounded-lg text-brand-lime bg-brand-lime/[0.06] hover:bg-brand-lime hover:text-black border border-brand-lime/10 transition-all"
//                           title="View High-Density Metrics"
//                         >
//                           <BarChart3 size={13} />
//                         </button>
//                         <button
//                           onClick={() => openMovieEdit(movie)}
//                           className="p-2 rounded-lg text-muted-foreground/70 hover:text-foreground hover:bg-foreground/[0.04] border border-transparent hover:border-border transition-all"
//                           title="Modify Details"
//                         >
//                           <Edit2 size={13} />
//                         </button>
//                         <button
//                           onClick={() => handleMovieDelete(movie.id)}
//                           className="p-2 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 border border-transparent transition-all"
//                           title="Purge Feature"
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

//       {/* --- POPUP PANEL COMPONENT C: METRICS INSIGHTS DASHBOARD SLIDE-OVER --- */}
//       {isStatsModalOpen && statsMovie && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex justify-end animate-fadeIn select-none">
//           <div className="bg-card border-l border-border w-full max-w-2xl h-full p-6 flex flex-col justify-between shadow-2xl text-foreground overflow-y-auto custom-scrollbar animate-slideLeft">
//             <div>
//               {/* Header Context Bar */}
//               <div className="flex justify-between items-start border-b border-border pb-4 mb-6">
//                 <div>
//                   <span className="text-[10px] font-bold text-brand-lime uppercase tracking-widest font-mono block mb-1">
//                     Performance Insight Engine
//                   </span>
//                   <h2 className="text-lg font-black text-foreground tracking-tight">
//                     {statsMovie.title}
//                   </h2>
//                   <p className="text-xs text-muted-foreground mt-0.5">
//                     {statsMovie.genre} • {statsMovie.duration}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setIsStatsModalOpen(false)}
//                   className="p-2 rounded-xl bg-input border border-border text-muted-foreground hover:text-foreground transition-all"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>

//               {/* Master Volume Box Rows */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
//                 <div className="bg-input border border-border/80 p-4 rounded-xl">
//                   <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">
//                     Gross Movie Sales
//                   </span>
//                   <div className="flex items-center gap-1 mt-1 text-brand-lime font-mono text-base font-black">
//                     <DollarSign size={16} />
//                     <span>
//                       {calculateLifetimeMovieRevenue(statsMovie).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="bg-input border border-border/80 p-4 rounded-xl">
//                   <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">
//                     Expected Slot Value
//                   </span>
//                   <div className="flex items-center gap-1 mt-1 text-foreground font-mono text-base font-bold">
//                     <DollarSign
//                       size={16}
//                       className="text-muted-foreground/40"
//                     />
//                     <span>
//                       {statsSelectedScreening
//                         ? statsSelectedScreening.expectedRevenue.toFixed(2)
//                         : "0.00"}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="bg-input border border-border/80 p-4 rounded-xl">
//                   <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">
//                     Realized Revenue
//                   </span>
//                   <div className="flex items-center gap-1 mt-1 text-emerald-400 font-mono text-base font-bold">
//                     <TrendingUp size={16} className="text-emerald-500/40" />
//                     <span>
//                       {statsSelectedScreening
//                         ? statsSelectedScreening.receivedRevenue.toFixed(2)
//                         : "0.00"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Step 2: Session Selection Menu Array */}
//               <div className="space-y-2 mb-6">
//                 <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
//                   Select Active Screening Session Slot
//                 </label>
//                 {statsMovie.screenings.length === 0 ? (
//                   <div className="p-4 bg-input border border-dashed border-border rounded-xl text-center text-xs italic text-muted-foreground/60">
//                     No active runtime showtimes available to compile analytics.
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {statsMovie.screenings.map((scr) => {
//                       const isTarget = statsSelectedScreening?.id === scr.id;
//                       return (
//                         <button
//                           key={scr.id}
//                           onClick={() => setStatsSelectedScreening(scr)}
//                           className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-3 ${
//                             isTarget
//                               ? "bg-brand-lime border-brand-lime text-black font-black shadow-xs shadow-brand-lime/10"
//                               : "bg-input border-border text-foreground hover:border-muted-foreground/40"
//                           }`}
//                         >
//                           <Clock size={13} />
//                           <div>
//                             <span className="block font-mono leading-none">
//                               {scr.time}
//                             </span>
//                             <span
//                               className={`text-[8px] uppercase tracking-tight block mt-0.5 font-bold ${isTarget ? "text-black/60" : "text-muted-foreground"}`}
//                             >
//                               {scr.screen} • {scr.format}
//                             </span>
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Step 3: Interactive Auditorium Grid Topology Map Frame */}
//               {statsSelectedScreening && (
//                 <div className="border border-border bg-input/20 rounded-2xl p-5 space-y-6">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
//                     <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
//                       <Armchair size={14} className="text-brand-lime" />{" "}
//                       Auditorium Seat Allocation Mapping Layout
//                     </h4>

//                     {/* Color Map Coding Index Headers */}
//                     <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground font-mono">
//                       <div className="flex items-center gap-1.5">
//                         <span className="w-2.5 h-2.5 rounded-xs bg-foreground/[0.06] border border-border block" />
//                         <span>
//                           Available (
//                           {statsSelectedScreening.totalSeats -
//                             statsSelectedScreening.bookedSeats.length}
//                           )
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1.5">
//                         <span className="w-2.5 h-2.5 rounded-xs bg-brand-lime border border-brand-lime block" />
//                         <span>
//                           Booked ({statsSelectedScreening.bookedSeats.length})
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Curved Silver Screen Architecture Design Element */}
//                   <div className="relative w-full max-w-sm mx-auto text-center pt-2">
//                     <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-brand-lime/40 to-transparent rounded-full blur-xs" />
//                     <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mt-0.5" />
//                     <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block mt-2">
//                       Auditorium Front Screen Vector
//                     </span>
//                   </div>

//                   {/* Alphanumeric Layout Execution Loop */}
//                   <div className="flex flex-col gap-2 max-w-md mx-auto pt-4">
//                     {seatRows.map((row) => (
//                       <div key={row} className="flex items-center gap-3">
//                         {/* Row Tracking ID Letter label nodes */}
//                         <span className="w-3 text-[10px] font-black font-mono text-muted-foreground/40">
//                           {row}
//                         </span>

//                         <div className="flex-1 grid grid-cols-10 gap-1.5">
//                           {seatNumbers.map((num) => {
//                             const seatCode = `${row}${num}`;
//                             const isBooked =
//                               statsSelectedScreening.bookedSeats.includes(
//                                 seatCode,
//                               );
//                             return (
//                               <div
//                                 key={seatCode}
//                                 className={`aspect-square rounded-md text-[8px] font-bold font-mono flex items-center justify-center transition-all ${
//                                   isBooked
//                                     ? "bg-brand-lime text-black border border-brand-lime shadow-xs font-black scale-95"
//                                     : "bg-foreground/[0.04] border border-border/80 text-muted-foreground/60 hover:border-muted-foreground/30"
//                                 }`}
//                                 title={`Seat Node ID: ${seatCode} [${isBooked ? "Occupied Booking Logged" : "Vacant Available"}]`}
//                               >
//                                 {num}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Panel Close Actions Footer Frame */}
//             <div className="mt-8 pt-4 border-t border-border flex justify-end">
//               <button
//                 onClick={() => setIsStatsModalOpen(false)}
//                 className="px-5 py-2.5 bg-foreground text-background font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all"
//               >
//                 Close Metrics Board
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- DIALOG MODAL A: COMPONENT FILM PROFILE (ADD / EDIT) --- */}
//       {isMovieModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
//             <div className="flex justify-between items-center mb-5">
//               <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
//                 <Film size={16} className="text-brand-lime" />{" "}
//                 {editingMovie
//                   ? "Modify Existing Movie"
//                   : "Register Catalog Profile"}
//               </h3>
//               <button
//                 onClick={() => setIsMovieModalOpen(false)}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <form onSubmit={handleMovieSubmit} className="space-y-4">
//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                   Film Title
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={movieForm.title}
//                   onChange={(e) =>
//                     setMovieForm({ ...movieForm, title: e.target.value })
//                   }
//                   placeholder="e.g., Blade Runner 2049"
//                   className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-semibold"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                     Genre Array
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={movieForm.genre}
//                     onChange={(e) =>
//                       setMovieForm({ ...movieForm, genre: e.target.value })
//                     }
//                     placeholder="Sci-Fi / Cyberpunk"
//                     className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-medium"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                     Runtime
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={movieForm.duration}
//                     onChange={(e) =>
//                       setMovieForm({ ...movieForm, duration: e.target.value })
//                     }
//                     placeholder="152 min"
//                     className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-medium"
//                   />
//                 </div>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full mt-2 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:opacity-90 shadow-sm"
//               >
//                 {editingMovie ? "Save Updates" : "Commit New Feature Track"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- DIALOG MODAL B: SHOWTIME SLOT SCHEDULER --- */}
//       {isScreeningModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
//             <div className="flex justify-between items-center mb-5">
//               <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
//                 <Clock size={16} className="text-brand-lime" /> Program
//                 Screening Slot
//               </h3>
//               <button
//                 onClick={() => setIsScreeningModalOpen(false)}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <form onSubmit={handleScreeningSubmit} className="space-y-4">
//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                   Clock Time Slot
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={screeningForm.time}
//                   onChange={(e) =>
//                     setScreeningForm({ ...screeningForm, time: e.target.value })
//                   }
//                   placeholder="e.g., 07:15 PM"
//                   className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-mono"
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-2">
//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                     Base Price ($)
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     required
//                     value={screeningForm.ticketPrice}
//                     onChange={(e) =>
//                       setScreeningForm({
//                         ...screeningForm,
//                         ticketPrice: e.target.value,
//                       })
//                     }
//                     placeholder="15.00"
//                     className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-mono"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                     Projection
//                   </label>
//                   <select
//                     value={screeningForm.format}
//                     onChange={(e) =>
//                       setScreeningForm({
//                         ...screeningForm,
//                         format: e.target.value,
//                       })
//                     }
//                     className="w-full bg-input border border-border text-xs rounded-xl px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
//                   >
//                     <option value="Standard 2D">2D</option>
//                     <option value="IMAX 2D">IMAX</option>
//                     <option value="VIP Recliner 3D">3D VIP</option>
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                   Theater Allocation Target
//                 </label>
//                 <select
//                   value={screeningForm.screen}
//                   onChange={(e) =>
//                     setScreeningForm({
//                       ...screeningForm,
//                       screen: e.target.value,
//                     })
//                   }
//                   className="w-full bg-input border border-border text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
//                 >
//                   <option value="Screen 01">Screen 01 (40 Seats)</option>
//                   <option value="Screen 02">Screen 02 (40 Seats)</option>
//                   <option value="Screen 03">Screen 03 (40 Seats)</option>
//                   <option value="Screen 04">Screen 04 (40 Seats)</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full mt-2 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:opacity-90 shadow-sm"
//               >
//                 Deploy Showtime Track
//               </button>
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
      fetchBookedSeats(statsMovie.id, statsSelectedScreening.showtime_id);
    } else {
      setBookedSeats([]);
    }
  }, [statsMovie, statsSelectedScreening]);

  const fetchBookedSeats = async (filmId, showtimeId) => {
    setLoadingSeats(true);
    try {
      const res = await fetch(
        `http://localhost:5000/book-seat/${filmId}/${showtimeId}`,
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
    <div className="w-full space-y-4 animate-fadeIn text-foreground">
      {/* Search and Action Row */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card border border-border rounded-2xl p-4 shadow-xs">
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
            className="w-full bg-input border border-border text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
          />
        </div>
        <button
          onClick={openMovieAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-lime text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0"
        >
          <Plus size={14} /> Register Film Entry
        </button>
      </div>

      {/* Main Catalog View Presentation */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-input/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                <th className="p-4 pl-6 w-[30%]">Film Metadata & Details</th>
                <th className="p-4 w-[15%]">Genre Track</th>
                <th className="p-4 w-[10%]">Duration</th>
                <th className="p-4 w-[25%]">Active Programmed Screenings</th>
                <th className="p-4 pr-6 text-right w-[20%]">Actions Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs font-medium text-foreground">
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
                    className="hover:bg-foreground/[0.01] transition-colors group"
                  >
                    {/* Identity Column */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-9 rounded-md bg-input overflow-hidden flex-shrink-0 border border-border">
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
                          <span className="font-bold text-foreground block group-hover:text-brand-lime transition-colors duration-150 truncate">
                            {movie.title}
                          </span>
                          <span className="text-[9px] font-mono text-muted-foreground/50 block mt-0.5 truncate">
                            ID: {movie.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Genre Track Column */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-foreground/[0.03] border border-border text-muted-foreground text-[11px] font-semibold">
                        {movie.genre}
                      </span>
                    </td>

                    {/* Clock Metric Node */}
                    <td className="p-4 text-muted-foreground font-mono">
                      <span>{movie.duration} min</span>
                    </td>

                    {/* Screening Badging Fields */}
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
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-input border border-border rounded text-[10px] font-mono font-bold group/badge"
                                >
                                  <span className="text-foreground">
                                    {scr.start_time.substring(0, 5)}
                                  </span>
                                  <span className="text-muted-foreground/30 text-[8px]">
                                    •
                                  </span>
                                  <span
                                    className="text-brand-lime text-[9px] font-semibold truncate max-w-[80px]"
                                    title={correctScreenName}
                                  >
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
                                    title="Cancel Showtime"
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
                          className="text-[10px] text-brand-lime hover:underline font-black uppercase tracking-wider block pt-0.5 text-left"
                        >
                          + Add Showtime
                        </button>
                      </div>
                    </td>

                    {/* Actions Panel Column */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openStatsModal(movie)}
                          className="p-2 rounded-lg text-brand-lime bg-brand-lime/[0.06] hover:bg-brand-lime hover:text-black border border-brand-lime/10 transition-all"
                          title="View High-Density Audit Mapping"
                        >
                          <BarChart3 size={13} />
                        </button>
                        <button
                          onClick={() => openMovieEdit(movie)}
                          className="p-2 rounded-lg text-muted-foreground/70 hover:text-foreground hover:bg-foreground/[0.04] border border-transparent hover:border-border transition-all"
                          title="Modify Details"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() =>
                            triggerMovieDelete(movie.id, movie.title)
                          }
                          className="p-2 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 border border-transparent transition-all"
                          title="Purge Feature"
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

      {/* --- SIDE DRAWER: HIGH EXPANSION DENSITY AUDIT METRICS --- */}
      {isStatsModalOpen && statsMovie && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex justify-end animate-fadeIn select-none">
          <div className="bg-card border-l border-border w-full max-w-2xl h-full p-6 flex flex-col justify-between shadow-2xl text-foreground overflow-y-auto custom-scrollbar animate-slideLeft">
            <div>
              {/* Header Context Bar */}
              <div className="flex justify-between items-start border-b border-border pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-brand-lime uppercase tracking-widest font-mono block mb-1">
                    Seat Audit Mapping Engine
                  </span>
                  <h2 className="text-lg font-black text-foreground tracking-tight">
                    {statsMovie.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {statsMovie.genre} • {statsMovie.duration} min
                  </p>
                </div>
                <button
                  onClick={() => setIsStatsModalOpen(false)}
                  className="p-2 rounded-xl bg-input border border-border text-muted-foreground hover:text-foreground transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Volume Status Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="bg-input border border-border/80 p-4 rounded-xl">
                  <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">
                    Designated Language
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-foreground font-mono text-base font-bold">
                    <Languages size={16} className="text-brand-lime" />
                    <span className="text-sm uppercase tracking-wider">
                      {statsMovie.language || "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="bg-input border border-border/80 p-4 rounded-xl">
                  <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">
                    Live Booking Index Metrics
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-emerald-400 font-mono text-base font-bold">
                    <TrendingUp size={16} className="text-emerald-500/40" />
                    <span className="text-sm text-foreground">
                      {statsSelectedScreening
                        ? `${bookedSeats.length} Active Reservations`
                        : "No Selection Triggered"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Session Selection Menu Array */}
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                  Select Active Screening Session Slot
                </label>
                {!statsScreenings || statsScreenings.length === 0 ? (
                  <div className="p-4 bg-input border border-dashed border-border rounded-xl text-center text-xs italic text-muted-foreground/60">
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
                          onClick={() => setStatsSelectedScreening(scr)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-3 ${
                            isTarget
                              ? "bg-brand-lime border-brand-lime text-black font-black shadow-xs shadow-brand-lime/10"
                              : "bg-input border-border text-foreground hover:border-muted-foreground/40"
                          }`}
                        >
                          <Clock size={13} />
                          <div>
                            <span className="block font-mono leading-none">
                              {scr.start_time.substring(0, 5)} -{" "}
                              {scr.end_time.substring(0, 5)}
                            </span>
                            <span
                              className={`text-[8px] uppercase tracking-tight block mt-0.5 font-bold ${
                                isTarget
                                  ? "text-black/60"
                                  : "text-muted-foreground"
                              }`}
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

              {/* Interactive Auditorium Grid Topology Map Frame */}
              {statsSelectedScreening && (
                <div className="border border-border bg-input/20 rounded-2xl p-5 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Armchair size={14} className="text-brand-lime" /> Layout
                      Mapping Layout
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-foreground/[0.06] border border-border block" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-brand-lime border border-brand-lime block" />
                        <span>Booked ({bookedSeats.length})</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full max-w-sm mx-auto text-center pt-2">
                    <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-brand-lime/40 to-transparent rounded-full blur-xs" />
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mt-0.5" />
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
                              // Support both unpadded ("C1") and zero-padded ("C01") representations from backend
                              const paddedSeatCode = `${row}0${num}`;
                              const isBooked =
                                bookedSeats.includes(seatCode) ||
                                bookedSeats.includes(paddedSeatCode);

                              return (
                                <div
                                  key={seatCode}
                                  className={`aspect-square rounded-md text-[8px] font-bold font-mono flex items-center justify-center transition-all ${
                                    isBooked
                                      ? "bg-brand-lime text-black border border-brand-lime shadow-xs font-black scale-95"
                                      : "bg-foreground/[0.04] border border-border/80 text-muted-foreground/60 hover:border-muted-foreground/30"
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

            <div className="mt-8 pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="px-5 py-2.5 bg-foreground text-background font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all"
              >
                Close Metrics Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DIALOG MODAL A: COMPONENT FILM PROFILE CREATE / EDIT OVERLAY --- */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-xl rounded-3xl p-6 shadow-xl relative text-foreground max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsMovieModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-input border border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <X size={14} />
            </button>
            <h3 className="text-base font-black tracking-tight mb-4">
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
                    className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
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
                    className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
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
                    className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
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
                    className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
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
                    className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
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
                  className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
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
                  className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
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
                  className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
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
                  className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMovieModalOpen(false)}
                  className="px-4 py-2 bg-input border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors"
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

      {/* --- DIALOG MODAL B: SCREENING SLOT GENERATION ENGINE OVERLAY --- */}
      {isScreeningModalOpen && activeMovieForScreening && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-xl relative text-foreground">
            <button
              onClick={() => setIsScreeningModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-input border border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <X size={14} />
            </button>
            <h3 className="text-base font-black tracking-tight mb-1">
              Program Showtime Matrix
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Adding screening window track metrics for:{" "}
              <span className="font-bold text-foreground">
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
                  className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
                >
                  {screens.map((scr) => (
                    <option key={scr.screen_id} value={scr.screen_id}>
                      {scr.screen_name} ({scr.screen_type} - Cap: {scr.capacity}
                      )
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
                  className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Start Window Time
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
                    className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">
                    Est. Clear Time
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
                    className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScreeningModalOpen(false)}
                  className="px-4 py-2 bg-input border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-lime text-black font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
                >
                  Publish Session Window
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CUSTOM POPUP NOTIFICATION MODAL WRAPPER LAYER --- */}
      {notification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
          <div className="bg-card border border-border w-full max-w-sm rounded-2xl p-5 shadow-2xl text-foreground">
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`p-2 rounded-xl ${
                  notification.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : notification.type === "error"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black tracking-tight">
                  {notification.title}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                  {notification.message}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              {notification.type === "confirm" ? (
                <>
                  <button
                    onClick={() => {
                      if (notification.onConfirm) notification.onConfirm();
                      closeNotice();
                    }}
                    className="flex-1 py-2 bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Confirm Drop
                  </button>
                  <button
                    onClick={closeNotice}
                    className="flex-1 py-2 bg-input border border-border text-muted-foreground font-bold text-xs uppercase tracking-wider rounded-xl hover:text-foreground transition-colors"
                  >
                    Abort
                  </button>
                </>
              ) : (
                <button
                  onClick={closeNotice}
                  className="w-full py-2 bg-foreground text-background font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all"
                >
                  Dismiss Context Alert
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}