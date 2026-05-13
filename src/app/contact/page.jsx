"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center pt-32 pb-20 lg:pt-40 p-6">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Persistent Navigation Header */}
      <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-50">
        <button 
          onClick={() => router.push("/")}
          className="text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-cyan-500 transition-colors"
        >
          ← Back to Home
        </button>
      </nav>

      {/* Main Content Container */}
      <div className="w-full max-w-6xl relative z-10">
        
        {/* MAP: Spanning full width (2 columns) */}
        <div className="relative w-full h-[300px] lg:h-[450px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl mb-16">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450937!2d144.9537353153167!3d-37.81033277975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sau!4v1611550000000!5m2!1sen!2sau"
            width="100%"
            height="100%"
            style={{ 
                border: 0, 
                filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' 
            }}
            allowFullScreen=""
            loading="lazy"
            className="grayscale-[20%]"
          ></iframe>
          {/* Glassy Overlay Frame */}
          <div className="absolute inset-0 pointer-events-none border-[12px] border-black/40 rounded-[3rem]"></div>
        </div>

        {/* BOTTOM GRID: Split into 2 columns for Info and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Section 1: Branding & Info */}
          <div className="flex flex-col justify-start space-y-10">
            <div>
              <h2 className="text-cyan-500 font-bold tracking-[0.3em] text-xs uppercase mb-4">Inquiry Portal</h2>
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
                LET'S <br /> <span className="text-white/20 uppercase">Connect.</span>
              </h1>
              
              <div className="space-y-8 mt-12">
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl transition-all group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10">
                        ✉️
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Email Us</p>
                        <p className="font-bold text-lg">mora@maxlite.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl transition-all group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10">
                        📍
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">HQ Location</p>
                        <p className="font-bold text-lg">University Innovation Hub</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Form */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-14 shadow-2xl relative self-start">
            {status === "success" ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center text-black text-4xl shadow-[0_0_50px_rgba(6,182,212,0.4)]">✓</div>
                <h3 className="text-3xl font-black tracking-tighter uppercase">Message Received</h3>
                <button onClick={() => setStatus("idle")} className="text-cyan-500 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors">Send Another Entry</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-2">Full Name</label>
                    <input required type="text" placeholder="Enter Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 text-white placeholder:text-white/10 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-2">Topic</label>
                    <div className="relative">
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white appearance-none cursor-pointer">
                        <option className="bg-zinc-900">General Inquiry</option>
                        <option className="bg-zinc-900">Startup Partnership</option>
                        <option className="bg-zinc-900">Technical Support</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-xs">▼</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-2">Email Address</label>
                  <input required type="email" placeholder="name@email.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 text-white placeholder:text-white/10 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-2">Message Detail</label>
                  <textarea required rows="4" placeholder="Tell us what's on your mind..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-cyan-500/50 text-white resize-none placeholder:text-white/10 transition-all" />
                </div>
                <button type="submit" className="w-full py-5 rounded-2xl font-black tracking-[0.3em] uppercase bg-cyan-500 text-black hover:bg-white hover:scale-[1.01] active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20">
                  {status === "sending" ? "TRANSMITTING..." : "SEND MESSAGE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}