"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function HeroParallax({ title, subtitle, detailsTitle, detailsDesc }) {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const midRef = useRef(null);
  const contentRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(bgRef.current, { yPercent: 30, ease: "none" }, 0);
      tl.to(midRef.current, { yPercent: -30, ease: "none" }, 0);
      
      // Initial content fades out
      tl.to(contentRef.current, { 
        opacity: 0, 
        y: -150, 
        filter: "blur(20px)",
        duration: 0.5
      }, 0);

      // Details fade in as content fades out
      tl.fromTo(detailsRef.current, 
        { opacity: 0, y: 100, filter: "blur(10px)" },
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          duration: 0.5 
        }, 
        0.3
      );

      // Details fade out at the very end
      tl.to(detailsRef.current, {
        opacity: 0,
        y: -50,
        filter: "blur(10px)",
        duration: 0.2
      }, 0.8);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-black"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    >
      {/* LAYER 1: BACKGROUND */}
      <div ref={bgRef} className="absolute inset-0 z-0 h-[130%] w-full top-[-15%]">
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
        className="absolute inset-0 z-10 h-[130%] w-full top-[-15%]"
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

      {/* CONTENT LAYER 1: HEADING */}
      <div 
        ref={contentRef} 
        className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4"
      >
        <h1 className="text-7xl md:text-[10rem] font-black uppercase italic tracking-tighter text-white drop-shadow-2xl leading-[0.8]">
          {title || <>Max<span className="text-red-500">Lite</span></>}
        </h1>
        <p className="text-gray-400 font-bold tracking-[0.5em] uppercase text-sm mt-8">
          {subtitle || "Unreal Depth"}
        </p>
      </div>

      {/* CONTENT LAYER 2: SUB-DETAILS */}
      <div 
        ref={detailsRef} 
        className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-6"
      >
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 max-w-4xl leading-tight">
          {detailsTitle || "Cinema Reimagined for the Modern Age"}
        </h2>
        <p className="text-cyan-500 font-black tracking-[0.4em] uppercase text-xs md:text-sm max-w-2xl">
          {detailsDesc || "Experience movies in stunning 4K with Dolby Atmos sound in the heart of Moratuwa."}
        </p>
      </div>
    </section>
  );
}