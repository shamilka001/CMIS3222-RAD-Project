// "use client"

// import { useState } from "react"
// import {
//   Film, Calendar, Plus, Edit2, Trash2, X,
//   Clock, Tag, Search, BarChart3, DollarSign,
//   Armchair, CheckCircle2, AlertCircle, TrendingUp
// } from "lucide-react"

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
//           id: "scr_1", time: "05:15 PM", screen: "Screen 01", format: "IMAX 2D",
//           ticketPrice: 15.00, totalSeats: 40,
//           bookedSeats: ["A1", "A2", "A3", "B1", "B2", "C4", "C5", "D8"],
//           expectedRevenue: 600.00, receivedRevenue: 120.00
//         },
//         {
//           id: "scr_2", time: "09:30 PM", screen: "Screen 04", format: "IMAX 2D",
//           ticketPrice: 15.00, totalSeats: 40,
//           bookedSeats: ["A1", "A2", "B5", "B6", "C1", "C2", "C3", "D1", "D2", "D3", "D4"],
//           expectedRevenue: 600.00, receivedRevenue: 165.00
//         }
//       ]
//     },
//     {
//       id: "mov_2",
//       title: "Everything Everywhere All at Once",
//       genre: "Sci-Fi / Action",
//       duration: "139 min",
//       screenings: [
//         {
//           id: "scr_3", time: "02:00 PM", screen: "Screen 02", format: "Standard 2D",
//           ticketPrice: 12.50, totalSeats: 40,
//           bookedSeats: ["A4", "A5", "B1", "B2", "D5"],
//           expectedRevenue: 500.00, receivedRevenue: 62.50
//         }
//       ]
//     },
//     {
//       id: "mov_3",
//       title: "Interstellar",
//       genre: "Sci-Fi / Drama",
//       duration: "169 min",
//       screenings: []
//     }
//   ])

//   // UI Modal Controls
//   const [isMovieModalOpen, setIsMovieModalOpen] = useState(false)
//   const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false)
//   const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)

//   // Active State Target Trays
//   const [editingMovie, setEditingMovie] = useState(null)
//   const [activeMovieForScreening, setActiveMovieForScreening] = useState(null)
//   const [statsMovie, setStatsMovie] = useState(null)
//   const [statsSelectedScreening, setStatsSelectedScreening] = useState(null)
//   const [searchQuery, setSearchQuery] = useState("")

//   // Form Field Trays
//   const [movieForm, setMovieForm] = useState({ title: "", genre: "", duration: "" })
//   const [screeningForm, setScreeningForm] = useState({ time: "", screen: "Screen 01", format: "Standard 2D", ticketPrice: "15.00" })

//   // --- REVENUE CALCULATION ENGINES ---
//   const calculateLifetimeMovieRevenue = (movie) => {
//     if (!movie.screenings || movie.screenings.length === 0) return 0
//     return movie.screenings.reduce((sum, scr) => sum + (scr.receivedRevenue || 0), 0)
//   }

//   // --- DATA INTERMEDIARY OPERATIONS ---
//   const openMovieAdd = () => {
//     setEditingMovie(null)
//     setMovieForm({ title: "", genre: "", duration: "" })
//     setIsMovieModalOpen(true)
//   }

//   const openMovieEdit = (movie) => {
//     setEditingMovie(movie)
//     setMovieForm({ title: movie.title, genre: movie.genre, duration: movie.duration })
//     setIsMovieModalOpen(true)
//   }

//   const openStatsModal = (movie) => {
//     setStatsMovie(movie)
//     // Default select the first available screening context if it exists
//     setStatsSelectedScreening(movie.screenings && movie.screenings.length > 0 ? movie.screenings[0] : null)
//     setIsStatsModalOpen(true)
//   }

//   const handleMovieSubmit = (e) => {
//     e.preventDefault()
//     if (editingMovie) {
//       setMovies(prev => prev.map(m => m.id === editingMovie.id ? { ...m, ...movieForm } : m))
//     } else {
//       const newMovie = { id: `mov_${Date.now()}`, ...movieForm, screenings: [] }
//       setMovies(prev => [...prev, newMovie])
//     }
//     setIsMovieModalOpen(false)
//   }

//   const handleMovieDelete = (movieId) => {
//     if (confirm("Permanently wipe this feature and clear all schedules from the catalog?")) {
//       setMovies(prev => prev.filter(m => m.id !== movieId))
//     }
//   }

//   const handleScreeningSubmit = (e) => {
//     e.preventDefault()
//     const price = parseFloat(screeningForm.ticketPrice) || 12.00
//     const newScreening = {
//       id: `scr_${Date.now()}`,
//       time: screeningForm.time,
//       screen: screeningForm.screen,
//       format: screeningForm.format,
//       ticketPrice: price,
//       totalSeats: 40,
//       bookedSeats: [],
//       expectedRevenue: price * 40,
//       receivedRevenue: 0
//     }
//     setMovies(prev => prev.map(m => {
//       if (m.id === activeMovieForScreening.id) {
//         return { ...m, screenings: [...m.screenings, newScreening] }
//       }
//       return m
//     }))
//     setIsScreeningModalOpen(false)
//   }

//   const handleScreeningDelete = (movieId, screeningId) => {
//     setMovies(prev => prev.map(m => {
//       if (m.id === movieId) {
//         return { ...m, screenings: m.screenings.filter(s => s.id !== screeningId) }
//       }
//       return m
//     }))
//     // Adjust modal view sync if currently tracking active variables
//     if (statsSelectedScreening?.id === screeningId) {
//       setStatsSelectedScreening(null)
//     }
//   }

//   // Row generation parsing array loop
//   const filteredMovies = movies.filter(movie =>
//     movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   // Generate an abstract 4x10 alphanumeric cinema auditorium layout matrix grid
//   const seatRows = ["A", "B", "C", "D"]
//   const seatNumbers = Array.from({ length: 10 }, (_, i) => i + 1)

//   return (
//     <div className="w-full space-y-4 animate-fadeIn">

//       {/* Control Configuration Filtering Matrix Row */}
//       <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card border border-border rounded-2xl p-4 shadow-xs">
//         <div className="relative w-full sm:w-80">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={14} />
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
//                   <td colSpan="6" className="p-8 text-center text-muted-foreground/60 italic">
//                     No cinematic records matched your search parameters.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredMovies.map((movie) => (
//                   <tr key={movie.id} className="hover:bg-foreground/[0.01] transition-colors group">

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
//                           <span className="text-[9px] font-mono text-muted-foreground/50 block mt-0.5">{movie.id}</span>
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
//                       <span className="flex items-center gap-1.5">{movie.duration}</span>
//                     </td>

//                     {/* Screening Badging Array Fields */}
//                     <td className="p-4">
//                       <div className="space-y-1.5 max-w-[280px]">
//                         {movie.screenings.length === 0 ? (
//                           <span className="text-[10px] text-muted-foreground/40 italic block py-0.5">No showtimes live</span>
//                         ) : (
//                           <div className="flex flex-wrap gap-1">
//                             {movie.screenings.map((scr) => (
//                               <div
//                                 key={scr.id}
//                                 className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-input border border-border rounded text-[10px] font-mono font-bold group/badge"
//                               >
//                                 <span className="text-foreground">{scr.time}</span>
//                                 <span className="text-muted-foreground/30 text-[8px]">•</span>
//                                 <span className="text-brand-lime text-[9px] font-semibold">{scr.screen.split(' ')[1]}</span>
//                                 <button
//                                   onClick={() => handleScreeningDelete(movie.id, scr.id)}
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
//                           onClick={() => { setActiveMovieForScreening(movie); setScreeningForm({time:"", screen:"Screen 01", format:"Standard 2D", ticketPrice:"15.00"}); setIsScreeningModalOpen(true); }}
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
//                   <span className="text-[10px] font-bold text-brand-lime uppercase tracking-widest font-mono block mb-1">Performance Insight Engine</span>
//                   <h2 className="text-lg font-black text-foreground tracking-tight">{statsMovie.title}</h2>
//                   <p className="text-xs text-muted-foreground mt-0.5">{statsMovie.genre} • {statsMovie.duration}</p>
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
//                   <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">Gross Movie Sales</span>
//                   <div className="flex items-center gap-1 mt-1 text-brand-lime font-mono text-base font-black">
//                     <DollarSign size={16} />
//                     <span>{calculateLifetimeMovieRevenue(statsMovie).toFixed(2)}</span>
//                   </div>
//                 </div>
//                 <div className="bg-input border border-border/80 p-4 rounded-xl">
//                   <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">Expected Slot Value</span>
//                   <div className="flex items-center gap-1 mt-1 text-foreground font-mono text-base font-bold">
//                     <DollarSign size={16} className="text-muted-foreground/40" />
//                     <span>{statsSelectedScreening ? statsSelectedScreening.expectedRevenue.toFixed(2) : "0.00"}</span>
//                   </div>
//                 </div>
//                 <div className="bg-input border border-border/80 p-4 rounded-xl">
//                   <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wide">Realized Revenue</span>
//                   <div className="flex items-center gap-1 mt-1 text-emerald-400 font-mono text-base font-bold">
//                     <TrendingUp size={16} className="text-emerald-500/40" />
//                     <span>{statsSelectedScreening ? statsSelectedScreening.receivedRevenue.toFixed(2) : "0.00"}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Step 2: Session Selection Menu Array */}
//               <div className="space-y-2 mb-6">
//                 <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Select Active Screening Session Slot</label>
//                 {statsMovie.screenings.length === 0 ? (
//                   <div className="p-4 bg-input border border-dashed border-border rounded-xl text-center text-xs italic text-muted-foreground/60">
//                     No active runtime showtimes available to compile analytics.
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {statsMovie.screenings.map((scr) => {
//                       const isTarget = statsSelectedScreening?.id === scr.id
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
//                             <span className="block font-mono leading-none">{scr.time}</span>
//                             <span className={`text-[8px] uppercase tracking-tight block mt-0.5 font-bold ${isTarget ? "text-black/60" : "text-muted-foreground"}`}>
//                               {scr.screen} • {scr.format}
//                             </span>
//                           </div>
//                         </button>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Step 3: Interactive Auditorium Grid Topology Map Frame */}
//               {statsSelectedScreening && (
//                 <div className="border border-border bg-input/20 rounded-2xl p-5 space-y-6">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
//                     <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
//                       <Armchair size={14} className="text-brand-lime" /> Auditorium Seat Allocation Mapping Layout
//                     </h4>

//                     {/* Color Map Coding Index Headers */}
//                     <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground font-mono">
//                       <div className="flex items-center gap-1.5">
//                         <span className="w-2.5 h-2.5 rounded-xs bg-foreground/[0.06] border border-border block" />
//                         <span>Available ({statsSelectedScreening.totalSeats - statsSelectedScreening.bookedSeats.length})</span>
//                       </div>
//                       <div className="flex items-center gap-1.5">
//                         <span className="w-2.5 h-2.5 rounded-xs bg-brand-lime border border-brand-lime block" />
//                         <span>Booked ({statsSelectedScreening.bookedSeats.length})</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Curved Silver Screen Architecture Design Element */}
//                   <div className="relative w-full max-w-sm mx-auto text-center pt-2">
//                     <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-brand-lime/40 to-transparent rounded-full blur-xs" />
//                     <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mt-0.5" />
//                     <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block mt-2">Auditorium Front Screen Vector</span>
//                   </div>

//                   {/* Alphanumeric Layout Execution Loop */}
//                   <div className="flex flex-col gap-2 max-w-md mx-auto pt-4">
//                     {seatRows.map((row) => (
//                       <div key={row} className="flex items-center gap-3">
//                         {/* Row Tracking ID Letter label nodes */}
//                         <span className="w-3 text-[10px] font-black font-mono text-muted-foreground/40">{row}</span>

//                         <div className="flex-1 grid grid-cols-10 gap-1.5">
//                           {seatNumbers.map((num) => {
//                             const seatCode = `${row}${num}`
//                             const isBooked = statsSelectedScreening.bookedSeats.includes(seatCode)
//                             return (
//                               <div
//                                 key={seatCode}
//                                 className={`aspect-square rounded-md text-[8px] font-bold font-mono flex items-center justify-center transition-all ${
//                                   isBooked
//                                     ? "bg-brand-lime text-black border border-brand-lime shadow-xs font-black scale-95"
//                                     : "bg-foreground/[0.04] border border-border/80 text-muted-foreground/60 hover:border-muted-foreground/30"
//                                 }`}
//                                 title={`Seat Node ID: ${seatCode} [${isBooked ? 'Occupied Booking Logged' : 'Vacant Available'}]`}
//                               >
//                                 {num}
//                               </div>
//                             )
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
//                 <Film size={16} className="text-brand-lime" /> {editingMovie ? "Modify Existing Movie" : "Register Catalog Profile"}
//               </h3>
//               <button onClick={() => setIsMovieModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
//             </div>

//             <form onSubmit={handleMovieSubmit} className="space-y-4">
//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Film Title</label>
//                 <input
//                   type="text" required
//                   value={movieForm.title} onChange={e => setMovieForm({...movieForm, title: e.target.value})}
//                   placeholder="e.g., Blade Runner 2049"
//                   className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-semibold"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Genre Array</label>
//                   <input
//                     type="text" required
//                     value={movieForm.genre} onChange={e => setMovieForm({...movieForm, genre: e.target.value})}
//                     placeholder="Sci-Fi / Cyberpunk"
//                     className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-medium"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Runtime</label>
//                   <input
//                     type="text" required
//                     value={movieForm.duration} onChange={e => setMovieForm({...movieForm, duration: e.target.value})}
//                     placeholder="152 min"
//                     className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-medium"
//                   />
//                 </div>
//               </div>
//               <button type="submit" className="w-full mt-2 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:opacity-90 shadow-sm">
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
//                 <Clock size={16} className="text-brand-lime" /> Program Screening Slot
//               </h3>
//               <button onClick={() => setIsScreeningModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
//             </div>
//             <form onSubmit={handleScreeningSubmit} className="space-y-4">
//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Clock Time Slot</label>
//                 <input
//                   type="text" required
//                   value={screeningForm.time} onChange={e => setScreeningForm({...screeningForm, time: e.target.value})}
//                   placeholder="e.g., 07:15 PM"
//                   className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-mono"
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-2">
//                 <div className="col-span-2">
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Base Price ($)</label>
//                   <input
//                     type="number" step="0.01" required
//                     value={screeningForm.ticketPrice} onChange={e => setScreeningForm({...screeningForm, ticketPrice: e.target.value})}
//                     placeholder="15.00"
//                     className="w-full bg-input border border-border text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-mono"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Projection</label>
//                   <select
//                     value={screeningForm.format} onChange={e => setScreeningForm({...screeningForm, format: e.target.value})}
//                     className="w-full bg-input border border-border text-xs rounded-xl px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
//                   >
//                     <option value="Standard 2D">2D</option>
//                     <option value="IMAX 2D">IMAX</option>
//                     <option value="VIP Recliner 3D">3D VIP</option>
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Theater Allocation Target</label>
//                 <select
//                   value={screeningForm.screen} onChange={e => setScreeningForm({...screeningForm, screen: e.target.value})}
//                   className="w-full bg-input border border-border text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
//                 >
//                   <option value="Screen 01">Screen 01 (40 Seats)</option>
//                   <option value="Screen 02">Screen 02 (40 Seats)</option>
//                   <option value="Screen 03">Screen 03 (40 Seats)</option>
//                   <option value="Screen 04">Screen 04 (40 Seats)</option>
//                 </select>
//               </div>
//               <button type="submit" className="w-full mt-2 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:opacity-90 shadow-sm">
//                 Deploy Showtime Track
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import {
  Film,
  Clock,
  Plus,
  X,
  Edit2,
  Trash2,
  BarChart3,
  Calendar,
  Armchair,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function FilmDashboard() {
  // Main Data States
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sub-selection for Showtimes & Seat Matrices
  const [activeScreenings, setActiveScreenings] = useState([]);
  const [selectedMovieForShowtimes, setSelectedMovieForShowtimes] =
    useState(null);
  const [statsMovie, setStatsMovie] = useState(null);
  const [statsSelectedScreening, setStatsSelectedScreening] = useState(null);
  const [bookedSeatsMatrix, setBookedSeatsMatrix] = useState([]);
  const [staticSeatsLayout, setStaticSeatsLayout] = useState([]);

  // Modal Control Flags
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editingScreening, setEditingScreening] = useState(null);

  // Forms Management
  const [movieForm, setMovieForm] = useState({
    film_name: "",
    genre: "",
    trailer_link: "",
    description: "",
    release_date: "",
    language: "English",
    duration: 120,
    poster_image: "",
    status: "NOW_SHOWING",
  });

  const [screeningForm, setScreeningForm] = useState({
    showDate: "",
    startTime: "",
    endTime: "",
  });

  // Fixed Default Configurations
  const STATIC_SCREEN_ID = "SCREEN21580";
  const SEAT_ROWS = ["A", "B", "C", "D"];
  const SEAT_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);

  // --- HOOKS & HYDRATION EFFECTS ---
  useEffect(() => {
    fetchAllFilms();
    fetchStaticSeats();
  }, []);

  // Sync details when an active screening slot changes inside metrics drawer
  useEffect(() => {
    if (statsMovie && statsSelectedScreening) {
      fetchBookedSeatsForShowtime(
        statsMovie.film_id,
        statsSelectedScreening.showtime_id,
      );
    } else {
      setBookedSeatsMatrix([]);
    }
  }, [statsSelectedScreening, statsMovie]);

  const fetchAllFilms = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/film/get-all-film");
      if (!res.ok) throw new Error("Failed to capture film catalog.");
      const payload = await res.json();
      setMovies(payload.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Catalog error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaticSeats = async () => {
    try {
      const res = await fetch("http://localhost:5000/seat");
      if (res.ok) {
        const payload = await res.json();
        setStaticSeatsLayout(payload.data || []);
      }
    } catch (e) {
      console.error("Layout initialization failed:", e);
    }
  };

  const fetchShowtimesForFilm = async (film) => {
    if (!film) return;
    try {
      setSelectedMovieForShowtimes(film);
      const res = await fetch(
        `http://localhost:5000/showtime/film/${film.film_id}`,
      );
      if (!res.ok) throw new Error("Showtimes could not be compiled.");
      const payload = await res.json();
      setActiveScreenings(payload.data || []);
    } catch (err) {
      console.error("Showtime extraction fail:", err);
      setActiveScreenings([]);
    }
  };

  const fetchBookedSeatsForShowtime = async (filmId, showtimeId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/book-seat/${filmId}/${showtimeId}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const payload = await res.json();
        setBookedSeatsMatrix(payload.data || []);
      }
    } catch (e) {
      console.error("Booking verification breakdown:", e);
    }
  };

  // --- FILM SYSTEM INTERFACES ---
  const handleOpenAddMovie = () => {
    setEditingMovie(null);
    setMovieForm({
      film_name: "",
      genre: "",
      trailer_link: "",
      description: "",
      release_date: new Date().toISOString().split("T")[0],
      language: "English",
      duration: 120,
      poster_image: "",
      status: "NOW_SHOWING",
    });
    setIsMovieModalOpen(true);
  };

  const handleOpenEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      film_name: movie.film_name || "",
      genre: movie.genre || "",
      trailer_link: movie.trailer_link || "",
      description: movie.description || "",
      release_date: movie.release_date ? movie.release_date.split("T")[0] : "",
      language: movie.language || "English",
      duration: Number(movie.duration) || 120,
      poster_image: movie.poster_image || "",
      status: movie.status || "NOW_SHOWING",
    });
    setIsMovieModalOpen(true);
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      const targetUrl = editingMovie
        ? `http://localhost:5000/film/update/${editingMovie.film_id}`
        : "http://localhost:5000/film/save";

      const method = editingMovie ? "PUT" : "POST";

      const res = await fetch(targetUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...movieForm,
          duration: Number(movieForm.duration),
        }),
      });

      if (!res.ok) throw new Error("Could not execute profile commit.");
      setIsMovieModalOpen(false);
      fetchAllFilms();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Error processing movie metadata.",
      );
    }
  };

  const handleMovieDelete = async (filmId) => {
    if (
      !confirm(
        "Are you sure you want to completely remove this film and all associated tracking data?",
      )
    )
      return;
    try {
      const res = await fetch(`http://localhost:5000/film/delete/${filmId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Deletion target declined by server.");
      fetchAllFilms();
      if (selectedMovieForShowtimes?.film_id === filmId) {
        setSelectedMovieForShowtimes(null);
        setActiveScreenings([]);
      }
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Error executing structural purge.",
      );
    }
  };

  // --- SHOWTIME SYSTEM INTERFACES ---
  const handleOpenAddShowtime = (movie) => {
    setEditingScreening(null);
    setSelectedMovieForShowtimes(movie);
    setScreeningForm({
      showDate: new Date().toISOString().split("T")[0],
      startTime: "18:30:00",
      endTime: "21:15:00",
    });
    setIsScreeningModalOpen(true);
  };

  const handleOpenEditShowtime = (screening, movie) => {
    setEditingScreening(screening);
    setSelectedMovieForShowtimes(movie);
    setScreeningForm({
      showDate: screening.show_date ? screening.show_date.split("T")[0] : "",
      startTime: screening.start_time || "",
      endTime: screening.end_time || "",
    });
    setIsScreeningModalOpen(true);
  };

  const handleScreeningSubmit = async (e) => {
    e.preventDefault();
    try {
      const targetUrl = editingScreening
        ? `http://localhost:5000/showtime/update/${editingScreening.showtime_id}`
        : "http://localhost:5000/showtime/save";

      const method = editingScreening ? "PUT" : "POST";

      // Payload properties match target backend specifications exactly
      const payload = {
        filmId: selectedMovieForShowtimes.film_id,
        screenId: STATIC_SCREEN_ID,
        showDate: screeningForm.showDate,
        startTime: screeningForm.startTime.includes(".")
          ? screeningForm.startTime
          : `${screeningForm.startTime}.000000`,
        endTime: screeningForm.endTime.includes(".")
          ? screeningForm.endTime
          : `${screeningForm.endTime}.000000`,
      };

      const res = await fetch(targetUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok)
        throw new Error("Could not execute showtime mutation profile.");
      setIsScreeningModalOpen(false);
      fetchShowtimesForFilm(selectedMovieForShowtimes);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Error establishing live schedule block.",
      );
    }
  };

  const handleScreeningDelete = async (screeningId) => {
    if (
      !confirm(
        "Are you sure you want to cancel and delete this scheduled showtime slot?",
      )
    )
      return;
    try {
      const res = await fetch(
        `http://localhost:5000/showtime/delete/${screeningId}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Server declined showtime wipe sequence.");
      fetchShowtimesForFilm(selectedMovieForShowtimes);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Showtime removal process failed.",
      );
    }
  };

  // --- ANALYTICS MODAL SLIDE ENGINE ---
  const handleOpenStatsModal = async (movie) => {
    setStatsMovie(movie);
    setStatsSelectedScreening(null);
    setBookedSeatsMatrix([]);
    setIsStatsModalOpen(true);

    try {
      const res = await fetch(
        `http://localhost:5000/showtime/film/${movie.film_id}`,
      );
      if (res.ok) {
        const payload = await res.json();
        const showtimes = payload.data || [];
        if (showtimes.length > 0) {
          setStatsSelectedScreening(showtimes[0]);
        }
      }
    } catch (e) {
      console.error("Stats showtime mapping fetch dropped:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-background text-foreground space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Hydrating Management Control Matrix...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-10 bg-card border border-destructive/20 rounded-3xl space-y-3">
        <AlertCircle className="mx-auto text-destructive" size={32} />
        <p className="text-sm font-bold text-foreground">
          Critical Error Syncing Server Components
        </p>
        <p className="text-xs text-muted-foreground">{error}</p>
        <button
          onClick={fetchAllFilms}
          className="px-4 py-2 bg-input border border-border text-xs rounded-xl hover:bg-muted font-bold"
        >
          Retry Execution
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16">
      {/* Top Action Header Bar (Search Row Removed) */}
      <div className="flex flex-row justify-between items-center bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div>
          <h1 className="text-base font-black tracking-tight uppercase text-foreground">
            Cinema Catalog Matrix
          </h1>
          <p className="text-xs text-muted-foreground">
            Administer runtime system films and associated allocation sessions.
          </p>
        </div>
        <button
          onClick={handleOpenAddMovie}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-lime text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0"
        >
          <Plus size={14} /> Add New Film
        </button>
      </div>

      {/* CORE CATALOG DATA ARCHITECTURE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left/Center Component: Movies Administration Workspace */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-input/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                  <th className="p-4 pl-6 w-[45%]">Film Metadata Profile</th>
                  <th className="p-4 w-[20%]">Genre Matrix</th>
                  <th className="p-4 w-[15%]">Run-length</th>
                  <th className="p-4 pr-6 text-right w-[20%]">
                    Operations Cluster
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs font-medium text-foreground">
                {movies.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-12 text-center text-muted-foreground/60 italic font-mono text-xs"
                    >
                      No cinema profiles captured inside active cluster
                      databases.
                    </td>
                  </tr>
                ) : (
                  movies.map((movie) => {
                    const isTarget =
                      selectedMovieForShowtimes?.film_id === movie.film_id;
                    return (
                      <tr
                        key={movie.film_id}
                        onClick={() => fetchShowtimesForFilm(movie)}
                        className={`transition-colors cursor-pointer group ${isTarget ? "bg-brand-lime/[0.02] border-l-2 border-l-brand-lime" : "hover:bg-foreground/[0.01]"}`}
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-4">
                            {movie.poster_image ? (
                              <img
                                src={movie.poster_image}
                                alt=""
                                className="h-10 w-7 rounded object-cover border border-border shrink-0 shadow-xs"
                              />
                            ) : (
                              <div className="h-10 w-7 rounded bg-input border border-border flex items-center justify-center shrink-0">
                                <Film
                                  size={12}
                                  className="text-muted-foreground/40"
                                />
                              </div>
                            )}
                            <div className="space-y-0.5 max-w-[240px]">
                              <span className="font-bold text-foreground block group-hover:text-brand-lime transition-colors duration-150 truncate">
                                {movie.film_name}
                              </span>
                              <span className="text-[10px] text-muted-foreground line-clamp-1 font-normal">
                                {movie.description}
                              </span>
                              <span className="text-[8px] font-mono text-muted-foreground/40 block tracking-tight uppercase">
                                {movie.status} • {movie.language}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-foreground/[0.03] border border-border text-muted-foreground text-[10px] font-bold tracking-tight uppercase">
                            {movie.genre}
                          </span>
                        </td>

                        <td className="p-4 text-muted-foreground font-mono font-semibold">
                          {movie.duration} min
                        </td>

                        <td
                          className="p-4 pr-6 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenStatsModal(movie)}
                              className="p-2 rounded-lg text-brand-lime bg-brand-lime/[0.06] hover:bg-brand-lime hover:text-black border border-brand-lime/10 transition-all"
                              title="Inspect Active Allocation Metrics"
                            >
                              <BarChart3 size={13} />
                            </button>
                            <button
                              onClick={() => handleOpenEditMovie(movie)}
                              className="p-2 rounded-lg text-muted-foreground/70 hover:text-foreground hover:bg-foreground/[0.04] border border-transparent hover:border-border transition-all"
                              title="Modify Profile Properties"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleMovieDelete(movie.film_id)}
                              className="p-2 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 border border-transparent transition-all"
                              title="Execute Absolute Purge Sequence"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar Component: Screenings & Showtime Session Matrix */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                Session Scheduler
              </h2>
              <p className="text-[10px] text-muted-foreground">
                Manage specific timeframe instances.
              </p>
            </div>
            {selectedMovieForShowtimes && (
              <button
                onClick={() => handleOpenAddShowtime(selectedMovieForShowtimes)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background font-black text-[10px] uppercase tracking-wider rounded-lg hover:opacity-90 transition-all"
              >
                <Plus size={11} /> Create Slot
              </button>
            )}
          </div>

          {!selectedMovieForShowtimes ? (
            <div className="py-12 px-4 border border-dashed border-border rounded-xl text-center text-xs italic text-muted-foreground/60 font-mono">
              Select an ongoing film profile target row to audit screening
              session lines.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-input/40 border border-border rounded-xl">
                <span className="text-[8px] font-bold text-brand-lime uppercase tracking-widest font-mono block">
                  Context Selection
                </span>
                <span className="text-xs font-bold text-foreground block mt-0.5 truncate">
                  {selectedMovieForShowtimes.film_name}
                </span>
              </div>

              {activeScreenings.length === 0 ? (
                <div className="py-8 text-center text-xs italic text-muted-foreground/50 bg-input/20 rounded-xl">
                  No execution showtime slots deployed on track.
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                  {activeScreenings.map((scr) => (
                    <div
                      key={scr.showtime_id}
                      className="p-3 bg-input/60 border border-border rounded-xl flex items-center justify-between group/slot hover:border-muted-foreground/20 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={12}
                            className="text-muted-foreground"
                          />
                          <span className="font-mono text-xs font-bold text-foreground">
                            {scr.show_date
                              ? scr.show_date.split("T")[0]
                              : "No Date"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                          <span className="text-brand-lime font-bold">
                            {scr.start_time?.slice(0, 5)} -{" "}
                            {scr.end_time?.slice(0, 5)}
                          </span>
                          <span>•</span>
                          <span className="text-foreground/70 text-[10px] font-sans font-semibold">
                            {scr.screen_name || "Screen Hall A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover/slot:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            handleOpenEditShowtime(
                              scr,
                              selectedMovieForShowtimes,
                            )
                          }
                          className="p-1.5 rounded-md hover:bg-foreground/[0.04] text-muted-foreground hover:text-foreground transition-all"
                        >
                          <Edit2 size={11} />
                        </button>
                        <button
                          onClick={() => handleScreeningDelete(scr.showtime_id)}
                          className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- PANEL SLIDE-OVER: METRICS INSIGHTS BOARD & LIVE BOOKINGS MATRIX --- */}
      {isStatsModalOpen && statsMovie && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex justify-end animate-fadeIn select-none">
          <div className="bg-card border-l border-border w-full max-w-2xl h-full p-6 flex flex-col justify-between shadow-2xl text-foreground overflow-y-auto custom-scrollbar animate-slideLeft">
            <div>
              <div className="flex justify-between items-start border-b border-border pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-brand-lime uppercase tracking-widest font-mono block mb-1">
                    Session Matrix Engine
                  </span>
                  <h2 className="text-lg font-black text-foreground tracking-tight">
                    {statsMovie.film_name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {statsMovie.genre} • {statsMovie.duration} Minutes
                  </p>
                </div>
                <button
                  onClick={() => setIsStatsModalOpen(false)}
                  className="p-2 rounded-xl bg-input border border-border text-muted-foreground hover:text-foreground transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Dynamic Step: Showtime Slot Verification Line */}
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                  Audited Active Operational Slot
                </label>
                <div className="flex flex-wrap gap-2">
                  {movies.find((m) => m.film_id === statsMovie.film_id) &&
                  !statsSelectedScreening ? (
                    <div className="p-4 w-full bg-input border border-dashed border-border rounded-xl text-center text-xs italic text-muted-foreground/60 font-mono">
                      No showtime parameters configured on target index tracking
                      lists.
                    </div>
                  ) : (
                    // Re-fetch mapping values directly inline
                    movies.map((m) => {
                      if (m.film_id !== statsMovie.film_id) return null;
                      return (
                        <div
                          key="stats-slots-group"
                          className="flex flex-wrap gap-2 w-full"
                        >
                          {activeScreenings.map((scr) => {
                            const isTarget =
                              statsSelectedScreening?.showtime_id ===
                              scr.showtime_id;
                            return (
                              <button
                                key={scr.showtime_id}
                                onClick={() => setStatsSelectedScreening(scr)}
                                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-3 ${
                                  isTarget
                                    ? "bg-brand-lime border-brand-lime text-black font-black shadow-xs"
                                    : "bg-input border-border text-foreground hover:border-muted-foreground/40"
                                }`}
                              >
                                <Clock size={13} />
                                <div>
                                  <span className="block font-mono leading-none">
                                    {scr.start_time?.slice(0, 5)}
                                  </span>
                                  <span
                                    className={`text-[8px] uppercase tracking-tight block mt-0.5 font-bold ${isTarget ? "text-black/60" : "text-muted-foreground"}`}
                                  >
                                    {scr.show_date
                                      ? scr.show_date.split("T")[0]
                                      : "Date Variant"}{" "}
                                    • {scr.screen_name || "Hall A"}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Dynamic Interactive Auditorium Grid Map Configuration Topology */}
              {statsSelectedScreening && (
                <div className="border border-border bg-input/20 rounded-2xl p-5 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Armchair size={14} className="text-brand-lime" />{" "}
                      Occupancy Allocation Mapping Layout
                    </h4>

                    <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-foreground/[0.06] border border-border block" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-brand-lime border border-brand-lime block" />
                        <span>Booked ({bookedSeatsMatrix.length})</span>
                      </div>
                    </div>
                  </div>

                  {/* Curving Architecture Vector Line Screen Element */}
                  <div className="relative w-full max-w-sm mx-auto text-center pt-2">
                    <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-brand-lime/40 to-transparent rounded-full blur-xs" />
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mt-0.5" />
                    <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block mt-2">
                      Auditorium Front Screen Arc
                    </span>
                  </div>

                  {/* Seat Grid Layout Execution Parsing Loop */}
                  <div className="flex flex-col gap-2 max-w-md mx-auto pt-4">
                    {SEAT_ROWS.map((row) => (
                      <div key={row} className="flex items-center gap-3">
                        <span className="w-3 text-[10px] font-black font-mono text-muted-foreground/40">
                          {row}
                        </span>
                        <div className="flex-1 grid grid-cols-10 gap-1.5">
                          {SEAT_NUMBERS.map((num) => {
                            const seatCode = `${row}${num}`;
                            // Cross verify against layout type arrays if available
                            const matchingLayoutSeat = staticSeatsLayout.find(
                              (s) =>
                                s.row_label === row && s.seat_number === num,
                            );
                            const isDamaged =
                              matchingLayoutSeat?.seat_type === "DAMAGE";
                            const isBooked =
                              bookedSeatsMatrix.includes(seatCode);

                            return (
                              <div
                                key={seatCode}
                                className={`aspect-square rounded-md text-[8px] font-bold font-mono flex items-center justify-center transition-all ${
                                  isDamaged
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30 line-through cursor-not-allowed"
                                    : isBooked
                                      ? "bg-brand-lime text-black border border-brand-lime shadow-xs font-black scale-95"
                                      : "bg-foreground/[0.04] border border-border/80 text-muted-foreground/60"
                                }`}
                                title={`Seat Code: ${seatCode} [${isDamaged ? "DAMAGED" : isBooked ? "Booked Session Assignment" : "Vacant Inventory"}]`}
                              >
                                {num}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="px-5 py-2.5 bg-foreground text-background font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all"
              >
                Close Metrics Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DIALOG COMPONENT: FILM CONFIGURATION FRAME (ADD / EDIT) --- */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Film size={16} className="text-brand-lime" />{" "}
                {editingMovie
                  ? "Modify Film Configuration"
                  : "Register Catalog Profile"}
              </h3>
              <button
                onClick={() => setIsMovieModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleMovieSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Film Name Title
                </label>
                <input
                  type="text"
                  required
                  value={movieForm.film_name}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, film_name: e.target.value })
                  }
                  placeholder="e.g., Avatar: The Way of Water"
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-semibold text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Genre Track
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.genre}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, genre: e.target.value })
                    }
                    placeholder="Science Fiction"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Language Node
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.language}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, language: e.target.value })
                    }
                    placeholder="English"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    required
                    value={movieForm.duration}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, duration: e.target.value })
                    }
                    placeholder="192"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-mono text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Release Profile Date
                  </label>
                  <input
                    type="date"
                    required
                    value={movieForm.release_date}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        release_date: e.target.value,
                      })
                    }
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Status Identifier
                </label>
                <select
                  value={movieForm.status}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, status: e.target.value })
                  }
                  className="w-full bg-input border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
                >
                  <option value="NOW_SHOWING">NOW_SHOWING</option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="CONCLUDED">CONCLUDED</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Poster Vector URL
                </label>
                <input
                  type="url"
                  required
                  value={movieForm.poster_image}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, poster_image: e.target.value })
                  }
                  placeholder="https://example.com/images/poster.jpg"
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-mono text-foreground"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Trailer Stream Route Link
                </label>
                <input
                  type="url"
                  required
                  value={movieForm.trailer_link}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, trailer_link: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=d9MyW72ELq0"
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-mono text-foreground"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Structural Overview Summary Text
                </label>
                <textarea
                  required
                  rows={2}
                  value={movieForm.description}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, description: e.target.value })
                  }
                  placeholder="Provide concise descriptive plot parameters..."
                  className="w-full bg-input border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:opacity-90 shadow-sm"
              >
                {editingMovie
                  ? "Commit Existing Updates"
                  : "Deploy Catalog Frame"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- DIALOG COMPONENT: SHOWTIME SCHEDULER BOARD (ADD / EDIT) --- */}
      {isScreeningModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} className="text-brand-lime" />{" "}
                {editingScreening
                  ? "Modify Session Slot"
                  : "Deploy Session Slot Track"}
              </h3>
              <button
                onClick={() => setIsScreeningModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={handleScreeningSubmit}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Calendar Allocation Date
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
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Start Time Block
                  </label>
                  <input
                    type="text"
                    required
                    value={screeningForm.startTime}
                    onChange={(e) =>
                      setScreeningForm({
                        ...screeningForm,
                        startTime: e.target.value,
                      })
                    }
                    placeholder="18:30:00"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-mono text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    End Time Block
                  </label>
                  <input
                    type="text"
                    required
                    value={screeningForm.endTime}
                    onChange={(e) =>
                      setScreeningForm({
                        ...screeningForm,
                        endTime: e.target.value,
                      })
                    }
                    placeholder="21:15:00"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-lime font-mono text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Terminal Screen Target Assignment
                </label>
                <input
                  type="text"
                  disabled
                  value={`${STATIC_SCREEN_ID} (Standard Hall A)`}
                  className="w-full bg-input/60 border border-border rounded-xl px-4 py-2.5 text-muted-foreground select-none font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:opacity-90 shadow-sm"
              >
                {editingScreening
                  ? "Update Target Parameters"
                  : "Launch Active Showtime Block"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
