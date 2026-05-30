"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { id: 1, bg: '/bg1.jpg', text: 'ACTION', fore: '/hero1.png' },
  { id: 2, bg: '/bg2.jpg', text: 'DRAMA', fore: '/hero2.png' },
  { id: 3, bg: '/bg3.jpg', text: 'SCI-FI', fore: '/hero3.png' },
];

const CinemaHero = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div key={index} className="absolute inset-0">
          
          {/* BACKGROUND: Moves slowly */}
          <motion.div 
            initial={{ x: '2%', opacity: 0 }}
            animate={{ x: 0, opacity: 0.5 }}
            exit={{ x: '-2%', opacity: 0 }}
            transition={{ duration: 1.2, ease: "linear" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[index].bg})` }}
          />

          {/* TEXT: Moves medium speed */}
          <motion.div 
            initial={{ x: '30%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-15%', opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <h2 className="text-8xl font-black text-white italic">{slides[index].text}</h2>
          </motion.div>

          {/* FOREGROUND: Moves fastest */}
          <motion.div 
            initial={{ x: '60%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 flex items-end justify-center z-20"
          >
            <img src={slides[index].fore} alt="Character" className="h-full object-contain" />
          </motion.div>

        </motion.div>
      </AnimatePresence>

      <button onClick={nextSlide} className="absolute bottom-5 right-5 z-30 text-white border p-2">
        Next
      </button>
    </div>
  );
};

export default CinemaHero;