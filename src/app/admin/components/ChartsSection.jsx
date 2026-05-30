<<<<<<< HEAD
// "use client"

// import { MoreVertical } from "lucide-react"

// export default function ChartsSection() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
//       {/* Donut Chart Component */}
//       <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 md:col-span-2 shadow-xs transition-colors duration-200">
//         <div className="flex justify-between items-center mb-6">
//           <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sales Overview By Genre</h4>
//           <MoreVertical size={14} className="text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors" />
//         </div>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
//           <div className="relative flex justify-center items-center">
//             <svg width="140" height="140" viewBox="0 0 36 36" className="transform -rotate-90">
//               {/* Dynamic tracking lane that flips color cleanly based on light/dark mode state */}
//               <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-muted/40" />
//               {/* Hero accent mapped straight to brand-lime */}
//               <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--brand-lime)" strokeWidth="3.5" strokeDasharray="55 100" strokeDashoffset="0" />
//               <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeDasharray="25 100" strokeDashoffset="-55" />
//               <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="3.5" strokeDasharray="20 100" strokeDashoffset="-80" />
//             </svg>
//             <div className="absolute text-center">
//               <span className="block text-xl font-bold text-foreground">102k</span>
//               <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Visits</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3 text-xs">
//             {/* Legend Nodes */}
//             {[
//               { label: "Action", value: "$65,640", color: "bg-brand-lime" },
//               { label: "Sci-Fi", value: "$31,420", color: "bg-green-500" },
//               { label: "Drama", value: "$18,840", color: "bg-yellow-500" },
//               { label: "Thriller", value: "$4,120", color: "bg-purple-500" }
//             ].map((item, index) => (
//               <div key={index}>
//                 <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
//                   <span className={`w-2 h-2 rounded-full ${item.color}`} /> {item.label}
//                 </div>
//                 <span className="font-bold text-foreground ml-3.5">{item.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Sparkline Margin Graph Area */}
//       <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-colors duration-200">
//         <div>
//           <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Realtime Margin</span>
//           <h4 className="text-xl font-bold text-foreground mt-1">$136,755</h4>
//         </div>
        
//         <div className="h-16 w-full mt-4">
//           <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
//             <defs>
//               <linearGradient id="sparkGlow" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor="var(--brand-lime)" stopOpacity="0.25" />
//                 <stop offset="100%" stopColor="var(--brand-lime)" stopOpacity="0.0" />
//               </linearGradient>
//             </defs>
//             <path d="M0,25 Q15,5 30,18 T60,8 T90,22 L100,5 L100,30 L0,30 Z" fill="url(#sparkGlow)" />
//             <path d="M0,25 Q15,5 30,18 T60,8 T90,22 L100,5" fill="none" stroke="var(--brand-lime)" strokeWidth="1.5" strokeLinecap="round" />
//           </svg>
//         </div>
//       </div>

//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { MoreVertical } from "lucide-react"

export default function ChartsSection() {
  const [genreStats, setGenreStats] = useState([])
  const [totalBookingsCount, setTotalBookingsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Explicitly defined palette to match dashboard styling
  const colorPalette = [
    { stroke: "var(--brand-lime)", bg: "bg-brand-lime" },
    { stroke: "#22c55e", bg: "bg-green-500" },
    { stroke: "#eab308", bg: "bg-yellow-500" },
    { stroke: "#a855f7", bg: "bg-purple-500" },
    { stroke: "#3b82f6", bg: "bg-blue-500" },
  ]

  useEffect(() => {
    async function aggregateChartData() {
      try {
        setLoading(true)

        // Fetch data from existing endpoints concurrently
        const [bookingsRes, filmsRes] = await Promise.all([
          fetch("http://localhost:5000/booking/").then((res) => res.json()),
          fetch("http://localhost:5000/film/get-all-film").then((res) => res.json()),
        ])

        const bookings = bookingsRes.data || []
        const films = filmsRes.data || []

        setTotalBookingsCount(bookings.length)

        // 1. Map showtime_id / film_name to its respective Genre
        const filmGenreMap = {}
        films.forEach((film) => {
          if (film.film_name) {
            filmGenreMap[film.film_name.toLowerCase().trim()] = film.genre || "Other"
          }
        })

        // 2. Aggregate counts and estimated ticket seats per genre
        const genreTotals = {}
        let grandTotalSeats = 0

        bookings.forEach((booking) => {
          const filmNameKey = (booking.film_name || "").toLowerCase().trim()
          const genre = filmGenreMap[filmNameKey] || "Other"
          const seatsCount = booking.total_seats || booking.seats?.length || 1

          grandTotalSeats += seatsCount
          if (!genreTotals[genre]) {
            genreTotals[genre] = { seats: 0, count: 0 }
          }
          genreTotals[genre].seats += seatsCount
          genreTotals[genre].count += 1
        })

        // 3. Transform map into calculated percentages for SVG dasharrays
        let accumulatedPercentage = 0
        const processedGenres = Object.keys(genreTotals).map((genre, idx) => {
          const item = genreTotals[genre]
          // Calculate volume share percentage relative to overall seat capacity sold
          const percentage = grandTotalSeats > 0 ? (item.seats / grandTotalSeats) * 100 : 0
          
          // Compute correct offset positions for overlapping stroke layers
          const currentOffset = accumulatedPercentage
          accumulatedPercentage += percentage

          // Cycle colors safely safely if response contains a high variety of genres
          const colorConfig = colorPalette[idx % colorPalette.length]

          return {
            label: genre.charAt(0).toUpperCase() + genre.slice(1),
            value: `${item.seats} Seats`,
            count: item.count,
            percentage,
            strokeDash: `${percentage} 100`,
            strokeOffset: `-${currentOffset}`,
            color: colorConfig.bg,
            strokeColor: colorConfig.stroke,
          }
        })

        setGenreStats(processedGenres)
      } catch (err) {
        console.error("Aggregation failed inside Charts runtime context:", err)
      } finally {
        setLoading(false)
      }
    }

    aggregateChartData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        <div className="h-56 bg-muted rounded-2xl md:col-span-2" />
        <div className="h-56 bg-muted rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Dynamic Donut Chart Component */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 md:col-span-2 shadow-xs transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sales Share By Genre</h4>
=======
"use client"

import { MoreVertical } from "lucide-react"

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Donut Chart Component */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 md:col-span-2 shadow-xs transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sales Overview By Genre</h4>
>>>>>>> 9312dcf23d11b17d8eb34806bf4c765cf47f5b43
          <MoreVertical size={14} className="text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="relative flex justify-center items-center">
            <svg width="140" height="140" viewBox="0 0 36 36" className="transform -rotate-90">
<<<<<<< HEAD
              {/* Backing structural ring track */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-muted/20" />
              
              {/* Live computed sector segments */}
              {genreStats.map((genre, index) => (
                <circle
                  key={index}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke={genre.strokeColor}
                  strokeWidth="3.5"
                  strokeDasharray={genre.strokeDash}
                  strokeDashoffset={genre.strokeOffset}
                  className="transition-all duration-300"
                />
              ))}
            </svg>
            <div className="absolute text-center">
              <span className="block text-xl font-bold text-foreground">{totalBookingsCount}</span>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Orders</span>
=======
              {/* Dynamic tracking lane that flips color cleanly based on light/dark mode state */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-muted/40" />
              {/* Hero accent mapped straight to brand-lime */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--brand-lime)" strokeWidth="3.5" strokeDasharray="55 100" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeDasharray="25 100" strokeDashoffset="-55" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="3.5" strokeDasharray="20 100" strokeDashoffset="-80" />
            </svg>
            <div className="absolute text-center">
              <span className="block text-xl font-bold text-foreground">102k</span>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Visits</span>
>>>>>>> 9312dcf23d11b17d8eb34806bf4c765cf47f5b43
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
<<<<<<< HEAD
            {genreStats.length === 0 ? (
              <div className="col-span-2 text-muted-foreground text-center py-2">No genre allocation logs available.</div>
            ) : (
              genreStats.map((item, index) => (
                <div key={index} className="transition-all duration-150">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5 truncate">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} /> 
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="font-bold text-foreground ml-3.5">{item.value}</span>
                </div>
              ))
            )}
=======
            {/* Legend Nodes */}
            {[
              { label: "Action", value: "$65,640", color: "bg-brand-lime" },
              { label: "Sci-Fi", value: "$31,420", color: "bg-green-500" },
              { label: "Drama", value: "$18,840", color: "bg-yellow-500" },
              { label: "Thriller", value: "$4,120", color: "bg-purple-500" }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} /> {item.label}
                </div>
                <span className="font-bold text-foreground ml-3.5">{item.value}</span>
              </div>
            ))}
>>>>>>> 9312dcf23d11b17d8eb34806bf4c765cf47f5b43
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Sparkline Volume Area Graph */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-colors duration-200">
        <div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">System Volume</span>
          <h4 className="text-xl font-bold text-foreground mt-1">{totalBookingsCount} Active Ledgers</h4>
=======
      {/* Sparkline Margin Graph Area */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-colors duration-200">
        <div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Realtime Margin</span>
          <h4 className="text-xl font-bold text-foreground mt-1">$136,755</h4>
>>>>>>> 9312dcf23d11b17d8eb34806bf4c765cf47f5b43
        </div>
        
        <div className="h-16 w-full mt-4">
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sparkGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-lime)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--brand-lime)" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M0,25 Q15,5 30,18 T60,8 T90,22 L100,5 L100,30 L0,30 Z" fill="url(#sparkGlow)" />
            <path d="M0,25 Q15,5 30,18 T60,8 T90,22 L100,5" fill="none" stroke="var(--brand-lime)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

    </div>
  )
}