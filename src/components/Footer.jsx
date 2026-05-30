"use client";

import React from "react";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: "Movies", links: ["Now Showing", "Coming Soon", "Special Events", "Box Office"] },
    { title: "Support", links: ["Help Center", "Terms of Use", "Privacy Policy", "Refunds"] },
    { title: "Cinema", links: ["Locations", "Experience", "Food & Drinks", "Offers"] },
  ];

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/40 backdrop-blur-xl rounded-t-[3rem]">
      {/* Decorative Cyan Glow line - Adjusted to follow the curve slightly */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-cyan-500/30 blur-sm rounded-full" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              MaxX<span className="text-cyan-500 underline decoration-2">Lite</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Experience cinema like never before with the latest 3D technology and immersive soundscapes in Moratuwa.
            </p>
            
            <div className="flex space-x-5 text-gray-500">
              <FooterSocialIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </FooterSocialIcon>
              <FooterSocialIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </FooterSocialIcon>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 md:grid-cols-3">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-6 text-gray-400 text-[10px] sm:text-xs uppercase font-medium tracking-tight">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-cyan-500">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg> 
              K-Zone, Moratuwa
            </span>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-cyan-500">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg> 
              +94 11 234 5678
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 italic font-medium">
            &copy; {currentYear} MaxX Lite Cinema.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterSocialIcon({ children }) {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -3, color: "#06b6d4" }}
      className="hover:text-cyan-500 transition-colors cursor-pointer"
    >
      {children}
    </motion.a>
  );
}