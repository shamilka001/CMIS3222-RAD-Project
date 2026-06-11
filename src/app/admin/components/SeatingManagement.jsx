
// "use client";

// import { useState, useEffect } from "react";
// import {
//   Armchair,
//   PlusCircle,
//   Wrench,
//   ShieldCheck,
//   Gem,
//   Trash2,
//   X,
//   Info,
//   LayoutGrid,
//   Tv,
//   Settings,
//   Edit,
// } from "lucide-react";

// export default function SeatingManagement() {
//   // 1. Master Data State Managers
//   const [rawSeats, setRawSeats] = useState([]);
//   const [screens, setScreens] = useState([]);
//   const [activeScreenId, setActiveScreenId] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   // Modal Interactive States
//   const [selectedSeat, setSelectedSeat] = useState(null);
//   const [selectedScreen, setSelectedScreen] = useState(null);
//   const [isActionModalOpen, setIsActionModalOpen] = useState(false);
//   const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
//   const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
//   const [screenModalMode, setScreenModalMode] = useState("CREATE"); // "CREATE" | "UPDATE"

//   // Form Value Binders
//   const [updateType, setUpdateType] = useState("STANDARD");
//   const [bulkForm, setBulkForm] = useState({
//     rowLabel: "",
//     seatCount: 10,
//     seatType: "STANDARD",
//   });
//   const [screenForm, setScreenForm] = useState({
//     screen_name: "",
//     capacity: 100,
//     screen_type: "2D",
//   });

//   // 2. Data Synchronization Functions
//   const fetchDataPipeline = async () => {
//     try {
//       setIsLoading(true);

//       // Concurrently fetch screens and seats
//       const [screensRes, seatsRes] = await Promise.all([
//         fetch("http://localhost:5000/screen/"),
//         fetch("http://localhost:5000/seat/"),
//       ]);

//       let activeScreensList = [];

//       if (screensRes.ok) {
//         const screensResult = await screensRes.json();
//         activeScreensList = screensResult.data || [];
//         setScreens(activeScreensList);
//       }

//       if (seatsRes.ok) {
//         const seatsResult = await seatsRes.json();
//         setRawSeats(seatsResult.data || []);
//       }

//       // Default select first screen if none active
//       if (activeScreensList.length > 0 && !activeScreenId) {
//         setActiveScreenId(activeScreensList[0].screen_id);
//       }
//     } catch (error) {
//       console.error("Failed fetching configuration matrices:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDataPipeline();
//   }, []);

//   // 3. Topology Grid Matrix Compilers (Derived State)
//   const currentScreenSeats = rawSeats.filter(
//     (s) => s.screen_id === activeScreenId,
//   );

//   const activeScreenDetails = screens.find(
//     (sc) => sc.screen_id === activeScreenId,
//   );

//   const structuredRows = currentScreenSeats.reduce((acc, seat) => {
//     const row = seat.row_label;
//     if (!acc[row]) acc[row] = [];
//     acc[row].push(seat);
//     return acc;
//   }, {});

//   const sortedRowKeys = Object.keys(structuredRows).sort();
//   sortedRowKeys.forEach((row) => {
//     structuredRows[row].sort((a, b) => a.seat_number - b.seat_number);
//   });

//   // 4. SEAT OPERATIONAL CRUD HANDLERS
//   const handleSeatClick = (seat) => {
//     setSelectedSeat(seat);
//     // Ensure fallback to standard formatting uppercase strings
//     setUpdateType(seat.seat_type ? seat.seat_type.toUpperCase() : "STANDARD");
//     setIsActionModalOpen(true);
//   };

//   const handleUpdateSeatSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(
//         `http://localhost:5000/seat/${selectedSeat.seat_id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           // Sent both configurations to safely interface with backend schema types
//           body: JSON.stringify({
//             seatType: updateType,
//             seat_type: updateType,
//           }),
//         },
//       );
//       if (response.ok) {
//         setIsActionModalOpen(false);
//         fetchDataPipeline();
//       } else {
//         const errData = await response.json();
//         alert(`Failed to modify seat: ${errData.message || "Unknown error"}`);
//       }
//     } catch (error) {
//       console.error("Error patching seat configuration:", error);
//     }
//   };

//   const handleDeleteSeat = async () => {
//     if (
//       confirm(
//         `Permanently delete seat ${selectedSeat.row_label}${selectedSeat.seat_number}?`,
//       )
//     ) {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/seat/${selectedSeat.seat_id}`,
//           {
//             method: "DELETE",
//           },
//         );
//         if (response.ok) {
//           setIsActionModalOpen(false);
//           setSelectedSeat(null);
//           fetchDataPipeline();
//         } else {
//           const result = await response.json();
//           alert(`Deletion failed: ${result.message}`);
//         }
//       } catch (error) {
//         console.error("Error executing layout deletion:", error);
//       }
//     }
//   };

//   const handleBulkInsertSubmit = async (e) => {
//     e.preventDefault();

//     // --- SCREEN CAPACITY PROTECTION GUARD ---
//     if (activeScreenDetails) {
//       const currentSeatCount = currentScreenSeats.length;
//       const requestedNewSeats = parseInt(bulkForm.seatCount) || 0;
//       const maxAllowedCapacity = activeScreenDetails.capacity;

//       if (currentSeatCount + requestedNewSeats > maxAllowedCapacity) {
//         alert(
//           `Capacity Exceeded! \n\n` +
//             `Current seats: ${currentSeatCount}\n` +
//             `Requested new seats: ${requestedNewSeats}\n` +
//             `Total would be: ${currentSeatCount + requestedNewSeats}\n` +
//             `Maximum screen capacity allowed: ${maxAllowedCapacity}`,
//         );
//         return; // Terminate execution to block endpoint routing
//       }
//     }
//     // ----------------------------------------

//     try {
//       const response = await fetch("http://localhost:5000/seat/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           screenId: activeScreenId,
//           rowLabel: bulkForm.rowLabel.toUpperCase().trim(),
//           seatCount: parseInt(bulkForm.seatCount),
//           seatType: bulkForm.seatType,
//         }),
//       });
//       if (response.ok) {
//         setIsBulkModalOpen(false);
//         setBulkForm({ rowLabel: "", seatCount: 10, seatType: "STANDARD" });
//         fetchDataPipeline();
//       } else {
//         const errorData = await response.json();
//         alert(`Creation rejected: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error("Bulk layout generation crash:", error);
//     }
//   };

//   // 5. SCREEN OPERATIONAL CRUD HANDLERS
//   const openScreenCreateModal = () => {
//     setScreenModalMode("CREATE");
//     setScreenForm({ screen_name: "", capacity: 100, screen_type: "2D" });
//     setIsScreenModalOpen(true);
//   };

//   const openScreenUpdateModal = () => {
//     if (!activeScreenDetails) return;
//     setScreenModalMode("UPDATE");
//     setScreenForm({
//       screen_name: activeScreenDetails.screen_name,
//       capacity: activeScreenDetails.capacity,
//       screen_type: activeScreenDetails.screen_type,
//     });
//     setIsScreenModalOpen(true);
//   };

//   const handleScreenFormSubmit = async (e) => {
//     e.preventDefault();
//     const url =
//       screenModalMode === "CREATE"
//         ? "http://localhost:5000/screen/"
//         : `http://localhost:5000/screen/${activeScreenId}`;
//     const method = screenModalMode === "CREATE" ? "POST" : "PUT";

//     try {
//       const response = await fetch(url, {
//         method: method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(screenForm),
//       });

//       if (response.ok) {
//         const resData = await response.json();
//         setIsScreenModalOpen(false);
//         if (screenModalMode === "CREATE" && resData.screen_id) {
//           setActiveScreenId(resData.screen_id);
//         }
//         fetchDataPipeline();
//       } else {
//         const errData = await response.json();
//         alert(`Screen operation failed: ${errData.message}`);
//       }
//     } catch (error) {
//       console.error("Screen backend execution failure:", error);
//     }
//   };

//   const handleDeleteScreen = async () => {
//     if (!activeScreenId) return;
//     if (
//       confirm(
//         `DANGER: Permanently delete ${activeScreenDetails?.screen_name}? This action unlinks metadata schemas across structural relational components.`,
//       )
//     ) {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/screen/${activeScreenId}`,
//           {
//             method: "DELETE",
//           },
//         );
//         if (response.ok) {
//           setActiveScreenId("");
//           fetchDataPipeline();
//         } else {
//           const errData = await response.json();
//           alert(`Deletion rejected: ${errData.message}`);
//         }
//       } catch (error) {
//         console.error("Error executing screen drops:", error);
//       }
//     }
//   };

//   return (
//     <div className="w-full space-y-4 animate-fadeIn">
//       {/* ---------------- CONTROL PANEL MODULE ---------------- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
//         {/* Read Screen - Dropdown Context Switcher */}
//         <div className="space-y-2 col-span-1 md:col-span-2">
//           <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
//             <Tv size={12} /> Active Projection Auditorium
//           </label>
//           <div className="flex flex-wrap gap-1.5 bg-input p-1 rounded-xl border border-border">
//             {screens.length === 0 ? (
//               <span className="text-xs text-muted-foreground p-1.5 italic">
//                 No operational screens configured...
//               </span>
//             ) : (
//               screens.map((sc) => (
//                 <button
//                   key={sc.screen_id}
//                   type="button"
//                   onClick={() => setActiveScreenId(sc.screen_id)}
//                   className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 text-center truncate ${
//                     activeScreenId === sc.screen_id
//                       ? "bg-brand-lime text-black font-black"
//                       : "text-muted-foreground hover:text-foreground"
//                   }`}
//                 >
//                   {sc.screen_name} ({sc.screen_type})
//                 </button>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Global Pipeline Generation Controls & Screen Modifiers */}
//         <div className="space-y-2 flex flex-col justify-end col-span-1">
//           <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block md:text-right">
//             Infrastructure Configuration Controls
//           </label>
//           <div className="flex flex-wrap gap-2 md:justify-end">
//             <button
//               type="button"
//               onClick={openScreenCreateModal}
//               className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-input border border-border text-foreground hover:border-muted-foreground transition-all rounded-xl font-bold text-xs"
//               title="Configure New Screen Vector"
//             >
//               <PlusCircle size={13} /> Add Screen
//             </button>

//             <button
//               type="button"
//               disabled={!activeScreenId}
//               onClick={openScreenUpdateModal}
//               className="px-3 py-2 bg-input border border-border text-foreground hover:border-muted-foreground disabled:opacity-40 transition-all rounded-xl font-bold text-xs"
//               title="Modify Selected Auditorium Schema"
//             >
//               <Settings size={13} />
//             </button>

//             <button
//               type="button"
//               disabled={!activeScreenId}
//               onClick={handleDeleteScreen}
//               className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-40 transition-all rounded-xl font-bold text-xs"
//               title="Purge Active Screen Hierarchy"
//             >
//               <Trash2 size={13} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Screen Analytics Banner Bar */}
//       {activeScreenDetails && (
//         <div className="flex flex-wrap justify-between items-center px-5 py-2.5 bg-input/40 border border-border rounded-xl text-[11px] text-muted-foreground font-mono">
//           <div>
//             Auditorium ID:{" "}
//             <span className="text-foreground font-bold">
//               {activeScreenDetails.screen_id}
//             </span>
//           </div>
//           <div className="flex gap-4">
//             <div>
//               Baseline Capacity Threshold:{" "}
//               <span className="text-foreground font-bold">
//                 {currentScreenSeats.length} / {activeScreenDetails.capacity}
//               </span>
//             </div>
//             <div>
//               Format Matrix:{" "}
//               <span className="text-brand-lime font-black">
//                 {activeScreenDetails.screen_type}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ---------------- WORKSPACE VIEW CANVAS ---------------- */}
//       <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden shadow-xs">
//         <div className="absolute top-4 right-4">
//           <button
//             type="button"
//             disabled={!activeScreenId}
//             onClick={() => setIsBulkModalOpen(true)}
//             className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-lime text-black font-black text-xs rounded-xl hover:opacity-90 disabled:opacity-40 transition-all whitespace-nowrap shadow-xs"
//           >
//             <PlusCircle size={14} /> Batch Generate Seats
//           </button>
//         </div>

//         {/* Curved Theater Screen UI Boundary */}
//         <div className="relative w-full max-w-lg mx-auto text-center pb-12 pt-4">
//           <div className="w-full h-2.5 bg-gradient-to-r from-transparent via-brand-lime/20 to-transparent rounded-full blur-xs" />
//           <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mt-1" />
//           <span className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block mt-2.5">
//             PROJECTION FRONT SCREEN ALIGNMENT BOUNDARY
//           </span>
//         </div>

//         {isLoading ? (
//           <div className="p-16 text-center text-xs text-muted-foreground animate-pulse font-mono tracking-widest">
//             SYNCHRONIZING THEATER INFRASTRUCTURE SCHEMAS...
//           </div>
//         ) : sortedRowKeys.length === 0 ? (
//           <div className="p-16 text-center border border-dashed border-border rounded-xl bg-input/10">
//             <LayoutGrid
//               className="mx-auto mb-2 text-muted-foreground/30"
//               size={28}
//             />
//             <p className="text-xs text-muted-foreground font-medium">
//               No layout nodes registered on this terminal projection vector.
//             </p>
//           </div>
//         ) : (
//           /* Dynamic Layout Generation Matrix loop */
//           <div className="space-y-3.5 max-w-4xl mx-auto">
//             {sortedRowKeys.map((rowName) => (
//               <div
//                 key={rowName}
//                 className="flex items-center gap-4 p-2 bg-input/15 border border-border/40 rounded-xl hover:border-border/90 transition-all group"
//               >
//                 <div className="flex items-center gap-1.5 w-12 select-none justify-center">
//                   <span className="text-sm font-black font-mono text-muted-foreground">
//                     {rowName}
//                   </span>
//                   <span className="text-[8px] font-mono px-1 py-0.5 bg-input border border-border/80 rounded text-muted-foreground/60">
//                     {structuredRows[rowName].length}
//                   </span>
//                 </div>

//                 <div className="flex-1 flex flex-wrap gap-2 items-center justify-start px-2">
//                   {structuredRows[rowName].map((seat) => {
//                     // Safe string normalizer validation configuration to capture both cases cleanly
//                     const typeNormalized = seat.seat_type
//                       ? seat.seat_type.toUpperCase()
//                       : "STANDARD";
//                     const isDamaged = typeNormalized === "DAMAGE";
//                     const isVIP = typeNormalized === "VIP";

//                     return (
//                       <button
//                         key={seat.seat_id}
//                         type="button"
//                         onClick={() => handleSeatClick(seat)}
//                         className={`h-9 w-9 rounded-lg text-[9px] font-mono font-bold flex flex-col items-center justify-center border transition-all shadow-xs relative group/seat ${
//                           isDamaged
//                             ? "bg-red-500/20 border-red-500/50 text-red-400 font-black animate-pulse hover:bg-red-500/30"
//                             : isVIP
//                               ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-black hover:bg-amber-500/20"
//                               : "bg-input border-border text-foreground hover:border-brand-lime"
//                         }`}
//                         title={`ID: ${seat.seat_id} | Type: ${typeNormalized}`}
//                       >
//                         <Armchair
//                           size={11}
//                           className={
//                             isDamaged
//                               ? "text-red-400"
//                               : isVIP
//                                 ? "text-amber-400"
//                                 : "text-muted-foreground/30"
//                           }
//                         />
//                         <span className="text-[9px] mt-0.5 font-bold">
//                           {rowName}
//                           {seat.seat_number}
//                         </span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Legend Mapping guide footer */}
//         <div className="mt-10 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4 text-[10px] font-semibold text-muted-foreground font-mono select-none">
//           <div className="flex flex-wrap gap-5">
//             <div className="flex items-center gap-2">
//               <span className="w-4 h-4 rounded bg-input border border-border block" />
//               <span>Standard Tier</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="w-4 h-4 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
//                 <Gem size={9} />
//               </span>
//               <span>VIP Deck</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="w-4 h-4 rounded bg-red-500/20 border border-red-500/40 block animate-pulse" />
//               <span className="text-red-400 font-bold">
//                 DAMAGE Array (Offline)
//               </span>
//             </div>
//           </div>
//           <span className="text-[9px] uppercase tracking-wider font-bold text-brand-lime">
//             Select internal coordinate nodes to route modification requests
//           </span>
//         </div>
//       </div>

//       {/* ---------------- MODAL 1: SINGLE SEAT MAINTENANCE (Update/Delete Seat) ---------------- */}
//       {isActionModalOpen && selectedSeat && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-card border border-border w-full max-w-sm rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center gap-2">
//                 <Info size={14} className="text-brand-lime" />
//                 <h3 className="text-xs font-bold uppercase tracking-wider">
//                   Update Seat: {selectedSeat.row_label}
//                   {selectedSeat.seat_number}
//                 </h3>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setIsActionModalOpen(false)}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 <X size={16} />
//               </button>
//             </div>

//             <div className="p-3.5 bg-input/40 border border-border rounded-xl space-y-1 mb-5 font-mono text-[10px] text-muted-foreground">
//               <p>
//                 Seat Key Token:{" "}
//                 <span className="text-foreground font-bold">
//                   {selectedSeat.seat_id}
//                 </span>
//               </p>
//             </div>

//             <form onSubmit={handleUpdateSeatSubmit} className="space-y-4">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block">
//                   Allocation Classification
//                 </label>
//                 <select
//                   value={updateType}
//                   onChange={(e) => setUpdateType(e.target.value.toUpperCase())}
//                   className="w-full bg-input border border-border text-xs rounded-xl px-4 py-3 text-foreground font-bold"
//                 >
//                   <option value="STANDARD">STANDARD SEAT</option>
//                   <option value="VIP">VIP RECLINER</option>
//                   <option value="DAMAGE">DAMAGE (OFFLINE)</option>
//                 </select>
//               </div>

//               <div className="grid grid-cols-5 gap-2 pt-2">
//                 <button
//                   type="submit"
//                   className="col-span-4 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all"
//                 >
//                   Save Adjustments
//                 </button>
//                 {/* <button
//                   type="button"
//                   onClick={handleDeleteSeat}
//                   className="col-span-1 flex items-center justify-center py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl transition-all"
//                 >
//                   <Trash2 size={15} />
//                 </button> */}
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ---------------- MODAL 2: BULK MULTI-SEAT GENERATOR (Create Seats) ---------------- */}
//       {isBulkModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
//             <div className="flex justify-between items-center mb-5">
//               <h3 className="text-xs font-bold uppercase tracking-wider">
//                 Batch Generate Structural Seat Arrays
//               </h3>
//               <button
//                 type="button"
//                 onClick={() => setIsBulkModalOpen(false)}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 <X size={16} />
//               </button>
//             </div>

//             <form
//               onSubmit={handleBulkInsertSubmit}
//               className="space-y-4 text-xs"
//             >
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                     Target Row Label
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     maxLength={2}
//                     placeholder="e.g. E"
//                     value={bulkForm.rowLabel}
//                     onChange={(e) =>
//                       setBulkForm({ ...bulkForm, rowLabel: e.target.value })
//                     }
//                     className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground uppercase font-mono font-bold"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                     Seat Node Count
//                   </label>
//                   <input
//                     type="number"
//                     required
//                     min={1}
//                     max={30}
//                     value={bulkForm.seatCount}
//                     onChange={(e) =>
//                       setBulkForm({ ...bulkForm, seatCount: e.target.value })
//                     }
//                     className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-mono font-bold"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                   Bulk Seat Baseline Type
//                 </label>
//                 <select
//                   value={bulkForm.seatType}
//                   onChange={(e) =>
//                     setBulkForm({
//                       ...bulkForm,
//                       seatType: e.target.value.toUpperCase(),
//                     })
//                   }
//                   className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-bold"
//                 >
//                   <option value="STANDARD">STANDARD SEATING VECTOR</option>
//                   <option value="VIP">VIP PREMIUM RECLINERS</option>
//                   <option value="DAMAGE">DAMAGE STRUCTURAL REJECT</option>
//                 </select>
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   className="w-full py-3 bg-brand-lime text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all hover:opacity-90"
//                 >
//                   Execute Batch Database Insertion
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ---------------- MODAL 3: SCREEN INFRASTRUCTURE MAINTAINER (Create/Update Screen) ---------------- */}
//       {isScreenModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-card border border-border w-full max-w-sm rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
//                 <Settings size={13} className="text-brand-lime" />
//                 {screenModalMode === "CREATE"
//                   ? "Deploy New Auditorium Screen"
//                   : "Modify Screen Schema Options"}
//               </h3>
//               <button
//                 type="button"
//                 onClick={() => setIsScreenModalOpen(false)}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 <X size={16} />
//               </button>
//             </div>

//             <form
//               onSubmit={handleScreenFormSubmit}
//               className="space-y-4 text-xs"
//             >
//               <div>
//                 <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                   Auditorium Screen Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="e.g. Screen IMAX 01"
//                   value={screenForm.screen_name}
//                   onChange={(e) =>
//                     setScreenForm({
//                       ...screenForm,
//                       screen_name: e.target.value,
//                     })
//                   }
//                   className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-bold"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                     Capacity Limit
//                   </label>
//                   <input
//                     type="number"
//                     required
//                     min={10}
//                     max={500}
//                     value={screenForm.capacity}
//                     onChange={(e) =>
//                       setScreenForm({
//                         ...screenForm,
//                         capacity: parseInt(e.target.value) || 0,
//                       })
//                     }
//                     className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-mono font-bold"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
//                     Projection Format
//                   </label>
//                   <select
//                     value={screenForm.screen_type}
//                     onChange={(e) =>
//                       setScreenForm({
//                         ...screenForm,
//                         screen_type: e.target.value,
//                       })
//                     }
//                     className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-bold"
//                   >
//                     <option value="2D">Standard 2D</option>
//                     <option value="3D">Digital 3D</option>
//                     <option value="IMAX">IMAX Theater</option>
//                     <option value="4DX">4DX Experience</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   className="w-full py-3 bg-brand-lime text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all hover:opacity-90"
//                 >
//                   {screenModalMode === "CREATE"
//                     ? "Commit Screen Map Initialization"
//                     : "Save Structural Schema"}
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

import { useState, useEffect } from "react";
import {
  Armchair,
  PlusCircle,
  Wrench,
  ShieldCheck,
  Gem,
  Trash2,
  X,
  Info,
  LayoutGrid,
  Tv,
  Settings,
  Edit,
} from "lucide-react";

export default function SeatingManagement() {
  // 1. Master Data State Managers
  const [rawSeats, setRawSeats] = useState([]);
  const [screens, setScreens] = useState([]);
  const [activeScreenId, setActiveScreenId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal Interactive States
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  const [screenModalMode, setScreenModalMode] = useState("CREATE"); // "CREATE" | "UPDATE"

  // Form Value Binders
  const [updateType, setUpdateType] = useState("STANDARD");
  const [bulkForm, setBulkForm] = useState({
    rowLabel: "",
    seatCount: 10,
    seatType: "STANDARD",
  });
  const [screenForm, setScreenForm] = useState({
    screen_name: "",
    capacity: 100,
    screen_type: "2D",
    status: "active",
  });

  // 2. Data Synchronization Functions
  const fetchDataPipeline = async () => {
    try {
      setIsLoading(true);

      // Concurrently fetch screens and seats
      const [screensRes, seatsRes] = await Promise.all([
        fetch("http://localhost:5000/screen/"),
        fetch("http://localhost:5000/seat/"),
      ]);

      let activeScreensList = [];

      if (screensRes.ok) {
        const screensResult = await screensRes.json();
        activeScreensList = screensResult.data || [];
        setScreens(activeScreensList);
      }

      if (seatsRes.ok) {
        const seatsResult = await seatsRes.json();
        setRawSeats(seatsResult.data || []);
      }

      // Default select first screen if none active
      if (activeScreensList.length > 0 && !activeScreenId) {
        setActiveScreenId(activeScreensList[0].screen_id);
      }
    } catch (error) {
      console.error("Failed fetching configuration matrices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataPipeline();
  }, []);

  // 3. Topology Grid Matrix Compilers (Derived State)
  const currentScreenSeats = rawSeats.filter(
    (s) => s.screen_id === activeScreenId,
  );

  const activeScreenDetails = screens.find(
    (sc) => sc.screen_id === activeScreenId,
  );

  const structuredRows = currentScreenSeats.reduce((acc, seat) => {
    const row = seat.row_label;
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRowKeys = Object.keys(structuredRows).sort();
  sortedRowKeys.forEach((row) => {
    structuredRows[row].sort((a, b) => a.seat_number - b.seat_number);
  });

  // 4. SEAT OPERATIONAL CRUD HANDLERS
  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    // Ensure fallback to standard formatting uppercase strings
    setUpdateType(seat.seat_type ? seat.seat_type.toUpperCase() : "STANDARD");
    setIsActionModalOpen(true);
  };

  const handleUpdateSeatSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/seat/${selectedSeat.seat_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // Sent both configurations to safely interface with backend schema types
          body: JSON.stringify({
            seatType: updateType,
            seat_type: updateType,
          }),
        },
      );
      if (response.ok) {
        setIsActionModalOpen(false);
        fetchDataPipeline();
      } else {
        const errData = await response.json();
        alert(`Failed to modify seat: ${errData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error patching seat configuration:", error);
    }
  };

  const handleDeleteSeat = async () => {
    if (
      confirm(
        `Permanently delete seat ${selectedSeat.row_label}${selectedSeat.seat_number}?`,
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/seat/${selectedSeat.seat_id}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          setIsActionModalOpen(false);
          setSelectedSeat(null);
          fetchDataPipeline();
        } else {
          const result = await response.json();
          alert(`Deletion failed: ${result.message}`);
        }
      } catch (error) {
        console.error("Error executing layout deletion:", error);
      }
    }
  };

  const handleBulkInsertSubmit = async (e) => {
    e.preventDefault();

    // --- SCREEN CAPACITY PROTECTION GUARD ---
    if (activeScreenDetails) {
      const currentSeatCount = currentScreenSeats.length;
      const requestedNewSeats = parseInt(bulkForm.seatCount) || 0;
      const maxAllowedCapacity = activeScreenDetails.capacity;

      if (currentSeatCount + requestedNewSeats > maxAllowedCapacity) {
        alert(
          `Capacity Exceeded! \n\n` +
            `Current seats: ${currentSeatCount}\n` +
            `Requested new seats: ${requestedNewSeats}\n` +
            `Total would be: ${currentSeatCount + requestedNewSeats}\n` +
            `Maximum screen capacity allowed: ${maxAllowedCapacity}`,
        );
        return; // Terminate execution to block endpoint routing
      }
    }
    // ----------------------------------------

    try {
      const response = await fetch("http://localhost:5000/seat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screenId: activeScreenId,
          rowLabel: bulkForm.rowLabel.toUpperCase().trim(),
          seatCount: parseInt(bulkForm.seatCount),
          seatType: bulkForm.seatType,
        }),
      });
      if (response.ok) {
        setIsBulkModalOpen(false);
        setBulkForm({ rowLabel: "", seatCount: 10, seatType: "STANDARD" });
        fetchDataPipeline();
      } else {
        const errorData = await response.json();
        alert(`Creation rejected: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Bulk layout generation crash:", error);
    }
  };

  // 5. SCREEN OPERATIONAL CRUD HANDLERS
  const openScreenCreateModal = () => {
    setScreenModalMode("CREATE");
    setScreenForm({ screen_name: "", capacity: 100, screen_type: "2D", status: "active" });
    setIsScreenModalOpen(true);
  };

  const openScreenUpdateModal = () => {
    if (!activeScreenDetails) return;
    setScreenModalMode("UPDATE");
    setScreenForm({
      screen_name: activeScreenDetails.screen_name,
      capacity: activeScreenDetails.capacity,
      screen_type: activeScreenDetails.screen_type,
      status: activeScreenDetails.status || "active",
    });
    setIsScreenModalOpen(true);
  };

  const handleScreenFormSubmit = async (e) => {
    e.preventDefault();
    const url =
      screenModalMode === "CREATE"
        ? "http://localhost:5000/screen/"
        : `http://localhost:5000/screen/update/${activeScreenId}`;
    const method = screenModalMode === "CREATE" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(screenForm),
      });

      if (response.ok) {
        const resData = await response.json();
        setIsScreenModalOpen(false);
        if (screenModalMode === "CREATE" && resData.screen_id) {
          setActiveScreenId(resData.screen_id);
        }
        fetchDataPipeline();
      } else {
        const errData = await response.json();
        alert(`Screen operation failed: ${errData.message}`);
      }
    } catch (error) {
      console.error("Screen backend execution failure:", error);
    }
  };

  const handleDeleteScreen = async () => {
    if (!activeScreenId) return;
    if (
      confirm(
        `DANGER: Permanently delete ${activeScreenDetails?.screen_name}? This action unlinks metadata schemas across structural relational components.`,
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/screen/${activeScreenId}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          setActiveScreenId("");
          fetchDataPipeline();
        } else {
          const errData = await response.json();
          alert(`Deletion rejected: ${errData.message}`);
        }
      } catch (error) {
        console.error("Error executing screen drops:", error);
      }
    }
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      {/* ---------------- CONTROL PANEL MODULE ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        {/* Read Screen - Dropdown Context Switcher */}
        <div className="space-y-2 col-span-1 md:col-span-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Tv size={12} /> Active Projection Auditorium
          </label>
          <div className="flex flex-wrap gap-1.5 bg-input p-1 rounded-xl border border-border">
            {screens.length === 0 ? (
              <span className="text-xs text-muted-foreground p-1.5 italic">
                No operational screens configured...
              </span>
            ) : (
              screens.map((sc) => (
                <button
                  key={sc.screen_id}
                  type="button"
                  onClick={() => setActiveScreenId(sc.screen_id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 text-center truncate relative ${
                    activeScreenId === sc.screen_id
                      ? "bg-brand-lime text-black font-black"
                      : sc.status === "deactive"
                        ? "text-red-400/70 hover:text-foreground bg-red-500/5 border border-dashed border-red-500/20"
                        : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sc.screen_name} ({sc.screen_type})
                  {sc.status === "deactive" && (
                    <span className="ml-1 text-[8px] font-mono px-1 py-0.2 bg-red-500/20 rounded text-red-400 font-extrabold uppercase">
                      Off
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Global Pipeline Generation Controls & Screen Modifiers */}
        <div className="space-y-2 flex flex-col justify-end col-span-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block md:text-right">
            Infrastructure Configuration Controls
          </label>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              type="button"
              onClick={openScreenCreateModal}
              className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-input border border-border text-foreground hover:border-muted-foreground transition-all rounded-xl font-bold text-xs"
              title="Configure New Screen Vector"
            >
              <PlusCircle size={13} /> Add Screen
            </button>

            <button
              type="button"
              disabled={!activeScreenId}
              onClick={openScreenUpdateModal}
              className="px-3 py-2 bg-input border border-border text-foreground hover:border-muted-foreground disabled:opacity-40 transition-all rounded-xl font-bold text-xs"
              title="Modify Selected Auditorium Schema"
            >
              <Settings size={13} />
            </button>

            <button
              type="button"
              disabled={!activeScreenId}
              onClick={handleDeleteScreen}
              className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-40 transition-all rounded-xl font-bold text-xs"
              title="Purge Active Screen Hierarchy"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Screen Analytics Banner Bar */}
      {activeScreenDetails && (
        <div className="flex flex-wrap justify-between items-center px-5 py-2.5 bg-input/40 border border-border rounded-xl text-[11px] text-muted-foreground font-mono">
          <div className="flex items-center gap-3">
            <div>
              Auditorium ID:{" "}
              <span className="text-foreground font-bold">
                {activeScreenDetails.screen_id}
              </span>
            </div>
            <div className="flex items-center gap-1">
              Status:{" "}
              {activeScreenDetails.status === "deactive" ? (
                <span className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[9px] text-red-400 font-bold uppercase">
                  Deactive
                </span>
              ) : (
                <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-400 font-bold uppercase">
                  Active
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              Baseline Capacity Threshold:{" "}
              <span className="text-foreground font-bold">
                {currentScreenSeats.length} / {activeScreenDetails.capacity}
              </span>
            </div>
            <div>
              Format Matrix:{" "}
              <span className="text-brand-lime font-black">
                {activeScreenDetails.screen_type}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- WORKSPACE VIEW CANVAS ---------------- */}
      <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="absolute top-4 right-4">
          <button
            type="button"
            disabled={!activeScreenId}
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-lime text-black font-black text-xs rounded-xl hover:opacity-90 disabled:opacity-40 transition-all whitespace-nowrap shadow-xs"
          >
            <PlusCircle size={14} /> Batch Generate Seats
          </button>
        </div>

        {/* Curved Theater Screen UI Boundary */}
        <div className="relative w-full max-w-lg mx-auto text-center pb-12 pt-4">
          <div className="w-full h-2.5 bg-gradient-to-r from-transparent via-brand-lime/20 to-transparent rounded-full blur-xs" />
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mt-1" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block mt-2.5">
            PROJECTION FRONT SCREEN ALIGNMENT BOUNDARY
          </span>
        </div>

        {isLoading ? (
          <div className="p-16 text-center text-xs text-muted-foreground animate-pulse font-mono tracking-widest">
            SYNCHRONIZING THEATER INFRASTRUCTURE SCHEMAS...
          </div>
        ) : sortedRowKeys.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-border rounded-xl bg-input/10">
            <LayoutGrid
              className="mx-auto mb-2 text-muted-foreground/30"
              size={28}
            />
            <p className="text-xs text-muted-foreground font-medium">
              No layout nodes registered on this terminal projection vector.
            </p>
          </div>
        ) : (
          /* Dynamic Layout Generation Matrix loop */
          <div className="space-y-3.5 max-w-4xl mx-auto">
            {sortedRowKeys.map((rowName) => (
              <div
                key={rowName}
                className={`flex items-center gap-4 p-2 border border-border/40 rounded-xl hover:border-border/90 transition-all group ${
                  activeScreenDetails?.status === "deactive" ? "opacity-60 bg-red-500/[0.01]" : "bg-input/15"
                }`}
              >
                <div className="flex items-center gap-1.5 w-12 select-none justify-center">
                  <span className="text-sm font-black font-mono text-muted-foreground">
                    {rowName}
                  </span>
                  <span className="text-[8px] font-mono px-1 py-0.5 bg-input border border-border/80 rounded text-muted-foreground/60">
                    {structuredRows[rowName].length}
                  </span>
                </div>

                <div className="flex-1 flex flex-wrap gap-2 items-center justify-start px-2">
                  {structuredRows[rowName].map((seat) => {
                    // Safe string normalizer validation configuration to capture both cases cleanly
                    const typeNormalized = seat.seat_type
                      ? seat.seat_type.toUpperCase()
                      : "STANDARD";
                    const isDamaged = typeNormalized === "DAMAGE";
                    const isVIP = typeNormalized === "VIP";

                    return (
                      <button
                        key={seat.seat_id}
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        className={`h-9 w-9 rounded-lg text-[9px] font-mono font-bold flex flex-col items-center justify-center border transition-all shadow-xs relative group/seat ${
                          isDamaged
                            ? "bg-red-500/20 border-red-500/50 text-red-400 font-black animate-pulse hover:bg-red-500/30"
                            : isVIP
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-black hover:bg-amber-500/20"
                              : "bg-input border-border text-foreground hover:border-brand-lime"
                        }`}
                        title={`ID: ${seat.seat_id} | Type: ${typeNormalized}`}
                      >
                        <Armchair
                          size={11}
                          className={
                            isDamaged
                              ? "text-red-400"
                              : isVIP
                                ? "text-amber-400"
                                : "text-muted-foreground/30"
                          }
                        />
                        <span className="text-[9px] mt-0.5 font-bold">
                          {rowName}
                          {seat.seat_number}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend Mapping guide footer */}
        <div className="mt-10 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4 text-[10px] font-semibold text-muted-foreground font-mono select-none">
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-input border border-border block" />
              <span>Standard Tier</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Gem size={9} />
              </span>
              <span>VIP Deck</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-500/20 border border-red-500/40 block animate-pulse" />
              <span className="text-red-400 font-bold">
                DAMAGE Array (Offline)
              </span>
            </div>
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-brand-lime">
            Select internal coordinate nodes to route modification requests
          </span>
        </div>
      </div>

      {/* ---------------- MODAL 1: SINGLE SEAT MAINTENANCE (Update/Delete Seat) ---------------- */}
      {isActionModalOpen && selectedSeat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-sm rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-brand-lime" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Update Seat: {selectedSeat.row_label}
                  {selectedSeat.seat_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsActionModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3.5 bg-input/40 border border-border rounded-xl space-y-1 mb-5 font-mono text-[10px] text-muted-foreground">
              <p>
                Seat Key Token:{" "}
                <span className="text-foreground font-bold">
                  {selectedSeat.seat_id}
                </span>
              </p>
            </div>

            <form onSubmit={handleUpdateSeatSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground block">
                  Allocation Classification
                </label>
                <select
                  value={updateType}
                  onChange={(e) => setUpdateType(e.target.value.toUpperCase())}
                  className="w-full bg-input border border-border text-xs rounded-xl px-4 py-3 text-foreground font-bold"
                >
                  <option value="STANDARD">STANDARD SEAT</option>
                  <option value="VIP">VIP RECLINER</option>
                  <option value="DAMAGE">DAMAGE (OFFLINE)</option>
                </select>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-2">
                <button
                  type="submit"
                  className="col-span-4 py-3 bg-brand-lime text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all"
                >
                  Save Adjustments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: BULK MULTI-SEAT GENERATOR (Create Seats) ---------------- */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Batch Generate Structural Seat Arrays
              </h3>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleBulkInsertSubmit}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Target Row Label
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="e.g. E"
                    value={bulkForm.rowLabel}
                    onChange={(e) =>
                      setBulkForm({ ...bulkForm, rowLabel: e.target.value })
                    }
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Seat Node Count
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={30}
                    value={bulkForm.seatCount}
                    onChange={(e) =>
                      setBulkForm({ ...bulkForm, seatCount: e.target.value })
                    }
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Bulk Seat Baseline Type
                </label>
                <select
                  value={bulkForm.seatType}
                  onChange={(e) =>
                    setBulkForm({
                      ...bulkForm,
                      seatType: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-bold"
                >
                  <option value="STANDARD">STANDARD SEATING VECTOR</option>
                  <option value="VIP">VIP PREMIUM RECLINERS</option>
                  <option value="DAMAGE">DAMAGE STRUCTURAL REJECT</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-lime text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all hover:opacity-90"
                >
                  Execute Batch Database Insertion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: SCREEN INFRASTRUCTURE MAINTAINER (Create/Update Screen) ---------------- */}
      {isScreenModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-sm rounded-3xl p-6 shadow-xl relative text-foreground animate-scaleUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Settings size={13} className="text-brand-lime" />
                {screenModalMode === "CREATE"
                  ? "Deploy New Auditorium Screen"
                  : "Modify Screen Schema Options"}
              </h3>
              <button
                type="button"
                onClick={() => setIsScreenModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleScreenFormSubmit}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Auditorium Screen Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Screen IMAX 01"
                  value={screenForm.screen_name}
                  onChange={(e) =>
                    setScreenForm({
                      ...screenForm,
                      screen_name: e.target.value,
                    })
                  }
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Capacity Limit
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={500}
                    value={screenForm.capacity}
                    onChange={(e) =>
                      setScreenForm({
                        ...screenForm,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Projection Format
                  </label>
                  <select
                    value={screenForm.screen_type}
                    onChange={(e) =>
                      setScreenForm({
                        ...screenForm,
                        screen_type: e.target.value,
                      })
                    }
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-bold"
                  >
                    <option value="2D">Standard 2D</option>
                    <option value="3D">Digital 3D</option>
                    <option value="IMAX">IMAX Theater</option>
                    <option value="4DX">4DX Experience</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Operating Framework Channel Status
                </label>
                <select
                  value={screenForm.status}
                  onChange={(e) =>
                    setScreenForm({
                      ...screenForm,
                      status: e.target.value,
                    })
                  }
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground font-bold focus:outline-none"
                >
                  <option value="active">Active (Online Access Open)</option>
                  <option value="deactive">Deactive (Maintenance Hold)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-lime text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all hover:opacity-90"
                >
                  {screenModalMode === "CREATE"
                    ? "Commit Screen Map Initialization"
                    : "Save Structural Schema"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}