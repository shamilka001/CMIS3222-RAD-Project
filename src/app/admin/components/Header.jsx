"use client"

import { Search } from "lucide-react"

export default function Header({ activeTab }) {
  return (
    <header className="bg-card text-card-foreground border border-border rounded-2xl p-4 flex justify-between items-center shadow-xs transition-colors duration-200">
      {/* Breadcrumb Navigation Trail */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        <span className="text-muted-foreground/60">Dashboards</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground font-black border-b-2 border-brand-lime pb-0.5">{activeTab}</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Modern Styled Search Matrix */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={14} />
          <input 
            type="text" 
            placeholder="Quick search... (⌘K)" 
            className="bg-input border border-border text-xs rounded-xl pl-9 pr-4 py-2 w-48 focus:outline-none focus:ring-1 focus:ring-brand-lime focus:border-brand-lime transition-all text-foreground placeholder:text-muted-foreground/50 font-medium"
          />
        </div>
      
      </div>
    </header>
  )
}