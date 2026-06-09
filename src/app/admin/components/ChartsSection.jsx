"use client"

import { MoreVertical } from "lucide-react"

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Donut Chart Component */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 md:col-span-2 shadow-xs transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sales Overview By Genre</h4>
          <MoreVertical size={14} className="text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="relative flex justify-center items-center">
            <svg width="140" height="140" viewBox="0 0 36 36" className="transform -rotate-90">
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Legend Nodes */}
            {[
              { label: "Action", value: "LKR 65,640", color: "bg-brand-lime" },
              { label: "Sci-Fi", value: "LKR 31,420", color: "bg-green-500" },
              { label: "Drama", value: "LKR 18,840", color: "bg-yellow-500" },
              { label: "Thriller", value: "LKR 4,120", color: "bg-purple-500" }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} /> {item.label}
                </div>
                <span className="font-bold text-foreground ml-3.5">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sparkline Margin Graph Area */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-colors duration-200">
        <div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Realtime Margin</span>
          <h4 className="text-xl font-bold text-foreground mt-1">$136,755</h4>
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