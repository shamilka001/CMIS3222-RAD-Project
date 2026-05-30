"use client"

import { Home, Users, Film, BarChart3, Settings, LogOut, Ticket } from "lucide-react"

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Ticket },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-64 h-[95vh] sticky top-[2.5vh] ml-4 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] flex flex-col p-6 z-50">
      <div className="mb-12 px-4">
        <span className="font-black italic uppercase tracking-tighter text-2xl text-cyan-500">MaxLight</span>
        <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold">Admin Portal</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === item.id 
                ? "bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20" 
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all mt-auto">
        <LogOut size={20} />
        <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
      </button>
    </aside>
  )
}