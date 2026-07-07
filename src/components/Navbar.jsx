"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // Intuitive icons for muscle memory
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({
  onContactClick,
  onHomeClick,
  onAboutClick,
  onLoginClick,
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu drawer trigger state
  const router = useRouter();
  const pathname = usePathname(); // Tracks what page path the user is visiting

  // Handle Auth State
  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth); // For multi-tab support

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  const handleHomeClick = () => {
    setIsOpen(false);
    if (onHomeClick && pathname === "/") {
      onHomeClick();
    } else {
      router.push("/");
    }
  };

  const handleAboutClick = () => {
    setIsOpen(false);
    if (onAboutClick && pathname === "/") {
      onAboutClick();
    } else {
      router.push("/?action=about");
    }
  };

  const handleContactClick = () => {
    setIsOpen(false);
    if (onContactClick && pathname === "/") {
      onContactClick();
    } else {
      router.push("/?action=contact");
    }
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    if (!isLoggedIn) {
      if (onLoginClick && pathname === "/") {
        onLoginClick();
      } else {
        router.push("/?action=login");
      }
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  return (
    <>
      {/* ─── MAIN FLOATING NAVBAR ROW ─── */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl bg-black/30 text-white px-6 md:px-8 py-4 flex items-center justify-between rounded-full shadow-2xl backdrop-blur-md border border-white/10">
        
        {/* Logo (Stays visible across both mobile & desktop) */}
        <div
          className="flex items-center gap-2 cursor-pointer z-[110]"
          onClick={handleHomeClick}
        >
          <img src="/icons/logo.png" alt="MaxLight" className="h-8 w-8" />
          <span className="font-black italic uppercase tracking-tighter text-xl">
            MaxLight
          </span>
        </div>

        {/* DESKTOP CONTENT BLOCK (Hidden entirely on mobile screens) */}
        <div className="hidden md:flex gap-12 mx-auto">
          <button
            onClick={handleHomeClick}
            className="text-xs font-black uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors outline-none cursor-pointer"
          >
            Home
          </button>

          <button
            onClick={handleAboutClick}
            className="text-xs font-black uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors outline-none cursor-pointer"
          >
            About
          </button>

          <button
            onClick={handleContactClick}
            className="text-xs font-black uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors outline-none cursor-pointer"
          >
            Contact
          </button>
        </div>

        {/* DESKTOP AUTH CONTROLS BLOCK (Hidden entirely on mobile screens) */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <button
              onClick={handleLoginClick}
              className="px-6 py-2 rounded-full border border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={handleProfileClick}
                className="px-6 py-2 rounded-full bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all cursor-pointer"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-[9px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-tighter cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER TOGGLE BUTTON (Hidden on Desktop layouts) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 focus:outline-none z-[110] hover:text-cyan-400 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ─── MOBILE DRAWER MENU OVERLAY ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[95] md:hidden flex flex-col items-center justify-center gap-10 px-6 text-center shadow-inner"
          >
            {/* Nav Links Stack */}
            <div className="flex flex-col gap-6 w-full max-w-xs text-xs font-black tracking-[0.3em] uppercase">
              <button
                onClick={handleHomeClick}
                className="text-zinc-400 hover:text-cyan-400 py-3 border-b border-white/5 transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={handleAboutClick}
                className="text-zinc-400 hover:text-cyan-400 py-3 border-b border-white/5 transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={handleContactClick}
                className="text-zinc-400 hover:text-cyan-400 py-3 border-b border-white/5 transition-colors cursor-pointer"
              >
                Contact
              </button>

              {/* Responsive Contextual Auth Button Block */}
              <div className="pt-6">
                {!isLoggedIn ? (
                  <button
                    onClick={handleLoginClick}
                    className="w-full py-4 rounded-full border border-white/20 text-white font-black hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all tracking-widest cursor-pointer"
                  >
                    Login / Register
                  </button>
                ) : (
                  <div className="flex flex-col gap-4 items-center">
                    <button
                      onClick={handleProfileClick}
                      className="w-full py-4 rounded-full bg-cyan-500 text-black font-black tracking-widest shadow-lg shadow-cyan-500/20 hover:bg-white transition-all cursor-pointer"
                    >
                      Go To Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors tracking-widest uppercase mt-2 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}