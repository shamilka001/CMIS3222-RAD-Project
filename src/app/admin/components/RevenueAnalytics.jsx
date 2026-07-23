// "use client";

// import React, { useState, useEffect } from "react";
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
// } from "recharts";
// import { Ticket, DollarSign, TrendingUp, Loader2 } from "lucide-react";

// const fetchMovieStats = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve([
//         { id: 1, title: "Dune: Part Two", ticketsSold: 12500, ticketPrice: 3500 },
//         { id: 2, title: "Deadpool & Wolverine", ticketsSold: 18200, ticketPrice: 3200 },
//         { id: 3, title: "Furiosa", ticketsSold: 8400, ticketPrice: 3800 },
//         { id: 4, title: "Inside Out 2", ticketsSold: 22000, ticketPrice: 2800 },
//         { id: 5, title: "Civil War", ticketsSold: 6100, ticketPrice: 3500 },
//       ]);
//     }, 1200);
//   });
// };

// export default function RevenueAnalytics() {
//   const [movies, setMovies] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await fetchMovieStats();
//         const processedData = data.map(movie => ({
//           ...movie,
//           revenue: movie.ticketsSold * movie.ticketPrice
//         }));
        
//         const sortedData = processedData.sort((a, b) => b.revenue - a.revenue);
//         setMovies(sortedData);
//       } catch (error) {
//         console.error("Failed to fetch movie data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Format currency dynamically for Sri Lanka (LKR)
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-LK', {
//       style: 'currency',
//       currency: 'LKR',
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const totalRevenue = movies.reduce((acc, curr) => acc + curr.revenue, 0);
//   const totalTickets = movies.reduce((acc, curr) => acc + curr.ticketsSold, 0);
//   const topMovie = movies.length > 0 ? movies[0] : null;

//   if (isLoading) {
//     return (
//       <div className="w-full py-12 bg-background flex flex-col items-center justify-center text-white border border-border rounded-2xl">
//         <Loader2 className="w-8 h-8 animate-spin mb-3 text-brand-lime" />
//         <p className="font-medium tracking-wide uppercase text-xs text-white">Loading Revenue Data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full space-y-6 text-white">
      
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Revenue Analytics</h2>
//         <p className="text-white/70 text-sm mt-1">Real-time box office performance and ticket sales.</p>
//       </div>

//       {/* KPI Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-xs font-bold uppercase tracking-wider text-white/70">Gross Revenue</p>
//               <h3 className="text-2xl font-black mt-1 text-emerald-400">{formatCurrency(totalRevenue)}</h3>
//             </div>
//             <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
//               <DollarSign size={18} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-xs font-bold uppercase tracking-wider text-white/70">Total Tickets Sold</p>
//               <h3 className="text-2xl font-black mt-1 text-blue-400">{totalTickets.toLocaleString()}</h3>
//             </div>
//             <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
//               <Ticket size={18} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-xs font-bold uppercase tracking-wider text-white/70">Top Performer</p>
//               <h3 className="text-lg font-black mt-1 truncate max-w-[180px] text-white">{topMovie?.title}</h3>
//               <p className="text-xs text-brand-lime font-bold mt-0.5">{formatCurrency(topMovie?.revenue || 0)}</p>
//             </div>
//             <div className="p-2.5 bg-brand-lime/10 rounded-xl text-brand-lime">
//               <TrendingUp size={18} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Analytics Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Recharts Bar Chart */}
//         <div className="lg:col-span-2 bg-card text-white border border-border rounded-2xl p-5 shadow-sm flex flex-col">
//           <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-4">Revenue Comparison</h4>
//           <div className="flex-1 w-full min-h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={movies} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
//                 <XAxis 
//                   dataKey="title" 
//                   axisLine={false} 
//                   tickLine={false} 
//                   tick={{ fill: '#ffffff', fontSize: 11 }}
//                   dy={10}
//                 />
//                 <YAxis 
//                   axisLine={false} 
//                   tickLine={false} 
//                   tick={{ fill: '#ffffff', fontSize: 11 }}
//                   tickFormatter={(val) => `Rs. ${val / 1000}k`}
//                 />
//                 <Tooltip 
//                   cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
//                   contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: '#ffffff' }}
//                   itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
//                   labelStyle={{ color: '#ffffff' }}
//                   formatter={(value) => [formatCurrency(value), 'Revenue']}
//                 />
//                 <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={50}>
//                   {movies.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={index === 0 ? "var(--brand-lime, #84cc16)" : "#6b7280"} 
//                     />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Detailed Breakdown */}
//         <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
//           <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-4">Breakdown</h4>
//           <div className="space-y-3">
//             {movies.map((movie, index) => (
//               <div key={movie.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors">
//                 <div className="flex items-center gap-3">
//                   <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
//                     {index + 1}
//                   </div>
//                   <div>
//                     <h5 className="font-bold text-sm leading-none text-white">{movie.title}</h5>
//                     <div className="flex items-center gap-2 mt-1">
//                       <span className="text-xs text-white/70">{movie.ticketsSold.toLocaleString()} tickets</span>
//                       <span className="w-1 h-1 rounded-full bg-white/40" />
//                       <span className="text-xs text-white/70">{formatCurrency(movie.ticketPrice)}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="font-black text-sm text-white">
//                   {formatCurrency(movie.revenue)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


// "use client";

// import React, { useState, useEffect } from "react";
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
// } from "recharts";
// import { Ticket, DollarSign, TrendingUp, Loader2, Calendar, Clock } from "lucide-react";

// export default function RevenueAnalytics() {
//   const [analyticsData, setAnalyticsData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/analytics/revenue");
//         const result = await response.json();

//         if (result.success && Array.isArray(result.data)) {
//           // Format raw date/time values cleanly
//           const processed = result.data.map((item) => {
//             const formattedDate = item.showDate
//               ? new Date(item.showDate).toISOString().split("T")[0]
//               : "N/A";
//             const formattedTime = item.startTime
//               ? item.startTime.substring(0, 5)
//               : "00:00";

//             return {
//               ...item,
//               showDate: formattedDate,
//               startTime: formattedTime,
//               ticketsSold: Number(item.ticketsSold) || 0,
//               revenue: Number(item.totalRevenue) || 0,
//               // Label string for chart axes
//               chartLabel: `${item.filmTitle} (${formattedDate} ${formattedTime})`,
//             };
//           });

//           setAnalyticsData(processed);
//         }
//       } catch (error) {
//         console.error("Failed to fetch revenue analytics data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Format currency in LKR (Sri Lanka Rupees)
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-LK", {
//       style: "currency",
//       currency: "LKR",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const totalRevenue = analyticsData.reduce((acc, curr) => acc + curr.revenue, 0);
//   const totalTickets = analyticsData.reduce((acc, curr) => acc + curr.ticketsSold, 0);
//   const topPerformer = analyticsData.length > 0 ? analyticsData[0] : null;

//   if (isLoading) {
//     return (
//       <div className="w-full py-12 bg-background flex flex-col items-center justify-center text-white border border-border rounded-2xl">
//         <Loader2 className="w-8 h-8 animate-spin mb-3 text-brand-lime" />
//         <p className="font-medium tracking-wide uppercase text-xs text-white">Loading Revenue Data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full space-y-6 text-white">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Showtime Revenue Analytics</h2>
//         <p className="text-white/70 text-sm mt-1">
//           Detailed payment breakdowns organized by film name, scheduled date, and showtime.
//         </p>
//       </div>

//       {/* KPI Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-xs font-bold uppercase tracking-wider text-white/70">Gross Revenue</p>
//               <h3 className="text-2xl font-black mt-1 text-emerald-400">{formatCurrency(totalRevenue)}</h3>
//             </div>
//             <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
//               <DollarSign size={18} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-xs font-bold uppercase tracking-wider text-white/70">Total Tickets Sold</p>
//               <h3 className="text-2xl font-black mt-1 text-blue-400">{totalTickets.toLocaleString()}</h3>
//             </div>
//             <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
//               <Ticket size={18} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-xs font-bold uppercase tracking-wider text-white/70">Top Show Slot</p>
//               <h3 className="text-lg font-black mt-1 truncate max-w-[180px] text-white">
//                 {topPerformer?.filmTitle || "N/A"}
//               </h3>
//               <p className="text-xs text-brand-lime font-bold mt-0.5">
//                 {formatCurrency(topPerformer?.revenue || 0)}
//               </p>
//             </div>
//             <div className="p-2.5 bg-brand-lime/10 rounded-xl text-brand-lime">
//               <TrendingUp size={18} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Analytics Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Recharts Bar Chart */}
//         <div className="lg:col-span-2 bg-card text-white border border-border rounded-2xl p-5 shadow-sm flex flex-col">
//           <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-4">Revenue by Film & Showtime</h4>
//           <div className="flex-1 w-full min-h-[320px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
//                 <XAxis 
//                   dataKey="filmTitle" 
//                   axisLine={false} 
//                   tickLine={false} 
//                   tick={{ fill: '#ffffff', fontSize: 10 }}
//                   interval={0}
//                   angle={-15}
//                   textAnchor="end"
//                 />
//                 <YAxis 
//                   axisLine={false} 
//                   tickLine={false} 
//                   tick={{ fill: '#ffffff', fontSize: 11 }}
//                   tickFormatter={(val) => `Rs. ${val >= 1000 ? `${val / 1000}k` : val}`}
//                 />
//                 <Tooltip 
//                   cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
//                   contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: '#ffffff' }}
//                   itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
//                   labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
//                   formatter={(value) => [formatCurrency(value), 'Gross Revenue']}
//                   labelFormatter={(label, payload) => {
//                     if (payload && payload[0]) {
//                       const data = payload[0].payload;
//                       return `${data.filmTitle} (${data.showDate} @ ${data.startTime})`;
//                     }
//                     return label;
//                   }}
//                 />
//                 <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={50}>
//                   {analyticsData.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={index === 0 ? "var(--brand-lime, #84cc16)" : "#6b7280"} 
//                     />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Detailed Showtime Breakdown */}
//         <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
//           <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-4">Detailed Show Breakdown</h4>
//           <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
//             {analyticsData.map((item, index) => (
//               <div key={item.showtime_id || index} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5">
//                 <div className="flex items-center gap-3">
//                   <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
//                     {index + 1}
//                   </div>
//                   <div>
//                     <h5 className="font-bold text-sm leading-none text-white">{item.filmTitle}</h5>
//                     <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-white/70">
//                       <span className="flex items-center gap-1">
//                         <Calendar size={12} className="text-brand-lime" />
//                         {item.showDate}
//                       </span>
//                       <span className="w-1 h-1 rounded-full bg-white/40" />
//                       <span className="flex items-center gap-1">
//                         <Clock size={12} className="text-brand-lime" />
//                         {item.startTime}
//                       </span>
//                     </div>
//                     <div className="text-[10px] text-white/50 mt-1">
//                       {item.ticketsSold} seats • {item.screenName || "Standard Hall"}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="font-black text-sm text-emerald-400 shrink-0 ml-2">
//                   {formatCurrency(item.revenue)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }




"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { Ticket, DollarSign, TrendingUp, Loader2, Calendar, Clock, Layers } from "lucide-react";

export default function RevenueAnalytics() {
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("weekly"); // 'weekly' | 'monthly' | 'showtime'

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/analytics/revenue");
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setRawData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch revenue analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Format currency in LKR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to format Date cleanly in local timezone
  const getLocalDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    // Uses local date string format YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper to get Week Label (e.g., "Jul 13 - Jul 19")
  const getWeekLabel = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diffToMonday = date.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(date.setDate(diffToMonday));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatOpts = { month: "short", day: "numeric" };
    return `${monday.toLocaleDateString("en-US", formatOpts)} - ${sunday.toLocaleDateString("en-US", formatOpts)}`;
  };

  // Aggregate and Group Data based on Selected Timeframe
  const processedData = useMemo(() => {
    if (!rawData.length) return [];

    if (timeframe === "showtime") {
      return rawData.map((item) => {
        const formattedDate = getLocalDate(item.showDate);
        const formattedTime = item.startTime ? item.startTime.substring(0, 5) : "00:00";
        return {
          id: item.showtime_id,
          label: `${item.filmTitle.trim()}`,
          subLabel: `${formattedDate} @ ${formattedTime}`,
          ticketsSold: Number(item.ticketsSold) || 0,
          revenue: Number(item.totalRevenue) || 0,
          filmTitle: item.filmTitle.trim(),
          showDate: formattedDate,
          startTime: formattedTime,
          screenName: item.screenName
        };
      });
    }

    // Grouping by Weekly or Monthly
    const grouped = {};

    rawData.forEach((item) => {
      const dateObj = new Date(item.showDate);
      const rev = Number(item.totalRevenue) || 0;
      const tickets = Number(item.ticketsSold) || 0;

      let groupKey = "";
      let groupLabel = "";
      let subLabel = "";

      if (timeframe === "weekly") {
        groupKey = getWeekLabel(item.showDate);
        groupLabel = groupKey;
        subLabel = "Weekly Summary";
      } else if (timeframe === "monthly") {
        groupKey = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        groupLabel = groupKey;
        subLabel = "Monthly Summary";
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          id: groupKey,
          label: groupLabel,
          subLabel: subLabel,
          ticketsSold: 0,
          revenue: 0,
          showsCount: 0
        };
      }

      grouped[groupKey].revenue += rev;
      grouped[groupKey].ticketsSold += tickets;
      grouped[groupKey].showsCount += 1;
    });

    return Object.values(grouped);
  }, [rawData, timeframe]);

  const totalRevenue = useMemo(() => rawData.reduce((acc, curr) => acc + (Number(curr.totalRevenue) || 0), 0), [rawData]);
  const totalTickets = useMemo(() => rawData.reduce((acc, curr) => acc + (Number(curr.ticketsSold) || 0), 0), [rawData]);
  
  // Find top performer in processed dataset
  const topPerformer = useMemo(() => {
    if (!processedData.length) return null;
    return [...processedData].sort((a, b) => b.revenue - a.revenue)[0];
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="w-full py-12 bg-background flex flex-col items-center justify-center text-white border border-border rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-brand-lime" />
        <p className="font-medium tracking-wide uppercase text-xs text-white">Loading Revenue Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-white">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Revenue Analytics</h2>
          <p className="text-white/70 text-sm mt-1">
            Track performance aggregated by weekly, monthly, or showtime periods.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeframe === "weekly"
                ? "bg-brand-lime text-black shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeframe === "monthly"
                ? "bg-brand-lime text-black shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe("showtime")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeframe === "showtime"
                ? "bg-brand-lime text-black shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            By Show
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Gross Revenue</p>
              <h3 className="text-2xl font-black mt-1 text-emerald-400">{formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
              <DollarSign size={18} />
            </div>
          </div>
        </div>

        <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Total Tickets Sold</p>
              <h3 className="text-2xl font-black mt-1 text-blue-400">{totalTickets.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
              <Ticket size={18} />
            </div>
          </div>
        </div>

        <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Top Performer</p>
              <h3 className="text-lg font-black mt-1 truncate max-w-[180px] text-white">
                {topPerformer?.label || "N/A"}
              </h3>
              <p className="text-xs text-brand-lime font-bold mt-0.5">
                {formatCurrency(topPerformer?.revenue || 0)}
              </p>
            </div>
            <div className="p-2.5 bg-brand-lime/10 rounded-xl text-brand-lime">
              <TrendingUp size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Bar Chart */}
        <div className="lg:col-span-2 bg-card text-white border border-border rounded-2xl p-5 shadow-sm flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-4">
            Revenue Overview ({timeframe.toUpperCase()})
          </h4>
          <div className="flex-1 w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff', fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff', fontSize: 11 }}
                  tickFormatter={(val) => `Rs. ${val >= 1000 ? `${val / 1000}k` : val}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  formatter={(value) => [formatCurrency(value), 'Gross Revenue']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      const data = payload[0].payload;
                      return `${data.label} (${data.subLabel})`;
                    }
                    return label;
                  }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {processedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.revenue > 0 ? "var(--brand-lime, #84cc16)" : "#4b5563"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Breakdown List */}
        <div className="bg-card text-white border border-border rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-4">
            Breakdown ({timeframe})
          </h4>
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {processedData.map((item, index) => (
              <div key={item.id || index} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm leading-none text-white">{item.label}</h5>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-white/70">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-brand-lime" />
                        {item.subLabel}
                      </span>
                    </div>
                    <div className="text-[10px] text-white/50 mt-1">
                      {item.ticketsSold} tickets {item.showsCount ? `• ${item.showsCount} shows` : ""}
                    </div>
                  </div>
                </div>
                <div className="font-black text-sm text-emerald-400 shrink-0 ml-2">
                  {formatCurrency(item.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}