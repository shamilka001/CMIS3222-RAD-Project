"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroParallax } from "@/components/Hero";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      
      <HeroParallax 
        title={<>About <span className="text-cyan-500">Us</span></>} 
        subtitle="The Future of Cinema in Moratuwa"
        detailsTitle="Crafting Unforgettable Cinematic Memories"
        detailsDesc="Since our inception, MaxLite has pushed the boundaries of what a local cinema can be. We bring global standards to your doorstep."
      />

      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 italic">
              Our <span className="text-cyan-500">Vision</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
              MaxLite Cinema was born from a desire to redefine the movie-going experience in Moratuwa. We combine state-of-the-art projection technology with immersive sound systems to bring you closer to the action than ever before.
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Our mission is to create a community hub for film lovers, offering not just movies, but unforgettable experiences that stay with you long after the credits roll.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10"
          >
             <img 
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80" 
              alt="Cinema Interior"
              className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
          </motion.div>
        </div>

        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-10">
           {[
             { title: "4K Projection", desc: "Crystal clear visuals with the latest laser technology." },
             { title: "Dolby Atmos", desc: "Immersive 360-degree soundscapes for true depth." },
             { title: "Premium Seating", desc: "Luxurious recliner seats for maximum comfort." }
           ].map((feature, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: idx * 0.2 }}
               viewport={{ once: true }}
               className="p-10 rounded-[2.5rem] bg-zinc-950 border border-white/5 hover:border-cyan-500/30 transition-colors"
             >
               <h3 className="text-xl font-black uppercase tracking-widest text-cyan-500 mb-4">{feature.title}</h3>
               <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
