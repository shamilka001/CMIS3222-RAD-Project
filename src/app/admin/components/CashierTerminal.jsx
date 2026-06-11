// "use client";

// import { useState, useEffect } from "react";
// import {
//   Film,
//   Calendar,
//   Armchair,
//   Ticket,
//   Printer,
//   X,
//   ArrowRight,
//   CheckCircle2,
// } from "lucide-react";

// // ==========================================================
// // HIGH-PERFORMANCE HALFTONE PROCESSING ENGINE (HOOK)
// // ==========================================================
// function useHalftoneImage(imageUrl) {
//   const [halftoneDataUrl, setHalftoneDataUrl] = useState("");

//   useEffect(() => {
//     if (!imageUrl) {
//       setHalftoneDataUrl("");
//       return;
//     }

//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.src = imageUrl;

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       const targetWidth = 600;
//       const scaleFactor = targetWidth / img.width;
//       const targetHeight = img.height * scaleFactor;

//       canvas.width = targetWidth;
//       canvas.height = targetHeight;

//       ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

//       try {
//         const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
//         const pixels = imgData.data;

//         ctx.fillStyle = "#ffffff";
//         ctx.fillRect(0, 0, targetWidth, targetHeight);
//         ctx.fillStyle = "#000000";

//         const dotSpacing = 5;

//         for (let y = 0; y < targetHeight; y += dotSpacing) {
//           for (let x = 0; x < targetWidth; x += dotSpacing) {
//             const index = (y * targetWidth + x) * 4;
//             const r = pixels[index];
//             const g = pixels[index + 1];
//             const b = pixels[index + 2];
//             const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
//             const darknessRatio = 1 - brightness / 255;

//             if (darknessRatio > 0.05) {
//               const maxRadius = dotSpacing * 0.7;
//               const radius = maxRadius * darknessRatio;

//               ctx.beginPath();
//               ctx.arc(
//                 x + dotSpacing / 2,
//                 y + dotSpacing / 2,
//                 radius,
//                 0,
//                 Math.PI * 2,
//               );
//               ctx.fill();
//             }
//           }
//         }

//         setHalftoneDataUrl(canvas.toDataURL("image/png"));
//       } catch (error) {
//         console.error(
//           "Halftone computation failed: Falling back to standard image layout.",
//           error,
//         );
//         setHalftoneDataUrl(imageUrl);
//       }
//     };

//     img.onerror = () => {
//       console.error("Could not load image source framework.");
//     };
//   }, [imageUrl]);

//   return halftoneDataUrl;
// }

// export default function CashierTerminal() {
//   // 1. Step Workflow Engine State
//   const [step, setStep] = useState(1);
//   const [isPrinting, setIsPrinting] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // 2. Active Database Repositories
//   const [movies, setMovies] = useState([]);
//   const [showtimes, setShowtimes] = useState([]);
//   const [seatingLayout, setSeatingLayout] = useState({
//     rows: [],
//     seatsByRow: {},
//   });
//   const [bookedSeats, setBookedSeats] = useState([]);

//   // 3. Selection Trackers
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [selectedShowtime, setSelectedShowtime] = useState(null);
//   const [selectedSeats, setSelectedSeats] = useState([]);

//   // 4. Current Logged-in System User State
//   const [currentUserId, setCurrentUserId] = useState(
//     "WALKIN_PHYSICAL_CUSTOMER",
//   );

//   // BASE API CONFIG
//   const API_BASE = "http://localhost:5000";

//   // --- EFFECT: LOAD CURRENT LOGGED-IN USER ID FROM LOCAL STORAGE ---
//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         if (parsedUser && parsedUser.id) {
//           setCurrentUserId(parsedUser.id);
//         } else if (parsedUser && parsedUser.user && parsedUser.user.id) {
//           setCurrentUserId(parsedUser.user.id);
//         }
//       }
//     } catch (err) {
//       console.error(
//         "Failed extracting profile identifier configuration context:",
//         err,
//       );
//     }
//   }, []);

//   // --- EFFECT: FETCH ALL MOVIES ---
//   useEffect(() => {
//     async function fetchMovies() {
//       try {
//         const res = await fetch(`${API_BASE}/film/get-all-film`);
//         const json = await res.json();
//         if (json.data) setMovies(json.data);
//       } catch (err) {
//         console.error("Failed fetching films matrix:", err);
//       }
//     }
//     fetchMovies();
//   }, []);

//   // --- EFFECT: FETCH SHOWTIMES FOR SELECTED MOVIE ---
//   useEffect(() => {
//     if (!selectedMovie) {
//       setShowtimes([]);
//       return;
//     }
//     async function fetchShowtimes() {
//       try {
//         const res = await fetch(
//           `${API_BASE}/showtime/film/${selectedMovie.film_id}`,
//         );
//         const json = await res.json();
//         if (json.data) {
//           const now = new Date();
//           const activeShows = json.data.filter((show) => {
//             const showDate = new Date(show.show_date);
//             return showDate.setHours(0, 0, 0, 0) >= now.setHours(0, 0, 0, 0);
//           });
//           setShowtimes(activeShows);
//         }
//       } catch (err) {
//         console.error("Failed loading active showtimes:", err);
//       }
//     }
//     fetchShowtimes();
//   }, [selectedMovie]);

//   // --- EFFECT: FETCH MASTER SEATS AND CURRENT BOOKINGS ---
//   useEffect(() => {
//     if (!selectedShowtime || !selectedMovie) return;

//     async function fetchSeatingMatrix() {
//       try {
//         setLoading(true);
//         const layoutRes = await fetch(
//           `${API_BASE}/seat/screen/${selectedShowtime.screen_id}`,
//         );
//         const layoutJson = await layoutRes.json();

//         const bookRes = await fetch(
//           `${API_BASE}/book-seat/${selectedMovie.film_id}/${selectedShowtime.showtime_id}`,
//         );
//         const bookJson = await bookRes.json();

//         if (layoutJson.data) {
//           const rowNames = Array.from(
//             new Set(layoutJson.data.map((s) => s.row_label)),
//           ).sort();
//           const structure = {};

//           rowNames.forEach((row) => {
//             structure[row] = layoutJson.data
//               .filter((s) => s.row_label === row)
//               .map((s) => {
//                 // Read seat_type cleanly to identify if it is marked as DAMAGE
//                 const isSeatDamaged =
//                   s.seat_type && s.seat_type.toUpperCase() === "DAMAGE";

//                 return {
//                   id: `${s.row_label}${s.seat_number}`,
//                   seat_id: s.seat_id,
//                   type: s.seat_type,
//                   status: isSeatDamaged ? "Damaged" : "Operational",
//                 };
//               })
//               .sort(
//                 (a, b) => parseInt(a.id.slice(1)) - parseInt(b.id.slice(1)),
//               );
//           });

//           setSeatingLayout({ rows: rowNames, seatsByRow: structure });
//         }

//         if (bookJson.data) {
//           setBookedSeats(bookJson.data);
//         }
//       } catch (err) {
//         console.error("Failed loading screen allocations:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchSeatingMatrix();
//   }, [selectedShowtime, selectedMovie]);

//   const finalHalftoneCover = useHalftoneImage(selectedMovie?.poster_image);

//   // --- BUSINESS LOGIC FUNCTIONS ---
//   const toggleSeatSelection = (seat) => {
//     const isOccupied = bookedSeats.includes(seat.id);
//     if (seat.status === "Damaged" || isOccupied) return;

//     if (selectedSeats.find((s) => s.id === seat.id)) {
//       setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
//     } else {
//       // Sourced Currency Conversion adjustment: VIP to Rs. 1500.00 and Standard to Rs. 1000.00
//       const seatPrice = seat.type === "VIP" ? 1500.0 : 1000.0;
//       setSelectedSeats([...selectedSeats, { ...seat, price: seatPrice }]);
//     }
//   };

//   const calculateTotalCost = () =>
//     selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

//   const executeOrderCreation = async () => {
//     try {
//       setLoading(true);
//       const seatCodesArray = selectedSeats.map((s) => s.id);

//       const payload = {
//         userId: currentUserId,
//         showtimeId: selectedShowtime.showtime_id,
//         seats: seatCodesArray,
//       };
//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_BASE}/booking/save`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//         body: JSON.stringify(payload),
//       });
//       if (response.ok) {
//         setStep(3);
//       } else {
//         const errorData = await response.json();
//         alert(`Order dispatch rejected: ${errorData.message}`);
//       }
//     } catch (err) {
//       console.error("Terminal database sync failure:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const triggerSystemPrint = () => {
//     setIsPrinting(true);
//     setTimeout(() => {
//       window.print();
//     }, 250);
//   };

//   const resetTerminal = () => {
//     setSelectedMovie(null);
//     setSelectedShowtime(null);
//     setSelectedSeats([]);
//     setBookedSeats([]);
//     setStep(1);
//     setIsPrinting(false);
//   };

//   useEffect(() => {
//     const handleAfterPrint = () => {
//       setIsPrinting(false);
//     };
//     window.addEventListener("afterprint", handleAfterPrint);
//     return () => window.removeEventListener("afterprint", handleAfterPrint);
//   }, []);

//   // ==========================================================
//   // HARDWARE CRITICAL: ISOLATED RATIO OVERRIDE RENDER PORTAL
//   // ==========================================================
//   if (
//     isPrinting &&
//     selectedMovie &&
//     selectedShowtime &&
//     selectedSeats.length > 0
//   ) {
//     return (
//       <div className="absolute inset-0 bg-white text-black min-h-screen w-full z-[999999] p-0 m-0 print-portal-root">
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link
//           rel="preconnect"
//           href="https://fonts.gstatic.com"
//           crossOrigin="anonymous"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap"
//           rel="stylesheet"
//         />

//         <style
//           dangerouslySetInnerHTML={{
//             __html: `
//           @page { margin: 0; size: 115mm 297mm; }
//           @media print {
//             body * { visibility: hidden !important; }
//             .print-portal-root, .print-portal-root * { visibility: visible !important; }
//             .print-portal-root { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; height: 100% !important; background: #ffffff !important; }
//             * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//           }
//           html, body { background: #ffffff !important; color: #000000 !important; overflow: visible !important; height: auto !important; margin: 0 !important; padding: 0 !important; }
//           .ticket-page-break { page-break-after: always !important; break-after: page !important; display: flex !important; }
//           .boarding-canvas, .boarding-canvas * { font-family: 'Share Tech Mono', monospace !important; text-transform: uppercase !important; box-sizing: border-box; letter-spacing: 0.02em; }
//         `,
//           }}
//         />

//         {selectedSeats.map((seat, index) => {
//           const uniquePassToken = `ML-${selectedShowtime.showtime_id}-${seat.id}`;
//           const currentDateStr = new Date().toLocaleDateString("en-US", {
//             month: "short",
//             day: "2-digit",
//             year: "numeric",
//           });

//           return (
//             <div
//               key={seat.id}
//               className="ticket-page-break bg-white text-black mx-auto select-none boarding-canvas flex-col items-stretch border-[2px] border-black"
//               style={{
//                 width: "115mm",
//                 height: "297mm",
//                 backgroundColor: "#f2f2f2",
//               }}
//             >
//               <div className="h-[28%] bg-black text-white relative flex flex-col justify-between p-4 border-b-2 border-black overflow-hidden">
//                 {finalHalftoneCover && (
//                   <div className="absolute inset-0 z-0">
//                     <img
//                       src={finalHalftoneCover}
//                       alt="Halftone Manifest"
//                       className="w-full h-full object-cover mix-blend-lighten"
//                       style={{ opacity: 0.85 }}
//                     />
//                   </div>
//                 )}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 z-5" />
//                 <div className="relative z-10 flex justify-between items-center text-[11px] tracking-wider text-zinc-300 font-bold">
//                   <div>MAXLIGHT CINEMAS // FILMPASS</div>
//                   <div>
//                     NO. {index + 1}/{selectedSeats.length}
//                   </div>
//                 </div>
//                 <div className="relative z-10 bg-black/80 p-2 border-l-4 border-white mt-auto">
//                   <h2 className="text-xl tracking-wide leading-none font-bold text-white">
//                     {selectedMovie.film_name}
//                   </h2>
//                   <span className="text-[9px] text-zinc-400 block mt-1 tracking-widest">
//                     ADMISSION FRAMEWORK DIRECTIVE
//                   </span>
//                 </div>
//               </div>

//               <div className="h-[44%] p-5 flex flex-col justify-between border-b-2 border-dashed border-zinc-400 relative">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <span className="text-[10px] text-zinc-500 block">
//                       THEATER VENUE
//                     </span>
//                     <span className="text-sm font-bold text-black">
//                       {selectedShowtime.screen_name}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-[10px] text-zinc-500 block">
//                       CATALOG TOKEN
//                     </span>
//                     <span className="text-sm font-bold text-black">
//                       {uniquePassToken}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="my-auto space-y-4">
//                   <div>
//                     <span className="text-[10px] text-zinc-500 tracking-wider block">
//                       ASSIGNED POSITION
//                     </span>
//                     <h1 className="text-6xl font-black tracking-tighter text-black leading-none">
//                       {seat.id}
//                     </h1>
//                   </div>
//                   <div>
//                     <span className="text-[10px] text-zinc-500 tracking-wider block">
//                       SHOWTIME INITIATION
//                     </span>
//                     <h1 className="text-4xl font-black tracking-tight text-black leading-none">
//                       {selectedShowtime.start_time}
//                     </h1>
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-end pt-2 border-t border-zinc-300">
//                   <div>
//                     <span className="text-[10px] text-zinc-500 block">
//                       VALIDATION DATE
//                     </span>
//                     <span className="text-sm font-bold text-black">
//                       {currentDateStr}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-[10px] text-zinc-500 block">
//                       TIER SCALE
//                     </span>
//                     <span className="text-sm font-bold text-black">
//                       {seat.type}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="h-[28%] p-5 flex flex-col justify-between bg-zinc-100/80">
//                 <div className="flex justify-between items-start">
//                   <div className="max-w-[70%]">
//                     <span className="text-[9px] text-zinc-500 block">
//                       FEATURE STUB
//                     </span>
//                     <h3 className="text-xs font-bold text-black truncate leading-tight">
//                       {selectedMovie.film_name}
//                     </h3>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-[9px] text-zinc-500 block">
//                       PRICE DEBIT
//                     </span>
//                     <span className="text-xs font-bold text-black">
//                       Rs. {seat.price.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="w-full flex flex-col items-center space-y-1">
//                   <div className="w-full h-10 bg-white border border-zinc-300 p-1 flex items-center justify-center overflow-hidden">
//                     <div
//                       className="w-full h-8 bg-repeat-x opacity-90"
//                       style={{
//                         backgroundImage:
//                           "linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 7px, #000 7px, #000 10px)",
//                       }}
//                     />
//                   </div>
//                   <span className="text-[9px] font-mono text-zinc-500 tracking-widest">
//                     {uniquePassToken}-{seat.id}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center pt-1">
//                   <div>
//                     <span className="text-[9px] text-zinc-500 block">
//                       SEAT ID
//                     </span>
//                     <span className="text-sm font-bold text-black">
//                       {seat.id}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-[9px] text-zinc-500 block">
//                       DEPARTS TIME
//                     </span>
//                     <span className="text-sm font-bold text-black">
//                       {selectedShowtime.start_time}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   // ==========================================================
//   // STANDARD OPERATION WORKSPACE VIEW CONTAINER
//   // ==========================================================
//   return (
//     <div className="w-full space-y-4">
//       {/* Action Header Banner */}
//       <div className="flex justify-between items-center bg-card border border-border rounded-2xl p-4 shadow-xs">
//         <div>
//           <h2 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
//             <Ticket size={16} className="text-brand-lime" /> Counter POS Cashier
//             Terminal
//           </h2>
//           <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
//             Walk-in physical ticketing module desk setup
//           </p>
//         </div>
//         {step > 1 && (
//           <button
//             onClick={resetTerminal}
//             className="flex items-center gap-1.5 py-1.5 px-3 bg-input hover:bg-foreground/[0.04] border border-border text-xs font-bold rounded-xl text-red-400"
//           >
//             <X size={13} /> Cancel Order
//           </button>
//         )}
//       </div>

//       {/* STEP DISPLAY FLOW RAIL */}
//       <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">
//         <div
//           className={`p-3 rounded-xl border ${step === 1 ? "bg-brand-lime text-black border-transparent" : "bg-card border-border"}`}
//         >
//           1. Session Selection
//         </div>
//         <div
//           className={`p-3 rounded-xl border ${step === 2 ? "bg-brand-lime text-black border-transparent" : "bg-card border-border"}`}
//         >
//           2. Manifest Seat Map
//         </div>
//         <div
//           className={`p-3 rounded-xl border ${step === 3 ? "bg-brand-lime text-black border-transparent" : "bg-card border-border"}`}
//         >
//           3. Dispatch & Print
//         </div>
//       </div>

//       {/* STAGE 1: MOVIE AND SHOWTIME SELECTOR */}
//       {step === 1 && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
//             <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
//               <Film size={13} /> Select Catalog Feature
//             </h3>
//             <div className="space-y-2">
//               {movies.map((movie) => (
//                 <button
//                   key={movie.film_id}
//                   onClick={() => {
//                     setSelectedMovie(movie);
//                     setSelectedShowtime(null);
//                   }}
//                   className={`w-full flex items-center gap-4 p-3 rounded-xl border text-left transition-all ${
//                     selectedMovie?.film_id === movie.film_id
//                       ? "bg-brand-lime/10 border-brand-lime text-foreground"
//                       : "bg-input/50 border-border/70 hover:border-border text-muted-foreground hover:text-foreground"
//                   }`}
//                 >
//                   <img
//                     src={movie.poster_image}
//                     alt=""
//                     className="w-10 h-14 rounded-md object-cover border bg-zinc-800"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h4 className="text-xs font-black tracking-wide truncate text-foreground">
//                       {movie.film_name}
//                     </h4>
//                     <p className="text-[10px] font-medium mt-0.5">
//                       {movie.genre} • {movie.duration} min
//                     </p>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
//             <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
//               <Calendar size={13} /> Available Showtimes
//             </h3>
//             {selectedMovie ? (
//               <div className="space-y-2">
//                 {showtimes.length === 0 ? (
//                   <div className="p-4 text-xs italic text-muted-foreground text-center border rounded-xl">
//                     No active or future scheduling records available.
//                   </div>
//                 ) : (
//                   showtimes.map((showtime) => (
//                     <button
//                       key={showtime.showtime_id}
//                       onClick={() => setSelectedShowtime(showtime)}
//                       className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
//                         selectedShowtime?.showtime_id === showtime.showtime_id
//                           ? "bg-brand-lime/10 border-brand-lime text-foreground"
//                           : "bg-input/50 border-border/70 hover:border-border text-muted-foreground hover:text-foreground"
//                       }`}
//                     >
//                       <div>
//                         <span className="text-sm font-black text-foreground">
//                           {showtime.start_time}
//                         </span>
//                         <span className="text-[10px] font-mono px-1.5 py-0.5 bg-input border border-border/80 rounded ml-2 text-muted-foreground">
//                           {showtime.screen_name}
//                         </span>
//                       </div>
//                     </button>
//                   ))
//                 )}

//                 <button
//                   disabled={!selectedShowtime || loading}
//                   onClick={() => setStep(2)}
//                   className="w-full mt-4 py-3 bg-brand-lime disabled:opacity-30 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
//                 >
//                   Configure Seating Layout <ArrowRight size={13} />
//                 </button>
//               </div>
//             ) : (
//               <div className="h-48 flex items-center justify-center text-xs text-muted-foreground/60 italic border border-dashed border-border/60 rounded-xl">
//                 Please select a movie framework from the left panel first
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* STAGE 2: LIVE AUDITORIUM MAP RESERVATIONS */}
//       {step === 2 && (
//         <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
//           <div className="relative w-full max-w-md mx-auto text-center pb-4">
//             <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-brand-lime/20 to-transparent rounded-full blur-xs" />
//             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block mt-1">
//               PROJECTION STAGE ({selectedShowtime?.screen_name})
//             </span>
//           </div>

//           {loading ? (
//             <div className="text-center py-12 text-xs font-mono text-muted-foreground animate-pulse">
//               Synchronizing auditorium configurations...
//             </div>
//           ) : (
//             <div className="space-y-2.5 max-w-xl mx-auto">
//               {seatingLayout.rows.map((rowName) => (
//                 <div key={rowName} className="flex items-center gap-3">
//                   <span className="w-6 text-xs font-black font-mono text-muted-foreground text-center">
//                     {rowName}
//                   </span>
//                   <div className="flex-1 flex flex-wrap gap-1 items-center justify-start">
//                     {seatingLayout.seatsByRow[rowName]?.map((seat) => {
//                       const isOccupied = bookedSeats.includes(seat.id);
//                       const isDamaged = seat.status === "Damaged";
//                       const isVip = seat.type === "VIP";
//                       const isSelected = selectedSeats.some(
//                         (s) => s.id === seat.id,
//                       );
//                       return (
//                         <button
//                           key={seat.id}
//                           disabled={isDamaged || isOccupied}
//                           onClick={() => toggleSeatSelection(seat)}
//                           className={`h-7 w-7 rounded-md text-[9px] font-mono font-bold flex flex-col items-center justify-center border transition-all ${
//                             isDamaged
//                               ? "bg-red-500/10 border-red-500/30 text-red-500/40 cursor-not-allowed"
//                               : isOccupied
//                                 ? "bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed line-through"
//                                 : isSelected
//                                   ? "bg-brand-lime text-black border-transparent font-black scale-105 shadow-sm shadow-brand-lime/20"
//                                   : isVip
//                                     ? "bg-amber-500/5 border-amber-500/20 text-amber-400"
//                                     : "bg-input border-border text-foreground hover:border-brand-lime/40"
//                           }`}
//                         >
//                           <Armchair
//                             size={9}
//                             className={
//                               isSelected
//                                 ? "text-black"
//                                 : isDamaged
//                                   ? "text-red-500/20"
//                                   : isOccupied
//                                     ? "text-zinc-600"
//                                     : isVip
//                                       ? "text-amber-400/60"
//                                       : "text-muted-foreground/30"
//                             }
//                           />
//                           <span className="leading-none mt-0.5">
//                             {seat.id.slice(1)}
//                           </span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="border-t border-border pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
//             <div className="text-left space-y-0.5">
//               <div className="text-[10px] uppercase font-bold text-muted-foreground">
//                 Selected Seats Allocation
//               </div>
//               <div className="text-xs font-black text-foreground">
//                 {selectedSeats.length === 0
//                   ? "None Selected"
//                   : selectedSeats.map((s) => s.id).join(", ")}
//               </div>
//             </div>

//             <div className="flex items-center gap-6">
//               <div className="text-right">
//                 <span className="text-[10px] uppercase font-bold text-muted-foreground block">
//                   Cash Due Amount
//                 </span>
//                 <span className="text-lg font-mono font-black text-brand-lime">
//                   Rs. {calculateTotalCost().toFixed(2)}
//                 </span>
//               </div>
//               <button
//                 disabled={selectedSeats.length === 0 || loading}
//                 onClick={executeOrderCreation}
//                 className="py-2.5 px-6 bg-brand-lime disabled:opacity-30 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs"
//               >
//                 Issue Bookings
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* STAGE 3: DISPATCH GATEWAY & PREVIEW CONTAINER */}
//       {step === 3 && (
//         <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4 max-w-lg mx-auto">
//           <div className="h-12 w-12 rounded-full bg-brand-lime/10 border border-brand-lime/30 text-brand-lime flex items-center justify-center mx-auto text-xl font-bold">
//             ✓
//           </div>
//           <div>
//             <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
//               Order Successfully Authorized
//             </h3>
//             <p className="text-[10px] text-muted-foreground mt-0.5">
//               Ready to output hard-copy receipts and admission tokens
//             </p>
//           </div>

//           <div className="bg-input/50 border border-border p-4 rounded-xl text-left text-xs font-semibold space-y-2 font-mono">
//             <div>
//               <span className="text-muted-foreground">Feature:</span>{" "}
//               {selectedMovie.film_name}
//             </div>
//             <div>
//               <span className="text-muted-foreground">Showtime:</span>{" "}
//               {selectedShowtime.start_time} ({selectedShowtime.screen_name})
//             </div>
//             <div>
//               <span className="text-muted-foreground">Total Paid:</span> Rs.{" "}
//               {calculateTotalCost().toFixed(2)}
//             </div>
//             <div>
//               <span className="text-muted-foreground">Tickets Count:</span>{" "}
//               {selectedSeats.length} units
//             </div>
//           </div>

//           <div className="space-y-2 pt-2">
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setStep(2)}
//                 className="flex-1 py-2.5 border border-border hover:bg-foreground/[0.02] text-foreground font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={triggerSystemPrint}
//                 className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-input hover:bg-foreground/[0.04] border border-border text-foreground font-black text-xs uppercase tracking-widest rounded-xl transition-all"
//               >
//                 <Printer size={14} /> Print PDF Sheets
//               </button>
//             </div>
//             <button
//               onClick={resetTerminal}
//               className="w-full flex items-center justify-center gap-2 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-brand-lime/10"
//             >
//               <CheckCircle2 size={15} /> Confirm Sale & Next Order
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

import { useState, useEffect } from "react";
import {
  Film,
  Calendar,
  Armchair,
  Ticket,
  Printer,
  X,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// ==========================================================
// HIGH-PERFORMANCE HALFTONE PROCESSING ENGINE (HOOK)
// ==========================================================
function useHalftoneImage(imageUrl) {
  const [halftoneDataUrl, setHalftoneDataUrl] = useState("");

  useEffect(() => {
    if (!imageUrl) {
      setHalftoneDataUrl("");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const targetWidth = 600;
      const scaleFactor = targetWidth / img.width;
      const targetHeight = img.height * scaleFactor;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      try {
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const pixels = imgData.data;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.fillStyle = "#000000";

        const dotSpacing = 5;

        for (let y = 0; y < targetHeight; y += dotSpacing) {
          for (let x = 0; x < targetWidth; x += dotSpacing) {
            const index = (y * targetWidth + x) * 4;
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            const darknessRatio = 1 - brightness / 255;

            if (darknessRatio > 0.05) {
              const maxRadius = dotSpacing * 0.7;
              const radius = maxRadius * darknessRatio;

              ctx.beginPath();
              ctx.arc(
                x + dotSpacing / 2,
                y + dotSpacing / 2,
                radius,
                0,
                Math.PI * 2,
              );
              ctx.fill();
            }
          }
        }

        setHalftoneDataUrl(canvas.toDataURL("image/png"));
      } catch (error) {
        console.error(
          "Halftone computation failed: Falling back to standard image layout.",
          error,
        );
        setHalftoneDataUrl(imageUrl);
      }
    };

    img.onerror = () => {
      console.error("Could not load image source framework.");
    };
  }, [imageUrl]);

  return halftoneDataUrl;
}

export default function CashierTerminal() {
  // 1. Step Workflow Engine State
  const [step, setStep] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2. Active Database Repositories
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [seatingLayout, setSeatingLayout] = useState({
    rows: [],
    seatsByRow: {},
  });
  const [bookedSeats, setBookedSeats] = useState([]);

  // 3. Selection Trackers
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 4. Current Logged-in System User State
  const [currentUserId, setCurrentUserId] = useState(
    "WALKIN_PHYSICAL_CUSTOMER",
  );

  // BASE API CONFIG
  const API_BASE = "http://localhost:5000";

  // --- EFFECT: LOAD CURRENT LOGGED-IN USER ID FROM LOCAL STORAGE ---
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setCurrentUserId(parsedUser.id);
        } else if (parsedUser && parsedUser.user && parsedUser.user.id) {
          setCurrentUserId(parsedUser.user.id);
        }
      }
    } catch (err) {
      console.error(
        "Failed extracting profile identifier configuration context:",
        err,
      );
    }
  }, []);

  // --- EFFECT: FETCH ALL MOVIES ---
  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`${API_BASE}/film/get-all-film`);
        const json = await res.json();
        if (json.data) setMovies(json.data);
      } catch (err) {
        console.error("Failed fetching films matrix:", err);
      }
    }
    fetchMovies();
  }, []);

  // --- EFFECT: FETCH SHOWTIMES FOR SELECTED MOVIE ---
  useEffect(() => {
    if (!selectedMovie) {
      setShowtimes([]);
      return;
    }
    async function fetchShowtimes() {
      try {
        const res = await fetch(
          `${API_BASE}/showtime/film/${selectedMovie.film_id}`,
        );
        const json = await res.json();
        if (json.data) {
          const now = new Date();
          const activeShows = json.data.filter((show) => {
            const showDate = new Date(show.show_date);
            return showDate.setHours(0, 0, 0, 0) >= now.setHours(0, 0, 0, 0);
          });
          setShowtimes(activeShows);
        }
      } catch (err) {
        console.error("Failed loading active showtimes:", err);
      }
    }
    fetchShowtimes();
  }, [selectedMovie]);

  // --- EFFECT: FETCH MASTER SEATS AND CURRENT BOOKINGS ---
  useEffect(() => {
    if (!selectedShowtime || !selectedMovie) return;

    async function fetchSeatingMatrix() {
      try {
        setLoading(true);
        const layoutRes = await fetch(
          `${API_BASE}/seat/screen/${selectedShowtime.screen_id}`,
        );
        const layoutJson = await layoutRes.json();

        const bookRes = await fetch(
          `${API_BASE}/book-seat/${selectedMovie.film_id}/${selectedShowtime.showtime_id}`,
        );
        const bookJson = await bookRes.json();

        if (layoutJson.data) {
          const rowNames = Array.from(
            new Set(layoutJson.data.map((s) => s.row_label)),
          ).sort();
          const structure = {};

          rowNames.forEach((row) => {
            structure[row] = layoutJson.data
              .filter((s) => s.row_label === row)
              .map((s) => {
                // Read seat_type cleanly to identify if it is marked as DAMAGE
                const isSeatDamaged =
                  s.seat_type && s.seat_type.toUpperCase() === "DAMAGE";

                return {
                  id: `${s.row_label}${s.seat_number}`,
                  seat_id: s.seat_id,
                  type: s.seat_type,
                  status: isSeatDamaged ? "Damaged" : "Operational",
                };
              })
              .sort(
                (a, b) => parseInt(a.id.slice(1)) - parseInt(b.id.slice(1)),
              );
          });

          setSeatingLayout({ rows: rowNames, seatsByRow: structure });
        }

        if (bookJson.data) {
          setBookedSeats(bookJson.data);
        }
      } catch (err) {
        console.error("Failed loading screen allocations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSeatingMatrix();
  }, [selectedShowtime, selectedMovie]);

  const finalHalftoneCover = useHalftoneImage(selectedMovie?.poster_image);

  // --- BUSINESS LOGIC FUNCTIONS ---
  const toggleSeatSelection = (seat) => {
    const isOccupied = bookedSeats.includes(seat.id);
    if (seat.status === "Damaged" || isOccupied) return;

    if (selectedSeats.find((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      // Sourced Currency Conversion adjustment: VIP to Rs. 1500.00 and Standard to Rs. 1000.00
      const seatPrice = seat.type === "VIP" ? 1500.0 : 1000.0;
      setSelectedSeats([...selectedSeats, { ...seat, price: seatPrice }]);
    }
  };

  const calculateTotalCost = () =>
    selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const executeOrderCreation = async () => {
    try {
      setLoading(true);
      const seatCodesArray = selectedSeats.map((s) => s.id);

      const payload = {
        userId: currentUserId,
        showtimeId: selectedShowtime.showtime_id,
        seats: seatCodesArray,
      };
      const token = localStorage.getItem("token");

      // Step 1: Save the Booking Matrix Details
      const response = await fetch(`${API_BASE}/booking/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const resultData = await response.json();
        const createdBookingId = resultData.data?.bookingId;

        if (createdBookingId) {
          // Step 2: Save the Physical Over-the-Counter Cash Transaction Details 
          const paymentPayload = {
            bookingId: createdBookingId,
            amount: calculateTotalCost(),
            paymentMethod: "CASH", // Defaulting method to cash for counter transactions
          };

          const paymentResponse = await fetch(`${API_BASE}/payment/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(paymentPayload),
          });

          if (paymentResponse.ok) {
            setStep(3);
          } else {
            const paymentError = await paymentResponse.json();
            alert(`Booking saved but payment failed to clear: ${paymentError.message}`);
            setStep(3); // Moving forward as booking is secured, but warning the terminal operator
          }
        } else {
          setStep(3);
        }
      } else {
        const errorData = await response.json();
        alert(`Order dispatch rejected: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Terminal database sync failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerSystemPrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const resetTerminal = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setBookedSeats([]);
    setStep(1);
    setIsPrinting(false);
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  // ==========================================================
  // HARDWARE CRITICAL: ISOLATED RATIO OVERRIDE RENDER PORTAL
  // ==========================================================
  if (
    isPrinting &&
    selectedMovie &&
    selectedShowtime &&
    selectedSeats.length > 0
  ) {
    return (
      <div className="absolute inset-0 bg-white text-black min-h-screen w-full z-[999999] p-0 m-0 print-portal-root">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @page { margin: 0; size: 115mm 297mm; }
          @media print {
            body * { visibility: hidden !important; }
            .print-portal-root, .print-portal-root * { visibility: visible !important; }
            .print-portal-root { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; height: 100% !important; background: #ffffff !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
          html, body { background: #ffffff !important; color: #000000 !important; overflow: visible !important; height: auto !important; margin: 0 !important; padding: 0 !important; }
          .ticket-page-break { page-break-after: always !important; break-after: page !important; display: flex !important; }
          .boarding-canvas, .boarding-canvas * { font-family: 'Share Tech Mono', monospace !important; text-transform: uppercase !important; box-sizing: border-box; letter-spacing: 0.02em; }
        `,
          }}
        />

        {selectedSeats.map((seat, index) => {
          const uniquePassToken = `ML-${selectedShowtime.showtime_id}-${seat.id}`;
          const currentDateStr = new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          return (
            <div
              key={seat.id}
              className="ticket-page-break bg-white text-black mx-auto select-none boarding-canvas flex-col items-stretch border-[2px] border-black"
              style={{
                width: "115mm",
                height: "297mm",
                backgroundColor: "#f2f2f2",
              }}
            >
              <div className="h-[28%] bg-black text-white relative flex flex-col justify-between p-4 border-b-2 border-black overflow-hidden">
                {finalHalftoneCover && (
                  <div className="absolute inset-0 z-0">
                     <img
                      src={finalHalftoneCover}
                      alt="Halftone Manifest"
                      className="w-full h-full object-cover mix-blend-lighten"
                      style={{ opacity: 0.85 }}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 z-5" />
                <div className="relative z-10 flex justify-between items-center text-[11px] tracking-wider text-zinc-300 font-bold">
                  <div>MAXLIGHT CINEMAS // FILMPASS</div>
                  <div>
                    NO. {index + 1}/{selectedSeats.length}
                  </div>
                </div>
                <div className="relative z-10 bg-black/80 p-2 border-l-4 border-white mt-auto">
                  <h2 className="text-xl tracking-wide leading-none font-bold text-white">
                    {selectedMovie.film_name}
                  </h2>
                  <span className="text-[9px] text-zinc-400 block mt-1 tracking-widest">
                    ADMISSION FRAMEWORK DIRECTIVE
                  </span>
                </div>
              </div>

              <div className="h-[44%] p-5 flex flex-col justify-between border-b-2 border-dashed border-zinc-400 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">
                      THEATER VENUE
                    </span>
                    <span className="text-sm font-bold text-black">
                      {selectedShowtime.screen_name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block">
                      CATALOG TOKEN
                    </span>
                    <span className="text-sm font-bold text-black">
                      {uniquePassToken}
                    </span>
                  </div>
                </div>

                <div className="my-auto space-y-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 tracking-wider block">
                      ASSIGNED POSITION
                    </span>
                    <h1 className="text-6xl font-black tracking-tighter text-black leading-none">
                      {seat.id}
                    </h1>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 tracking-wider block">
                      SHOWTIME INITIATION
                    </span>
                    <h1 className="text-4xl font-black tracking-tight text-black leading-none">
                      {selectedShowtime.start_time}
                    </h1>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-zinc-300">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">
                      VALIDATION DATE
                    </span>
                    <span className="text-sm font-bold text-black">
                      {currentDateStr}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block">
                      TIER SCALE
                    </span>
                    <span className="text-sm font-bold text-black">
                      {seat.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-[28%] p-5 flex flex-col justify-between bg-zinc-100/80">
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <span className="text-[9px] text-zinc-500 block">
                      FEATURE STUB
                    </span>
                    <h3 className="text-xs font-bold text-black truncate leading-tight">
                      {selectedMovie.film_name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 block">
                      PRICE DEBIT
                    </span>
                    <span className="text-xs font-bold text-black">
                      Rs. {seat.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col items-center space-y-1">
                  <div className="w-full h-10 bg-white border border-zinc-300 p-1 flex items-center justify-center overflow-hidden">
                    <div
                      className="w-full h-8 bg-repeat-x opacity-90"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 7px, #000 7px, #000 10px)",
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 tracking-widest">
                    {uniquePassToken}-{seat.id}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="text-[9px] text-zinc-500 block">
                      SEAT ID
                    </span>
                    <span className="text-sm font-bold text-black">
                      {seat.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 block">
                      DEPARTS TIME
                    </span>
                    <span className="text-sm font-bold text-black">
                      {selectedShowtime.start_time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ==========================================================
  // STANDARD OPERATION WORKSPACE VIEW CONTAINER
  // ==========================================================
  return (
    <div className="w-full space-y-4">
      {/* Action Header Banner */}
      <div className="flex justify-between items-center bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <Ticket size={16} className="text-brand-lime" /> Counter POS Cashier
            Terminal
          </h2>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
            Walk-in physical ticketing module desk setup
          </p>
        </div>
        {step > 1 && (
          <button
            onClick={resetTerminal}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-input hover:bg-foreground/[0.04] border border-border text-xs font-bold rounded-xl text-red-400"
          >
            <X size={13} /> Cancel Order
          </button>
        )}
      </div>

      {/* STEP DISPLAY FLOW RAIL */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">
        <div
          className={`p-3 rounded-xl border ${step === 1 ? "bg-brand-lime text-black border-transparent" : "bg-card border-border"}`}
        >
          1. Session Selection
        </div>
        <div
          className={`p-3 rounded-xl border ${step === 2 ? "bg-brand-lime text-black border-transparent" : "bg-card border-border"}`}
        >
          2. Manifest Seat Map
        </div>
        <div
          className={`p-3 rounded-xl border ${step === 3 ? "bg-brand-lime text-black border-transparent" : "bg-card border-border"}`}
        >
          3. Dispatch & Print
        </div>
      </div>

      {/* STAGE 1: MOVIE AND SHOWTIME SELECTOR */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Film size={13} /> Select Catalog Feature
            </h3>
            <div className="space-y-2">
              {movies.map((movie) => (
                <button
                  key={movie.film_id}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setSelectedShowtime(null);
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border text-left transition-all ${
                    selectedMovie?.film_id === movie.film_id
                      ? "bg-brand-lime/10 border-brand-lime text-foreground"
                      : "bg-input/50 border-border/70 hover:border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <img
                    src={movie.poster_image}
                    alt=""
                    className="w-10 h-14 rounded-md object-cover border bg-zinc-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black tracking-wide truncate text-foreground">
                      {movie.film_name}
                    </h4>
                    <p className="text-[10px] font-medium mt-0.5">
                      {movie.genre} • {movie.duration} min
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Calendar size={13} /> Available Showtimes
            </h3>
            {selectedMovie ? (
              <div className="space-y-2">
                {showtimes.length === 0 ? (
                  <div className="p-4 text-xs italic text-muted-foreground text-center border rounded-xl">
                    No active or future scheduling records available.
                  </div>
                ) : (
                  showtimes.map((showtime) => (
                    <button
                      key={showtime.showtime_id}
                      onClick={() => setSelectedShowtime(showtime)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        selectedShowtime?.showtime_id === showtime.showtime_id
                          ? "bg-brand-lime/10 border-brand-lime text-foreground"
                          : "bg-input/50 border-border/70 hover:border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div>
                        <span className="text-sm font-black text-foreground">
                          {showtime.start_time}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-input border border-border/80 rounded ml-2 text-muted-foreground">
                          {showtime.screen_name}
                        </span>
                      </div>
                    </button>
                  ))
                )}

                <button
                  disabled={!selectedShowtime || loading}
                  onClick={() => setStep(2)}
                  className="w-full mt-4 py-3 bg-brand-lime disabled:opacity-30 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  Configure Seating Layout <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-muted-foreground/60 italic border border-dashed border-border/60 rounded-xl">
                Please select a movie framework from the left panel first
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 2: LIVE AUDITORIUM MAP RESERVATIONS */}
      {step === 2 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div className="relative w-full max-w-md mx-auto text-center pb-4">
            <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-brand-lime/20 to-transparent rounded-full blur-xs" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block mt-1">
              PROJECTION STAGE ({selectedShowtime?.screen_name})
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-muted-foreground animate-pulse">
              Synchronizing auditorium configurations...
            </div>
          ) : (
            <div className="space-y-2.5 max-w-xl mx-auto">
              {seatingLayout.rows.map((rowName) => (
                <div key={rowName} className="flex items-center gap-3">
                  <span className="w-6 text-xs font-black font-mono text-muted-foreground text-center">
                    {rowName}
                  </span>
                  <div className="flex-1 flex flex-wrap gap-1 items-center justify-start">
                    {seatingLayout.seatsByRow[rowName]?.map((seat) => {
                      const isOccupied = bookedSeats.includes(seat.id);
                      const isDamaged = seat.status === "Damaged";
                      const isVip = seat.type === "VIP";
                      const isSelected = selectedSeats.some(
                        (s) => s.id === seat.id,
                      );

                      return (
                        <button
                          key={seat.id}
                          disabled={isDamaged || isOccupied}
                          onClick={() => toggleSeatSelection(seat)}
                          className={`h-7 w-7 rounded-md text-[9px] font-mono font-bold flex flex-col items-center justify-center border transition-all ${
                            isDamaged
                              ? "bg-red-500/10 border-red-500/30 text-red-500/40 cursor-not-allowed"
                              : isOccupied
                                ? "bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed line-through"
                                : isSelected
                                  ? "bg-brand-lime text-black border-transparent font-black scale-105 shadow-sm shadow-brand-lime/20"
                                  : isVip
                                    ? "bg-amber-500/5 border-amber-500/20 text-amber-400"
                                    : "bg-input border-border text-foreground hover:border-brand-lime/40"
                          }`}
                        >
                          <Armchair
                            size={9}
                            className={
                              isSelected
                                ? "text-black"
                                : isDamaged
                                  ? "text-red-500/20"
                                  : isOccupied
                                    ? "text-zinc-600"
                                    : isVip
                                      ? "text-amber-400/60"
                                      : "text-muted-foreground/30"
                            }
                          />
                          <span className="leading-none mt-0.5">
                            {seat.id.slice(1)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-left space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                Selected Seats Allocation
              </div>
              <div className="text-xs font-black text-foreground">
                {selectedSeats.length === 0
                  ? "None Selected"
                  : selectedSeats.map((s) => s.id).join(", ")}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Cash Due Amount
                </span>
                <span className="text-lg font-mono font-black text-brand-lime">
                  Rs. {calculateTotalCost().toFixed(2)}
                </span>
              </div>
              <button
                disabled={selectedSeats.length === 0 || loading}
                onClick={executeOrderCreation}
                className="py-2.5 px-6 bg-brand-lime disabled:opacity-30 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs"
              >
                Issue Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: DISPATCH GATEWAY & PREVIEW CONTAINER */}
      {step === 3 && (
        <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4 max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-brand-lime/10 border border-brand-lime/30 text-brand-lime flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              Order Successfully Authorized
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Ready to output hard-copy receipts and admission tokens
            </p>
          </div>

          <div className="bg-input/50 border border-border p-4 rounded-xl text-left text-xs font-semibold space-y-2 font-mono">
            <div>
              <span className="text-muted-foreground">Feature:</span>{" "}
              {selectedMovie.film_name}
            </div>
            <div>
              <span className="text-muted-foreground">Showtime:</span>{" "}
              {selectedShowtime.start_time} ({selectedShowtime.screen_name})
            </div>
            <div>
              <span className="text-muted-foreground">Total Paid:</span> Rs.{" "}
              {calculateTotalCost().toFixed(2)}
            </div>
            <div>
              <span className="text-muted-foreground">Tickets Count:</span>{" "}
              {selectedSeats.length} units
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2.5 border border-border hover:bg-foreground/[0.02] text-foreground font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Back
              </button>
              <button
                onClick={triggerSystemPrint}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-input hover:bg-foreground/[0.04] border border-border text-foreground font-black text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                <Printer size={14} /> Print PDF Sheets
              </button>
            </div>
            <button
              onClick={resetTerminal}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-brand-lime/10"
            >
              <CheckCircle2 size={15} /> Confirm Sale & Next Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
