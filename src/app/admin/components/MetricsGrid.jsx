<<<<<<< HEAD
// "use client"

// import { Film, TrendingUp, DollarSign, UserPlus } from "lucide-react"

// export default function MetricsGrid({ activeMoviesCount }) {
//   const stats = [
//     { label: "Total Bookings", val: "1,284", growth: "+12%", sub: "vs last month", icon: Film },
//     { label: "Active Movies", val: activeMoviesCount > 0 ? activeMoviesCount.toString() : "24", growth: "Stable", sub: "Live in catalog", icon: TrendingUp },
//     { label: "Revenue Generated", val: "$12,450", growth: "+8%", sub: "vs last quarter", icon: DollarSign },
//     { label: "New Registrations", val: "142", growth: "+18%", sub: "vs yesterday", icon: UserPlus }
//   ]

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//       {stats.map((stat, i) => {
//         const Icon = stat.icon
//         return (
//           <div key={i} className="bg-card text-card-foreground border border-border rounded-2xl p-5 relative overflow-hidden group hover:border-muted-foreground/30 transition-all duration-200 shadow-xs">
//             <div className="flex justify-between items-start mb-3">
//               <p className="text-[11px] text-muted-foreground font-semibold tracking-tight">{stat.label}</p>
//               <Icon size={14} className="text-muted-foreground/60 group-hover:text-brand-lime transition-colors duration-200" />
//             </div>
//             <h3 className="text-2xl font-bold text-foreground tracking-tight">{stat.val}</h3>
//             <div className="flex items-center gap-1.5 mt-2">
//               <span className="text-[10px] text-foreground font-black bg-brand-lime px-1.5 py-0.5 rounded shadow-xs">
//                 {stat.growth}
//               </span>
//               <span className="text-[10px] text-muted-foreground">{stat.sub}</span>
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }





"use client"

import { useEffect, useState } from "react"
import { Film, TrendingUp, Users, Armchair, AlertTriangle, ShieldCheck } from "lucide-react"

export default function MetricsGrid() {
  const [metrics, setMetrics] = useState({
    totalSeats: 0,
    properSeats: 0,
    damagedSeats: 0,
    activeFilms: 0,
    totalEmployees: 0,
    totalCustomers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        
        // Fetch all endpoints concurrently
        const [seatsRes, filmsRes, usersRes] = await Promise.all([
          fetch("http://localhost:5000/seat/").then((res) => res.json()),
          fetch("http://localhost:5000/film/get-all-film").then((res) => res.json()),
          fetch("http://localhost:5000/user/").then((res) => res.json()),
        ])

        // 1. Process Seats Data
        const seatsList = seatsRes.data || []
        const totalSeats = seatsList.length
        const damagedSeats = seatsList.filter((s) => s.seat_type === "DAMAGE").length
        const properSeats = totalSeats - damagedSeats

        // 2. Process Films Data (Filtering by status === "ACTIVE")
        const filmsList = filmsRes.data || []
        const activeFilms = filmsList.filter((f) => f.status === "ACTIVE").length

        // 3. Process Users Data (Filtering by roles)
        const usersList = usersRes.data || []
        const totalEmployees = usersList.filter((u) => u.role === "STAFF" || u.role === "ADMIN").length
        const totalCustomers = usersList.filter((u) => u.role === "USER").length

        setMetrics({
          totalSeats,
          properSeats,
          damagedSeats,
          activeFilms,
          totalEmployees,
          totalCustomers,
        })
      } catch (err) {
        console.error("Failed to fetch dashboard metrics:", err)
        setError("Error connecting to backend services")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-2xl border border-border" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
        {error}. Make sure your backend server running on port 5000 is online.
      </div>
    )
  }

  // Map state values to layout grid items
  const stats = [
    { label: "Active Movies", val: metrics.activeFilms.toString(), sub: "Currently Showing", icon: TrendingUp, color: "bg-brand-lime" },
    { label: "Total Capacity", val: metrics.totalSeats.toString(), sub: "Total Seats Tracked", icon: Armchair, color: "bg-muted" },
    { label: "Operational Seats", val: metrics.properSeats.toString(), sub: "Available for booking", icon: ShieldCheck, color: "bg-emerald-500 text-white" },
    { label: "Damaged Seats", val: metrics.damagedSeats.toString(), sub: "Needs Maintenance", icon: AlertTriangle, color: metrics.damagedSeats > 0 ? "bg-destructive text-destructive-foreground" : "bg-muted" },
    { label: "Registered Customers", val: metrics.totalCustomers.toString(), sub: "Active App Users", icon: Users, color: "bg-brand-lime" },
    { label: "Active Staff", val: metrics.totalEmployees.toString(), sub: "System Employees", icon: Film, color: "bg-muted" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <div key={i} className="bg-card text-card-foreground border border-border rounded-2xl p-4 relative overflow-hidden group hover:border-muted-foreground/30 transition-all duration-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <p className="text-[11px] text-muted-foreground font-semibold tracking-tight uppercase">{stat.label}</p>
                <Icon size={16} className="text-muted-foreground/60 group-hover:text-brand-lime transition-colors duration-200" />
              </div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">{stat.val}</h3>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs ${stat.color}`}>
                Status
              </span>
              <span className="text-[10px] text-muted-foreground truncate">{stat.sub}</span>
=======
"use client"

import { Film, TrendingUp, DollarSign, UserPlus } from "lucide-react"

export default function MetricsGrid({ activeMoviesCount }) {
  const stats = [
    { label: "Total Bookings", val: "1,284", growth: "+12%", sub: "vs last month", icon: Film },
    { label: "Active Movies", val: activeMoviesCount > 0 ? activeMoviesCount.toString() : "24", growth: "Stable", sub: "Live in catalog", icon: TrendingUp },
    { label: "Revenue Generated", val: "$12,450", growth: "+8%", sub: "vs last quarter", icon: DollarSign },
    { label: "New Registrations", val: "142", growth: "+18%", sub: "vs yesterday", icon: UserPlus }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <div key={i} className="bg-card text-card-foreground border border-border rounded-2xl p-5 relative overflow-hidden group hover:border-muted-foreground/30 transition-all duration-200 shadow-xs">
            <div className="flex justify-between items-start mb-3">
              <p className="text-[11px] text-muted-foreground font-semibold tracking-tight">{stat.label}</p>
              <Icon size={14} className="text-muted-foreground/60 group-hover:text-brand-lime transition-colors duration-200" />
            </div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">{stat.val}</h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-foreground font-black bg-brand-lime px-1.5 py-0.5 rounded shadow-xs">
                {stat.growth}
              </span>
              <span className="text-[10px] text-muted-foreground">{stat.sub}</span>
>>>>>>> 9312dcf23d11b17d8eb34806bf4c765cf47f5b43
            </div>
          </div>
        )
      })}
    </div>
  )
}