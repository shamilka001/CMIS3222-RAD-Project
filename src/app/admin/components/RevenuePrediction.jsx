
// "use client";

// import { useState } from "react";
// import {
//   BarChart, Bar, LineChart, Line, XAxis, YAxis,
//   CartesianGrid, Tooltip, ResponsiveContainer
// } from "recharts";

// const GENRE_MAPPING = [
//   { name: "Action", encoded: 0 },
//   { name: "Comedy", encoded: 1 },
//   { name: "Drama", encoded: 2 },
//   { name: "Horror", encoded: 3 },
//   { name: "Sci-Fi", encoded: 4 }
// ];

// const AVAILABLE_TIMES = [
//   { label: "10 AM", value: 10 },
//   { label: "12 PM", value: 12 },
//   { label: "2 PM", value: 14 },
//   { label: "4 PM", value: 16 },
//   { label: "6 PM", value: 18 },
//   { label: "7 PM", value: 19 }
// ];

// export default function CinemaDashboard() {
//   // Common Settings
//   const [ticketPrice, setTicketPrice] = useState(15);
//   const [capacity, setCapacity] = useState(200);

//   // Model A State Variables (Revenue Model)
//   const [genreEncoded, setGenreEncoded] = useState(0);
//   const [selectedTimes, setSelectedTimes] = useState([10, 14, 18]);
//   const [day, setDay] = useState(5);
//   const [quarter, setQuarter] = useState(3);
//   const [revenueData, setRevenueData] = useState([]);

//   // Model B State Variables (Target Audience Model)
//   const [targetAge, setTargetAge] = useState(25);
//   const [groupSize, setGroupSize] = useState(1);
//   const [seatType, setSeatType] = useState(1);
//   const [audienceResult, setAudienceResult] = useState(null);

//   // Model C State Variables (Pre-Release Cinema Potential Model)
//   const [movieTitle, setMovieTitle] = useState("Avatar 3: The Seed Bearer");
//   const [movieGenres, setMovieGenres] = useState("Action|Sci-Fi|Adventure");
//   const [movieBudget, setMovieBudget] = useState(250000000);
//   const [movieRuntime, setMovieRuntime] = useState(160);
//   const [moviePopularity, setMoviePopularity] = useState(85.5);
//   const [releaseYear, setReleaseYear] = useState(2025);
//   const [cinemaTierResult, setCinemaTierResult] = useState(null);

//   // Loading & Error Handling States
//   const [loadingRevenue, setLoadingRevenue] = useState(false);
//   const [loadingAudience, setLoadingAudience] = useState(false);
//   const [loadingCinema, setLoadingCinema] = useState(false);
//   const [error, setError] = useState(null);

//   const handleTimeChange = (timeValue) => {
//     setSelectedTimes(prev =>
//       prev.includes(timeValue) ? prev.filter((t) => t !== timeValue) : [...prev, timeValue]
//     );
//   };

//   // 1. Forecast Revenue (Pipeline Engine A)
//   const runRevenueForecast = async (e) => {
//     e.preventDefault();
//     setLoadingRevenue(true);
//     setError(null);
//     try {
//       const res = await fetch("http://127.0.0.1:8090/predict-revenue", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           genre_encoded: genreEncoded,
//           times: selectedTimes,
//           day,
//           ticket_price: ticketPrice,
//           capacity,
//           quarter
//         }),
//       });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message);
//       setRevenueData(result.predictions.sort((a, b) => a.show_time_raw - b.show_time_raw));
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingRevenue(false);
//     }
//   };

//   // 2. Forecast Target Audience (Pipeline Engine B)
//   const runAudienceForecast = async (e) => {
//     e.preventDefault();
//     setLoadingAudience(true);
//     setError(null);
//     try {
//       const res = await fetch("http://127.0.0.1:8090/predict-audience", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ age: targetAge, ticket_price: ticketPrice, group_size: groupSize, seat_type: seatType }),
//       });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message);
//       setAudienceResult(result.target_audience_genre);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingAudience(false);
//     }
//   };

//   // 3. Forecast Cinema Potential Tier (Pipeline Engine C)
//   const runCinemaPotentialForecast = async (e) => {
//     e.preventDefault();
//     setLoadingCinema(true);
//     setError(null);
//     try {
//       const res = await fetch("http://127.0.0.1:8090/predict-cinema-potential", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title: movieTitle,
//           genres: movieGenres,
//           budget: movieBudget,
//           runtime: movieRuntime,
//           tmdb_popularity: moviePopularity,
//           release_year: releaseYear
//         }),
//       });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message);
//       setCinemaTierResult(result);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingCinema(false);
//     }
//   };

//   return (
//     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-8 max-w-7xl mx-auto text-slate-100 font-sans">
//       <div>
//         <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400">
//           Multi-Model Cinema Analytics Hub
//         </h2>
//         <p className="text-xs text-slate-400 mt-1">
//           Perform targeted predictions using multi-tier Machine Learning pipelines dynamically.
//         </p>
//       </div>

//       {error && (
//         <div className="text-red-400 bg-red-950/30 p-3 rounded-xl border border-red-900/50 text-xs">
//           <strong>System Exception Signal:</strong> {error}
//         </div>
//       )}

//       {/* THREE-COLUMN PIPELINE MODEL SECTIONS */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* PANEL 1: REVENUE PREDICTION MODEL */}
//         <form onSubmit={runRevenueForecast} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl space-y-4 flex flex-col justify-between">
//           <div className="space-y-4">
//             <div className="border-b border-slate-800 pb-2">
//               <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400">Pipeline Engine A</span>
//               <h3 className="text-sm font-bold text-slate-200">Revenue Yield Forecaster</h3>
//             </div>
            
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Genre Code</label>
//                 <select value={genreEncoded} onChange={(e) => setGenreEncoded(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none">
//                   {GENRE_MAPPING.map((g) => <option key={g.encoded} value={g.encoded}>{g.name}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket Price ($)</label>
//                 <input type="number" step="0.1" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hall Capacity</label>
//                 <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Day (0-6)</label>
//                 <input type="number" min="0" max="6" value={day} onChange={(e) => setDay(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//             </div>

//             <div>
//               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Showtimes</label>
//               <div className="flex flex-wrap gap-1.5 p-2 border border-slate-800 rounded-lg bg-slate-950">
//                 {AVAILABLE_TIMES.map((t) => (
//                   <label key={t.value} className={`px-2 py-1 rounded text-[10px] font-medium cursor-pointer transition-all ${selectedTimes.includes(t.value) ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
//                     <input type="checkbox" checked={selectedTimes.includes(t.value)} onChange={() => handleTimeChange(t.value)} className="hidden" />
//                     {t.label}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <button type="submit" disabled={loadingRevenue || selectedTimes.length === 0} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg disabled:opacity-40 transition-colors mt-4">
//             {loadingRevenue ? "Computing Yield..." : "Calculate Revenue Matrix"}
//           </button>
//         </form>

        

//         {/* PANEL 3: PRE-RELEASE XGBOOST CINEMA POTENTIAL */}
//         <form onSubmit={runCinemaPotentialForecast} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl space-y-4 flex flex-col justify-between">
//           <div className="space-y-4">
//             <div className="border-b border-slate-800 pb-2">
//               <span className="text-[10px] uppercase tracking-widest font-bold text-purple-400">Pipeline Engine C (XGBoost)</span>
//               <h3 className="text-sm font-bold text-slate-200">Cinema Potential Tier</h3>
//             </div>

//             <div className="space-y-2">
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Movie Title</label>
//                 <input type="text" value={movieTitle} onChange={(e) => setMovieTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Genres (Piped: Action|Sci-Fi)</label>
//                 <input type="text" value={movieGenres} onChange={(e) => setMovieGenres(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget ($)</label>
//                   <input type="number" value={movieBudget} onChange={(e) => setMovieBudget(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Runtime (min)</label>
//                   <input type="number" value={movieRuntime} onChange={(e) => setMovieRuntime(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//                 </div>
//               </div>
//             </div>

//             {cinemaTierResult && (
//               <div className="bg-purple-950/30 border border-purple-900/50 p-3 rounded-xl text-center space-y-0.5 animate-in fade-in">
//                 <span className="text-[9px] uppercase font-black tracking-widest text-purple-400">Target Potential Tier</span>
//                 <p className="text-base font-black text-slate-100">{cinemaTierResult.prediction}</p>
//                 <p className="text-[10px] font-semibold text-purple-300">Confidence: {cinemaTierResult.confidence}%</p>
//               </div>
//             )}
//           </div>

//           <button type="submit" disabled={loadingCinema} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 rounded-lg disabled:opacity-40 transition-colors mt-4">
//             {loadingCinema ? "Classifying Tier..." : "Evaluate Potential Tier"}
//           </button>
//         </form>

//       </div>

//       {/* REVENUE VISUALIZATION CHART CONTAINER */}
//       {revenueData.length > 0 && (
//         <div className="bg-slate-900/30 p-6 border border-slate-800/60 rounded-xl space-y-6 pt-4 animate-in fade-in">
//           <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Model A: Dynamic Sales Output Yield</h3>
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
//               <div className="h-64 w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={revenueData}>
//                     <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} />
//                     <XAxis dataKey="time_label" stroke="#64748b" fontSize={11} />
//                     <YAxis stroke="#64748b" fontSize={11} />
//                     <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
//                     <Bar dataKey="predicted_sales" name="Predicted Total Yield ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
//               <div className="h-64 w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={revenueData}>
//                     <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} />
//                     <XAxis dataKey="time_label" stroke="#64748b" fontSize={11} />
//                     <YAxis stroke="#64748b" fontSize={11} />
//                     <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
//                     <Line type="monotone" dataKey="predicted_sales" name="Sales Velocity Trend" stroke="#10b981" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// "use client";

// import { useState } from "react";
// import {
//   BarChart, Bar, LineChart, Line, XAxis, YAxis,
//   CartesianGrid, Tooltip, ResponsiveContainer
// } from "recharts";

// const GENRE_MAPPING = [
//   { name: "Action", encoded: 0 },
//   { name: "Comedy", encoded: 1 },
//   { name: "Drama", encoded: 2 },
//   { name: "Horror", encoded: 3 },
//   { name: "Sci-Fi", encoded: 4 }
// ];

// const DAYS_OF_WEEK = [
//   { name: "Monday", value: 0 },
//   { name: "Tuesday", value: 1 },
//   { name: "Wednesday", value: 2 },
//   { name: "Thursday", value: 3 },
//   { name: "Friday", value: 4 },
//   { name: "Saturday", value: 5 },
//   { name: "Sunday", value: 6 }
// ];

// const AVAILABLE_TIMES = [
//   { label: "10 AM", value: 10 },
//   { label: "12 PM", value: 12 },
//   { label: "2 PM", value: 14 },
//   { label: "4 PM", value: 16 },
//   { label: "6 PM", value: 18 },
//   { label: "7 PM", value: 19 }
// ];

// export default function CinemaDashboard() {
//   // Common Settings
//   const [ticketPrice, setTicketPrice] = useState(1000); // Default set to 1000
//   const [capacity, setCapacity] = useState(200);

//   // Model A State Variables (Revenue Model)
//   const [genreEncoded, setGenreEncoded] = useState(0);
//   const [selectedTimes, setSelectedTimes] = useState([10, 14, 18]);
//   const [day, setDay] = useState(0); // Default to Monday (0)
//   const [revenueData, setRevenueData] = useState([]);

//   // Model B State Variables (Target Audience Model)
//   const [targetAge, setTargetAge] = useState(25);
//   const [groupSize, setGroupSize] = useState(1);
//   const [seatType, setSeatType] = useState(1);
//   const [audienceResult, setAudienceResult] = useState(null);

//   // Model C State Variables (Pre-Release Cinema Potential Model)
//   const [movieTitle, setMovieTitle] = useState("Avatar 3: The Seed Bearer");
//   const [movieGenres, setMovieGenres] = useState("Action|Sci-Fi|Adventure");
//   const [movieBudget, setMovieBudget] = useState(250000000);
//   const [movieRuntime, setMovieRuntime] = useState(160);
//   const [moviePopularity, setMoviePopularity] = useState(85.5);
//   const [releaseYear, setReleaseYear] = useState(2025);
//   const [cinemaTierResult, setCinemaTierResult] = useState(null);

//   // Loading & Error Handling States
//   const [loadingRevenue, setLoadingRevenue] = useState(false);
//   const [loadingAudience, setLoadingAudience] = useState(false);
//   const [loadingCinema, setLoadingCinema] = useState(false);
//   const [error, setError] = useState(null);

//   const handleTimeChange = (timeValue) => {
//     setSelectedTimes(prev =>
//       prev.includes(timeValue) ? prev.filter((t) => t !== timeValue) : [...prev, timeValue]
//     );
//   };

//   // 1. Forecast Revenue (Pipeline Engine A)
//   const runRevenueForecast = async (e) => {
//     e.preventDefault();
//     setLoadingRevenue(true);
//     setError(null);

//     // Calculate current month and quarter dynamically
//     const now = new Date();
//     const currentMonth = now.getMonth() + 1; // 1-12
//     const currentQuarter = Math.ceil(currentMonth / 3); // 1-4

//     try {
//       const res = await fetch("http://127.0.0.1:8090/predict-revenue", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           genre_encoded: genreEncoded,
//           times: selectedTimes,
//           day: Number(day),
//           ticket_price: Number(ticketPrice),
//           capacity: Number(capacity),
//           month: currentMonth,
//           quarter: currentQuarter
//         }),
//       });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || "Prediction failed");
//       setRevenueData(result.predictions.sort((a, b) => a.show_time_raw - b.show_time_raw));
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingRevenue(false);
//     }
//   };

//   // 2. Forecast Target Audience (Pipeline Engine B)
//   const runAudienceForecast = async (e) => {
//     e.preventDefault();
//     setLoadingAudience(true);
//     setError(null);
//     try {
//       const res = await fetch("http://127.0.0.1:8090/predict-audience", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           age: targetAge, 
//           ticket_price: ticketPrice, 
//           group_size: groupSize, 
//           seat_type: seatType 
//         }),
//       });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message);
//       setAudienceResult(result.target_audience_genre);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingAudience(false);
//     }
//   };

//   // 3. Forecast Cinema Potential Tier (Pipeline Engine C)
//   const runCinemaPotentialForecast = async (e) => {
//     e.preventDefault();
//     setLoadingCinema(true);
//     setError(null);
//     try {
//       const res = await fetch("http://127.0.0.1:8090/predict-cinema-potential", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title: movieTitle,
//           genres: movieGenres,
//           budget: movieBudget,
//           runtime: movieRuntime,
//           tmdb_popularity: moviePopularity,
//           release_year: releaseYear
//         }),
//       });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message);
//       setCinemaTierResult(result);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingCinema(false);
//     }
//   };

//   return (
//     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-8 max-w-7xl mx-auto text-slate-100 font-sans">
//       <div>
//         <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400">
//           Multi-Model Cinema Analytics Hub
//         </h2>
//         <p className="text-xs text-slate-400 mt-1">
//           Perform targeted predictions using multi-tier Machine Learning pipelines dynamically.
//         </p>
//       </div>

//       {error && (
//         <div className="text-red-400 bg-red-950/30 p-3 rounded-xl border border-red-900/50 text-xs">
//           <strong>System Exception Signal:</strong> {error}
//         </div>
//       )}

//       {/* THREE-COLUMN PIPELINE MODEL SECTIONS */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* PANEL 1: REVENUE PREDICTION MODEL */}
//         <form onSubmit={runRevenueForecast} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl space-y-4 flex flex-col justify-between">
//           <div className="space-y-4">
//             <div className="border-b border-slate-800 pb-2">
//               <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400">Pipeline Engine A</span>
//               <h3 className="text-sm font-bold text-slate-200">Revenue Yield Forecaster</h3>
//             </div>
            
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Genre</label>
//                 <select value={genreEncoded} onChange={(e) => setGenreEncoded(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none">
//                   {GENRE_MAPPING.map((g) => <option key={g.encoded} value={g.encoded}>{g.name}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket Price ($/LKR)</label>
//                 <input type="number" step="1" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hall Capacity</label>
//                 <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Day of Week</label>
//                 <select value={day} onChange={(e) => setDay(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none">
//                   {DAYS_OF_WEEK.map((d) => <option key={d.value} value={d.value}>{d.name}</option>)}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Showtimes</label>
//               <div className="flex flex-wrap gap-1.5 p-2 border border-slate-800 rounded-lg bg-slate-950">
//                 {AVAILABLE_TIMES.map((t) => (
//                   <label key={t.value} className={`px-2 py-1 rounded text-[10px] font-medium cursor-pointer transition-all ${selectedTimes.includes(t.value) ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
//                     <input type="checkbox" checked={selectedTimes.includes(t.value)} onChange={() => handleTimeChange(t.value)} className="hidden" />
//                     {t.label}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <button type="submit" disabled={loadingRevenue || selectedTimes.length === 0} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg disabled:opacity-40 transition-colors mt-4">
//             {loadingRevenue ? "Computing Yield..." : "Calculate Revenue Matrix"}
//           </button>
//         </form>

//         {/* PANEL 2: TARGET AUDIENCE GENRE PREDICTION */}
//         <form onSubmit={runAudienceForecast} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl space-y-4 flex flex-col justify-between">
//           <div className="space-y-4">
//             <div className="border-b border-slate-800 pb-2">
//               <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">Pipeline Engine B</span>
//               <h3 className="text-sm font-bold text-slate-200">Target Audience Matcher</h3>
//             </div>

//             <div className="space-y-2">
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Age</label>
//                 <input type="number" value={targetAge} onChange={(e) => setTargetAge(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Group Size</label>
//                 <input type="number" value={groupSize} onChange={(e) => setGroupSize(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Seat Tier Code</label>
//                 <input type="number" value={seatType} onChange={(e) => setSeatType(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//             </div>

//             {audienceResult && (
//               <div className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-xl text-center space-y-0.5 animate-in fade-in">
//                 <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">Matched Preference</span>
//                 <p className="text-base font-black text-slate-100">{audienceResult}</p>
//               </div>
//             )}
//           </div>

//           <button type="submit" disabled={loadingAudience} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-lg disabled:opacity-40 transition-colors mt-4">
//             {loadingAudience ? "Matching Audience..." : "Identify Target Audience"}
//           </button>
//         </form>

//         {/* PANEL 3: PRE-RELEASE XGBOOST CINEMA POTENTIAL */}
//         <form onSubmit={runCinemaPotentialForecast} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl space-y-4 flex flex-col justify-between">
//           <div className="space-y-4">
//             <div className="border-b border-slate-800 pb-2">
//               <span className="text-[10px] uppercase tracking-widest font-bold text-purple-400">Pipeline Engine C (XGBoost)</span>
//               <h3 className="text-sm font-bold text-slate-200">Cinema Potential Tier</h3>
//             </div>

//             <div className="space-y-2">
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Movie Title</label>
//                 <input type="text" value={movieTitle} onChange={(e) => setMovieTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Genres (Piped: Action|Sci-Fi)</label>
//                 <input type="text" value={movieGenres} onChange={(e) => setMovieGenres(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget ($)</label>
//                   <input type="number" value={movieBudget} onChange={(e) => setMovieBudget(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Runtime (min)</label>
//                   <input type="number" value={movieRuntime} onChange={(e) => setMovieRuntime(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
//                 </div>
//               </div>
//             </div>

//             {cinemaTierResult && (
//               <div className="bg-purple-950/30 border border-purple-900/50 p-3 rounded-xl text-center space-y-0.5 animate-in fade-in">
//                 <span className="text-[9px] uppercase font-black tracking-widest text-purple-400">Target Potential Tier</span>
//                 <p className="text-base font-black text-slate-100">{cinemaTierResult.prediction}</p>
//                 <p className="text-[10px] font-semibold text-purple-300">Confidence: {cinemaTierResult.confidence}%</p>
//               </div>
//             )}
//           </div>

//           <button type="submit" disabled={loadingCinema} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 rounded-lg disabled:opacity-40 transition-colors mt-4">
//             {loadingCinema ? "Classifying Tier..." : "Evaluate Potential Tier"}
//           </button>
//         </form>

//       </div>

//       {/* REVENUE VISUALIZATION CHART CONTAINER */}
//       {revenueData.length > 0 && (
//         <div className="bg-slate-900/30 p-6 border border-slate-800/60 rounded-xl space-y-6 pt-4 animate-in fade-in">
//           <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Model A: Dynamic Sales Output Yield</h3>
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
//             {/* Bar Chart Container */}
//             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
//               <div className="h-64 w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={revenueData}>
//                     <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} />
//                     <XAxis dataKey="time_label" stroke="#64748b" fontSize={11} />
//                     <YAxis stroke="#64748b" fontSize={11} />
//                     <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
//                     <Bar dataKey="predicted_sales" name="Predicted Total Yield" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Line Chart Container */}
//             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
//               <div className="h-64 w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={revenueData}>
//                     <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} />
//                     <XAxis dataKey="time_label" stroke="#64748b" fontSize={11} />
//                     <YAxis stroke="#64748b" fontSize={11} />
//                     <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
//                     <Line type="monotone" dataKey="predicted_sales" name="Sales Velocity Trend" stroke="#10b981" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Mapping dictionary provided by python context
const FILM_MAP = {
  1492: "Romance", 1567: "Action", 1497: "Comedy", 1498: "Horror", 1494: "Drama",
  1486: "Thriller", 1496: "Adventure", 1511: "Sci-Fi", 1563: "Fantasy", 1589: "Animation",
  1566: "Crime", 1550: "Mystery", 1499: "Romance", 1551: "Action", 1558: "Comedy",
  1565: "Drama", 1568: "Horror", 1562: "Thriller", 1512: "Adventure", 1575: "Sci-Fi",
  1495: "Fantasy", 1471: "Animation", 1480: "Crime", 1559: "Mystery", 1570: "Romance",
  1584: "Action", 1587: "Comedy", 1484: "Drama", 1553: "Horror", 1573: "Thriller",
  1571: "Adventure", 1483: "Sci-Fi"
};

// Generate UNIQUE genres dynamically mapped to encoded indices (0 to N)
const UNIQUE_GENRES = Array.from(new Set(Object.values(FILM_MAP))).map((genreName, idx) => ({
  name: genreName,
  encoded: idx
}));

// Days dropdown mapping 0-6
const DAYS_OF_WEEK = [
  { label: "Monday", value: 0 },
  { label: "Tuesday", value: 1 },
  { label: "Wednesday", value: 2 },
  { label: "Thursday", value: 3 },
  { label: "Friday", value: 4 },
  { label: "Saturday", value: 5 },
  { label: "Sunday", value: 6 }
];

const AVAILABLE_TIMES = [
  { label: "10 AM", value: 10 },
  { label: "12 PM", value: 12 },
  { label: "2 PM", value: 14 },
  { label: "4 PM", value: 16 },
  { label: "6 PM", value: 18 },
  { label: "7 PM", value: 19 }
];

export default function CinemaDashboard() {
  // Common Settings (Default ticket price updated to 1000)
  const [ticketPrice, setTicketPrice] = useState(1000);
  const [capacity, setCapacity] = useState(200);

  // Model A State Variables (Revenue Model)
  const [genreEncoded, setGenreEncoded] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState([10, 14, 18]);
  const [day, setDay] = useState(5); // Default to Saturday (5)
  const [quarter, setQuarter] = useState(2);
  const [revenueData, setRevenueData] = useState([]);

  // Model B State Variables (Target Audience Model)
  const [targetAge, setTargetAge] = useState(25);
  const [groupSize, setGroupSize] = useState(1);
  const [seatType, setSeatType] = useState(1);
  const [audienceResult, setAudienceResult] = useState(null);

  // Model C State Variables (Pre-Release Cinema Potential Model)
  const [movieTitle, setMovieTitle] = useState("Avatar 3: The Seed Bearer");
  const [movieGenres, setMovieGenres] = useState("Action|Sci-Fi|Adventure");
  const [movieBudget, setMovieBudget] = useState(250000000);
  const [movieRuntime, setMovieRuntime] = useState(160);
  const [moviePopularity, setMoviePopularity] = useState(85.5);
  const [releaseYear, setReleaseYear] = useState(2025);
  const [cinemaTierResult, setCinemaTierResult] = useState(null);

  // Loading & Error Handling States
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [loadingAudience, setLoadingAudience] = useState(false);
  const [loadingCinema, setLoadingCinema] = useState(false);
  const [error, setError] = useState(null);

  const handleTimeChange = (timeValue) => {
    setSelectedTimes(prev =>
      prev.includes(timeValue) ? prev.filter((t) => t !== timeValue) : [...prev, timeValue]
    );
  };

  // 1. Forecast Revenue (Pipeline Engine A)
  const runRevenueForecast = async (e) => {
    e.preventDefault();
    setLoadingRevenue(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8090/predict-revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genre_encoded: Number(genreEncoded),
          times: selectedTimes,
          day: Number(day),
          ticket_price: Number(ticketPrice),
          capacity: Number(capacity),
          quarter: Number(quarter)
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to calculate revenue");
      setRevenueData(result.predictions.sort((a, b) => a.show_time_raw - b.show_time_raw));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // 2. Forecast Target Audience (Pipeline Engine B)
  const runAudienceForecast = async (e) => {
    e.preventDefault();
    setLoadingAudience(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8090/predict-audience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age: targetAge, ticket_price: ticketPrice, group_size: groupSize, seat_type: seatType }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setAudienceResult(result.target_audience_genre);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAudience(false);
    }
  };

  // 3. Forecast Cinema Potential Tier (Pipeline Engine C)
  const runCinemaPotentialForecast = async (e) => {
    e.preventDefault();
    setLoadingCinema(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8090/predict-cinema-potential", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: movieTitle,
          genres: movieGenres,
          budget: movieBudget,
          runtime: movieRuntime,
          tmdb_popularity: moviePopularity,
          release_year: releaseYear
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setCinemaTierResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCinema(false);
    }
  };

  return (
    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-8 max-w-7xl mx-auto text-slate-100 font-sans">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400">
          Multi-Model Cinema Analytics Hub
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perform targeted predictions using multi-tier Machine Learning pipelines dynamically.
        </p>
      </div>

      {error && (
        <div className="text-red-400 bg-red-950/30 p-3 rounded-xl border border-red-900/50 text-xs">
          <strong>System Exception Signal:</strong> {error}
        </div>
      )}

      {/* THREE-COLUMN PIPELINE MODEL SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL 1: REVENUE PREDICTION MODEL */}
        <form onSubmit={runRevenueForecast} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400">Pipeline Engine A</span>
              <h3 className="text-sm font-bold text-slate-200">Revenue Yield Forecaster</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Film Genre</label>
                <select 
                  value={genreEncoded} 
                  onChange={(e) => setGenreEncoded(Number(e.target.value))} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none"
                >
                  {UNIQUE_GENRES.map((g) => (
                    <option key={g.encoded} value={g.encoded}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket Price ($)</label>
                <input 
                  type="number" 
                  step="1" 
                  value={ticketPrice} 
                  onChange={(e) => setTicketPrice(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hall Capacity</label>
                <input 
                  type="number" 
                  value={capacity} 
                  onChange={(e) => setCapacity(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Day of Week</label>
                <select 
                  value={day} 
                  onChange={(e) => setDay(Number(e.target.value))} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Showtimes</label>
              <div className="flex flex-wrap gap-1.5 p-2 border border-slate-800 rounded-lg bg-slate-950">
                {AVAILABLE_TIMES.map((t) => (
                  <label key={t.value} className={`px-2 py-1 rounded text-[10px] font-medium cursor-pointer transition-all ${selectedTimes.includes(t.value) ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
                    <input type="checkbox" checked={selectedTimes.includes(t.value)} onChange={() => handleTimeChange(t.value)} className="hidden" />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={loadingRevenue || selectedTimes.length === 0} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg disabled:opacity-40 transition-colors mt-4">
            {loadingRevenue ? "Computing Yield..." : "Calculate Revenue Matrix"}
          </button>
        </form>

        {/* PANEL 2: AUDIENCE PREDICTION MODEL
        <form onSubmit={runAudienceForecast} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">Pipeline Engine B</span>
              <h3 className="text-sm font-bold text-slate-200">Target Audience Matcher</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Age</label>
                <input type="number" value={targetAge} onChange={(e) => setTargetAge(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Group Size</label>
                <input type="number" value={groupSize} onChange={(e) => setGroupSize(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Seat Type Encoded</label>
                <input type="number" value={seatType} onChange={(e) => setSeatType(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
              </div>
            </div>

            {audienceResult && (
              <div className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-xl text-center space-y-0.5 animate-in fade-in">
                <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">Matched Preference Genre</span>
                <p className="text-base font-black text-slate-100">{audienceResult}</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={loadingAudience} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-lg disabled:opacity-40 transition-colors mt-4">
            {loadingAudience ? "Matching Audience..." : "Match Audience Genre"}
          </button>
        </form> */}

        {/* PANEL 3: PRE-RELEASE XGBOOST CINEMA POTENTIAL */}
        <form onSubmit={runCinemaPotentialForecast} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-purple-400">Pipeline Engine C (XGBoost)</span>
              <h3 className="text-sm font-bold text-slate-200">Cinema Potential Tier</h3>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Movie Title</label>
                <input type="text" value={movieTitle} onChange={(e) => setMovieTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Genres (Piped: Action|Sci-Fi)</label>
                <input type="text" value={movieGenres} onChange={(e) => setMovieGenres(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget ($)</label>
                  <input type="number" value={movieBudget} onChange={(e) => setMovieBudget(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Runtime (min)</label>
                  <input type="number" value={movieRuntime} onChange={(e) => setMovieRuntime(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none" />
                </div>
              </div>
            </div>

            {cinemaTierResult && (
              <div className="bg-purple-950/30 border border-purple-900/50 p-3 rounded-xl text-center space-y-0.5 animate-in fade-in">
                <span className="text-[9px] uppercase font-black tracking-widest text-purple-400">Target Potential Tier</span>
                <p className="text-base font-black text-slate-100">{cinemaTierResult.prediction}</p>
                <p className="text-[10px] font-semibold text-purple-300">Confidence: {cinemaTierResult.confidence}%</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={loadingCinema} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 rounded-lg disabled:opacity-40 transition-colors mt-4">
            {loadingCinema ? "Classifying Tier..." : "Evaluate Potential Tier"}
          </button>
        </form>

      </div>

      {/* REVENUE VISUALIZATION CHART CONTAINER */}
      {revenueData.length > 0 && (
        <div className="bg-slate-900/30 p-6 border border-slate-800/60 rounded-xl space-y-6 pt-4 animate-in fade-in">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Model A: Dynamic Sales Output Yield</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} />
                    <XAxis dataKey="time_label" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                    <Bar dataKey="predicted_sales" name="Predicted Total Yield ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} />
                    <XAxis dataKey="time_label" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                    <Line type="monotone" dataKey="predicted_sales" name="Sales Velocity Trend" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}