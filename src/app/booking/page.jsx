"use client"

import React, { useState } from 'react'
import Link from 'next/link'

export default function BookingDashboard() {
  // Mock state - this would eventually come from your database (e.g., Neon Postgres)
  const [user, setUser] = useState({
    name: "Roshan Pushpakumara",
    email: "roshan.push@university.edu",
    memberSince: "March 2026",
    bookings: [
      { id: 1, movie: "Avatar 3", time: "18:30", date: "May 10", seats: "A12, A13" },
      { id: 2, movie: "The Batman", time: "21:00", date: "May 15", seats: "F5" }
    ]
  })

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      {/* Background Glow - Matches your premium cinema vibe */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-cyan-900/20 blur-[120px] -z-10" />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 p-8 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-black border-2 border-white/20 overflow-hidden">
              {/* Replace with actual user image if available */}
              <div className="w-full h-full flex items-center justify-center text-4xl font-light text-white/40">
                {user.name.charAt(0)}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full scale-0 group-hover:scale-100 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
              </svg>
            </button>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h1 className="text-5xl font-bold tracking-tighter">{user.name}</h1>
            <p className="text-white/40 font-medium">{user.email}</p>
            <div className="flex gap-3 pt-2 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs">Premium Member</span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">Joined {user.memberSince}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Bookings List (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold px-2">Active Tickets</h2>
            
            {user.bookings.map((ticket) => (
              <div key={ticket.id} className="group relative overflow-hidden p-6 rounded-[30px] border border-white/5 bg-gradient-to-r from-white/5 to-transparent hover:border-white/20 transition-all duration-500">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-500 font-bold">Cinema Hall 04</p>
                    <h3 className="text-2xl font-bold">{ticket.movie}</h3>
                    <p className="text-white/50">{ticket.date} • {ticket.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/30 uppercase tracking-widest">Seats</p>
                    <p className="text-xl font-mono text-white/80">{ticket.seats}</p>
                  </div>
                </div>
                
                {/* Visual "Dashed Line" to make it look like a ticket */}
                <div className="mt-6 border-t border-dashed border-white/10 pt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <div className="w-4 h-4 border border-white/20 rounded-sm" />
                    </div>
                    <span className="text-sm self-center text-white/40">Digital QR Ready</span>
                  </div>
                  <button className="px-6 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-cyan-400 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats/Actions (Right column) */}
          <div className="space-y-8">
             <div className="p-8 rounded-[35px] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20">
                <h3 className="text-lg font-bold mb-2">Ready for a movie?</h3>
                <p className="text-sm text-white/60 mb-6">Check out the latest releases and pick your 3D seats.</p>
                <Link href="/movies" className="block w-full py-3 bg-white text-black text-center font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">
                  Book Now
                </Link>
             </div>

             <div className="p-6 rounded-[30px] border border-white/10 bg-white/5">
                <h3 className="font-semibold mb-4">Account Settings</h3>
                <div className="space-y-2">
                   {['Payment Methods', 'Watchlist', 'Security', 'Logout'].map((item) => (
                     <button key={item} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-sm text-white/60 hover:text-white transition-colors">
                       {item}
                     </button>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}