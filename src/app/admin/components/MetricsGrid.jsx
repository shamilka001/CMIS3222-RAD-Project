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
            </div>
          </div>
        )
      })}
    </div>
  )
}