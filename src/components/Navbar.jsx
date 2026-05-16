"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar({ onContactClick, onHomeClick, onLoginClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Handle Auth State
  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    window.addEventListener('storage', checkAuth); // For multi-tab support

    return () => {
      window.removeEventListener('auth-change', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
  };

  const handleHomeClick = () => {
    if (onHomeClick) onHomeClick();
    else router.push("/");
  };

  const handleContactClick = () => {
    if (onContactClick) onContactClick();
    else router.push("/contact");
  };

  const handleAboutClick = () => {
    router.push("/about");
  };

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      onLoginClick ? onLoginClick() : router.push("/login");
    }
  };

  return (
    <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl bg-black/30 text-white px-8 py-4 items-center rounded-full shadow-2xl backdrop-blur-md border border-white/10">

      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
        <img src="/icons/logo.png" alt="MaxLight" className="h-8 w-8" />
        <span className="font-black italic uppercase tracking-tighter text-xl">MaxLight</span>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-12 mx-auto">
        <button 
          onClick={handleHomeClick}
          className="text-xs font-black uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors outline-none"
        >
          Home
        </button>
        
        <button 
          onClick={handleAboutClick}
          className="text-xs font-black uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors outline-none"
        >
          About
        </button>

        <button 
          onClick={handleContactClick}
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
            <button 
              onClick={() => router.push('/profile')}
              className="px-6 py-2 rounded-full bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
            >
              Profile
            </button>
            <button 
              onClick={handleLogout} 
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