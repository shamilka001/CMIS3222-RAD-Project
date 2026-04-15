"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-black/30 text-amber-50 px-6 py-4 flex items-center rounded-full shadow-lg backdrop-blur-xs border border-white/20 backdrop-saturate-150">

      {/* Logo */}
      <div className="text-2xl font-bold flex items-center gap-2">
        <img src="/icons/logo.png" alt="CinemaHub" className="h-10 w-10" />
      </div>

      {/* Navigation Links */}
      <div className="flex gap-16 text-lg mx-auto">
        <Link href="/" className="hover:text-red-400">
          Home
        </Link>

        <Link href="/movies" className="hover:text-red-400">
          Contact us
        </Link>
      </div>

      {/* Profile Button (RIGHT SIDE) */}
      <button className="ml-auto px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-105 transition-all duration-300">
        Profile
      </button>

    </nav>
  )
}