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

"use client";

import { useEffect, useState } from "react";
import { Film, Armchair, AlertTriangle, Calendar, Loader2 } from "lucide-react";

export default function MetricsGrid() {
  const [metrics, setMetrics] = useState({
    totalFilms: 0,
    totalSeats: 0,
    damagedSeats: 0,
    totalShowtimes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);

        // Execute endpoints calls in parallel
        const [filmsRes, seatsRes, showtimesRes] = await Promise.all([
          fetch("http://localhost:5000/film/get-all-film"),
          fetch("http://localhost:5000/seat"),
          fetch("http://localhost:5000/showtime/"),
        ]);

        if (!filmsRes.ok || !seatsRes.ok || !showtimesRes.ok) {
          throw new Error("One or more metrics failed to fetch successfully.");
        }

        const [filmsJson, seatsJson, showtimesJson] = await Promise.all([
          filmsRes.json(),
          seatsRes.json(),
          showtimesRes.json(),
        ]);

        const filmsData = filmsJson.data || [];
        const seatsData = seatsJson.data || [];
        const showtimesData = showtimesJson.data || [];

        // Compute seat parameters separately
        const totalSeatsCount = seatsData.length;
        const damagedSeatsCount = seatsData.filter(
          (seat) => seat.seat_type === "DAMAGE",
        ).length;

        setMetrics({
          totalFilms: filmsData.length,
          totalSeats: totalSeatsCount,
          damagedSeats: damagedSeatsCount,
          totalShowtimes: showtimesData.length,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred fetching metrics.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-card text-card-foreground border border-border rounded-2xl min-h-[140px]">
        <Loader2 className="h-6 w-6 animate-spin text-brand-lime" />
        <p className="text-xs text-muted-foreground mt-2">
          Syncing dynamic runtime metrics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-card text-destructive border border-destructive/20 rounded-2xl text-xs text-center font-medium">
        Metrics Engine Alert: {error}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Movies",
      val: metrics.totalFilms.toString(),
      badge: "Catalog",
      sub: "Active film profiles",
      icon: Film,
    },
    {
      label: "Total Seats",
      val: metrics.totalSeats.toString(),
      badge: "Capacity",
      sub: "Total registered house inventory",
      icon: Armchair,
    },
    {
      label: "Damaged Seats",
      val: metrics.damagedSeats.toString(),
      badge: "Alerts",
      sub: "Flagged maintenance profiles",
      icon: AlertTriangle,
      isAlert: metrics.damagedSeats > 0,
    },
    {
      label: "Scheduled Showtimes",
      val: metrics.totalShowtimes.toString(),
      badge: "Active",
      sub: "Showtimes live on calendar",
      icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-card text-card-foreground border border-border rounded-2xl p-5 relative overflow-hidden group hover:border-muted-foreground/30 transition-all duration-200 shadow-xs"
          >
            <div className="flex justify-between items-start mb-3">
              <p className="text-[11px] text-muted-foreground font-semibold tracking-tight uppercase">
                {stat.label}
              </p>
              <Icon
                size={14}
                className={`transition-colors duration-200 ${
                  stat.isAlert
                    ? "text-red-500 group-hover:text-red-400"
                    : "text-muted-foreground/60 group-hover:text-brand-lime"
                }`}
              />
            </div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              {stat.val}
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider ${
                  stat.isAlert
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : "bg-brand-lime text-black"
                }`}
              >
                {stat.badge}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {stat.sub}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
