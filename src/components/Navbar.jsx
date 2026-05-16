"use client";

import React, { useState } from 'react';

export default function Navbar({ onContactClick, onHomeClick, onLoginClick }) {
  // This state can stay here for UI testing, but eventually, 
  // you'll likely lift this to a global context.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    // If we aren't logged in, show the login view
    if (!isLoggedIn) {
      onLoginClick();
    }
  };

  return (
    <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl bg-black/30 text-white px-8 py-4 items-center rounded-full shadow-2xl backdrop-blur-md border border-white/10">

      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
        <img src="/icons/logo.png" alt="MaxLight" className="h-8 w-8" />
        <span className="font-black italic uppercase tracking-tighter text-xl">MaxLight</span>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-12 mx-auto">
        <button 
          onClick={onHomeClick}
          className="text-xs font-black uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors outline-none"
        >
          Home
        </button>
        
        <button 
          onClick={onContactClick}
          className="text-xs font-black uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors outline-none"
        >
          Contact
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <button 
            onClick={handleLoginClick}
            className="px-6 py-2 rounded-full border border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 rounded-full bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all">
              Profile
            </button>
            <button 
              onClick={() => setIsLoggedIn(false)} 
              className="text-[9px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-tighter"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}