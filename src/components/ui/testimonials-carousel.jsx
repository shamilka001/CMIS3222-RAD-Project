"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion"; // Changed to framer-motion based on your imports

export const TestimonialsCarousel = ({
  testimonials = [],
  speed = 20,
  direction = "left",
  cardHeight = 200,
  className = "",
}) => {
  const containerRef = useRef(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setCarouselWidth(containerRef.current.scrollWidth / 2);
    }
  }, [testimonials]);

  // Duplicate array to create continuous infinite scroll effect
  const loopTestimonials = [...testimonials, ...testimonials];

  return (
    <div className={`overflow-hidden w-full ${className}`} ref={containerRef}>
      <motion.div
        animate={{
          x:
            direction === "left"
              ? [0, -carouselWidth]
              : [-carouselWidth, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-6 w-max" // Added w-max to ensure proper width calculation
      >
        {loopTestimonials.map(({ text, highlight, image, name, role }, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03, rotate: 0.5 }}
            // Forced Dark Mode & Glassmorphism UI
            className="bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl p-6 flex-shrink-0 w-[320px] flex flex-col justify-between"
            style={{ height: cardHeight }}
          >
            <p className="text-sm leading-relaxed text-justify break-words whitespace-normal overflow-hidden text-zinc-300">
              {highlight
                ? text?.split(highlight).map((part, idx, arr) => (
                    <React.Fragment key={idx}>
                      {part}
                      {idx !== arr.length - 1 && (
                        <span className="text-cyan-400 font-bold tracking-wide">
                          {highlight}
                        </span>
                      )}
                    </React.Fragment>
                  ))
                : text}
            </p>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/10 border-2 border-white/20" /> // Fallback if no image
              )}
              <div className="flex flex-col">
                <div className="font-semibold text-sm leading-tight text-white uppercase tracking-wider">
                  {name}
                </div>
                <div className="text-xs text-cyan-500/80 mt-0.5">
                  {role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};