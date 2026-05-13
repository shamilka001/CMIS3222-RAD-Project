"use client"

import React, { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  // STATIC TOGGLE: Change this to 'true' to see the Profile button, 
  // or 'false' to see the Login button.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="bg-black/30 text-amber-50 px-6 py-4 flex items-center rounded-full shadow-lg backdrop-blur-xs border border-white/20 backdrop-saturate-150">

      {/* Logo */}
      <div className="text-2xl font-bold flex items-center gap-2">
        <img src="/icons/logo.png" alt="CinemaHub" className="h-10 w-10" />
      </div>

      {/* Navigation Links */}
      <div className="flex gap-16 text-lg mx-auto pl-24">
        <Link href="/" className="hover:text-red-400 transition-colors">
          Home
        </Link>
        <Link href="/contact" className="hover:text-red-400 transition-colors">
          Contact us
        </Link>
      </div>

      {/* Action Buttons (RIGHT SIDE) */}
      <div className="ml-auto flex items-center gap-4">
        
        {/* CONDITIONAL RENDERING LOGIC */}
        {!isLoggedIn ? (
          // 1. Shown only when NOT logged in
          <Link href="/login">
            <button className="px-5 py-2 rounded-full border border-white/30 hover:bg-white/10 hover:border-white transition-all text-sm font-medium">
              Login
            </button>
          </Link>
        ) : (
          // 2. Shown only when LOGGED in
          <div className="flex items-center gap-4">
            <Link href="/booking">
              <button className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-105 transition-all duration-300 active:scale-95">
                Profile
              </button>
            </Link>
            
            {/* Optional: Logout button to test the toggle */}
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        )}
        
      </div>
    </nav>
  )
}