"use client"

import React, { useState } from 'react'
import CinemaBooking from "@/components/booking/CinemaBooking";

export default function BookingDashboard() {
  const [isBooking, setIsBooking] = useState(false);

  const [user, setUser] = useState({
    name: "Roshan Pushpakumara",
    email: "roshan.push@university.edu",
    memberSince: "March 2026",
    bookings: [
      { id: 1, movie: "Avatar 3", time: "18:30", date: "May 10", seats: "A12, A13" },
      { id: 2, movie: "The Batman", time: "21:00", date: "May 15", seats: "F5" }
    ]
  })

  // When isBooking is true, we return ONLY the CinemaBooking component 
  // wrapped in a high z-index container to hide everything else.
  if (isBooking) {
    return (
      <div className="fixed inset-0 z-[1000] bg-black">
        <CinemaBooking onBack={() => setIsBooking(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-cyan-900/20 blur-[120px] -z-10" />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 p-8 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-black border-2 border-white/20 flex items-center justify-center text-4xl font-light text-white/40">
            {user.name.charAt(0)}
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-5xl font-bold tracking-tighter">{user.name}</h1>
            <p className="text-white/40 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold px-2">Active Tickets</h2>
            {user.bookings.map((ticket) => (
              <div key={ticket.id} className="p-6 rounded-[30px] border border-white/5 bg-white/5">
                <h3 className="text-2xl font-bold">{ticket.movie}</h3>
                <p className="text-white/50">{ticket.date} • {ticket.time}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
             <div className="p-8 rounded-[35px] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 text-center">
                <h3 className="text-lg font-bold mb-2 text-white">Ready for a movie?</h3>
                <p className="text-sm text-white/60 mb-6">Experience our new cinematic seat selector.</p>
                <button 
                  onClick={() => setIsBooking(true)}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                >
                  Book Now
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}