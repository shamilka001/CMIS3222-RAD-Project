"use client";

import React, { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

export function CanvasLoader({ videoSrc = "/videos/loader2.mp4" }) {
  const { progress } = useProgress();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400); // Small buffer for smooth texture handoff
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000000] text-white pointer-events-auto"
        >
          {/* Outer Ambient Glow */}
          <div className="relative">
            

            {/* Square Looping Video Box */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border bg-black shadow-2xl flex items-center justify-center">
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              
              {/* Percentage Badge */}
              <span className="absolute bottom-2 text-[10px] font-black tracking-widest text-red-400 bg-black/2 backdrop-blur-sm px-2.5 py-0.5 rounded-full border">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-200">
              Loading Cinema Experience
            </p>
          
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}