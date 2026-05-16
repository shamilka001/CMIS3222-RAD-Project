"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function CinematicTransition({ isTriggered, children }) {
  const videoRef = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const [isReady, setIsReady] = useState(false);

  // Force play when triggered AND video is ready
  useEffect(() => {
    if (isTriggered && videoRef.current && isReady) {
      const attemptPlay = async () => {
        try {
          await videoRef.current.play();
        } catch (err) {
          console.error("Video play failed:", err);
          setShowContent(true); // Fail-safe: show content if video is blocked
        }
      };
      attemptPlay();
    }
  }, [isTriggered, isReady]);

  const handleVideoEnd = () => {
    setVideoOpacity(0.4);
    setShowContent(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* TRANSITION VIDEO LAYER */}
      <div className="fixed inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          onCanPlayThrough={() => setIsReady(true)} // Wait for buffer
          onEnded={handleVideoEnd}
          autoPlay
          muted
          playsInline
          preload="auto"
          src="/animations/contact.mp4" 
          className="w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: videoOpacity }}
        />
        
        {showContent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"
          />
        )}
      </div>

      {/* PAGE CONTENT LAYER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}