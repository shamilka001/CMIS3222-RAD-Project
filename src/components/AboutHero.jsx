"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function AboutHero({ detailsTitle, detailsDesc }) {
  const containerRef = useRef(null);

  // Replicating the precise scroll metrics of your landing layout
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Layered vertical translation tracks for the 3D depth illusion
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const foreY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <div 
      ref={containerRef} 
      className="relative h-[550px] md:h-[650px] w-full overflow-hidden bg-black rounded-[3rem] border border-white/10 shadow-2xl"
    >
      {/* LAYER 1: BACKGROUND LAYER (Moves slowest) */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
        style={{ 
          backgroundImage: "url('/images/hero/bg.jpg')",
          y: bgY 
        }}
      />

      {/* LAYER 2: MID-GROUND ATMOSPHERE LAYER */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
        style={{ 
          backgroundImage: "url('/images/hero/mid.png')",
          y: midY 
        }}
      />

      {/* LAYER 3: TYPOGRAPHY CONTENT STRATUM (Sandwiched for deep parallax effect) */}
      <motion.div 
        style={{ y: textY }}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center select-none pointer-events-none"
      >
        <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase max-w-4xl leading-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
          {detailsTitle}
        </h1>
        <p className="text-zinc-300 font-normal text-sm md:text-base max-w-xl mt-5 tracking-normal normal-case leading-relaxed pointer-events-auto drop-shadow-md">
          {detailsDesc}
        </p>
      </motion.div>

      {/* LAYER 4: FOREGROUND CHARACTER / OBJECT CUTOUT (Pops out, moves fastest) */}
      <motion.div 
        style={{ y: foreY }}
        className="absolute inset-0 flex items-end justify-center z-20 pointer-events-none"
      >
        <img 
          src="/images/hero/fore.png" 
          alt="Foreground Character Element" 
          className="h-[85%] md:h-[90%] w-auto object-contain filter drop-shadow-[0_35px_35px_rgba(0,0,0,0.95)]" 
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </motion.div>

      {/* Ambient Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-25 pointer-events-none" />
    </div>
  );
}