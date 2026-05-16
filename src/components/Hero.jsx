"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function HeroParallax() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const midRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%", 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(bgRef.current, { yPercent: 20, ease: "none" }, 0);
      tl.to(midRef.current, { yPercent: -20, ease: "none" }, 0);
      
      tl.to(contentRef.current, { 
        opacity: 0, 
        y: -100, 
        filter: "blur(20px)" 
      }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-black"
      /* 1. Global Mask: Fades the top and bottom of the entire hero section */
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    >
      {/* LAYER 1: BACKGROUND */}
      <div ref={bgRef} className="absolute inset-0 z-0 h-[120%] w-full top-[-10%]">
        <Image 
          src="/images/hero/bg1.jpg" 
          alt="Background" 
          fill 
          className="object-cover opacity-80" 
          priority
        />
      </div>

      {/* LAYER 2: MID-GROUND */}
      <div 
        ref={midRef} 
        className="absolute inset-0 z-10 h-[120%] w-full top-[-10%]"
        /* 2. Mid Layer Mask: Fades the bottom of the mid image specifically */
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
        }}
      >
        <Image 
          src="/images/hero/mid1.png" 
          alt="Mid Layer" 
          fill 
          className="object-cover" 
        />
      </div>

      {/* CONTENT */}
      <div 
        ref={contentRef} 
        className="relative z-30 flex h-full flex-col items-center justify-center text-center px-4"
      >
        <h1 className="text-7xl md:text-[12rem] font-black uppercase italic tracking-tighter text-white drop-shadow-2xl">
          Max<span className="text-red-500">Lite</span>
        </h1>
        <p className="text-gray-400 font-bold tracking-[0.5em] uppercase text-sm mt-4">
          Unreal Depth
        </p>
      </div>
    </section>
  );
}