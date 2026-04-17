// src/components/AutoCameraTheater.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { motion } from "framer-motion";

// Camera Controller
function AutoCameraController({ shouldAnimate, onAnimationComplete }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (!shouldAnimate) return;
    
    console.log("Starting camera animation...");
    
    // Start position - Center seat view
    const startPos = { x: 0, y: 1.5, z: 2.5 };
    // End position - Birds-eye view
    const endPos = { x: 0, y: 10, z: 0 };
    
    // Set start position
    camera.position.set(startPos.x, startPos.y, startPos.z);
    camera.lookAt(0, 1, -1);
    
    // Animate
    const tl = gsap.to(camera.position, {
      x: endPos.x,
      y: endPos.y,
      z: endPos.z,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
      },
      onComplete: () => {
        console.log("Animation complete");
        onAnimationComplete();
      }
    });
    
    return () => tl.kill();
  }, [shouldAnimate, camera, onAnimationComplete]);
  
  return null;
}

// Simple Seat Component
function Seat({ position, seatId, isSelected, isAvailable, onSelect }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => isAvailable && onSelect(seatId)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.7, 0.4, 0.7]} />
      <meshStandardMaterial 
        color={isSelected ? "#ffd700" : isAvailable ? "#4a4a4a" : "#2a2a2a"}
        emissive={isSelected ? "#ffd700" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
      {/* Seat Back */}
      <mesh position={[0, 0.35, -0.4]}>
        <boxGeometry args={[0.7, 0.5, 0.1]} />
        <meshStandardMaterial color={isSelected ? "#ffd700" : "#4a4a4a"} />
      </mesh>
      
      {hovered && isAvailable && !isSelected && (
        <Html center>
          <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">
            {seatId}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Theater Scene
function TheaterScene({ seatCount, selectedSeats, onSeatSelect }) {
  // Create seats: 6 rows, 10 seats per row
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seatsPerRow = 10;
  
  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />
      
      {/* Screen */}
      <mesh position={[0, 2.5, -5]}>
        <planeGeometry args={[8, 4.5]} />
        <meshStandardMaterial color="#1a1a3e" emissive="#ffd700" emissiveIntensity={0.1} />
      </mesh>
      
      {/* Screen Frame */}
      <mesh position={[0, 2.5, -4.98]}>
        <boxGeometry args={[8.3, 4.8, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {/* Generate all seats */}
      {rows.map((row, rowIndex) => {
        const startZ = -2 + rowIndex * 1.2;
        const startX = -4.5;
        
        return [...Array(seatsPerRow)].map((_, colIndex) => {
          const seatId = `${row}${colIndex + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isAvailable = selectedSeats.length < seatCount || isSelected;
          
          return (
            <Seat
              key={seatId}
              position={[startX + colIndex * 1.0, 0, startZ]}
              seatId={seatId}
              isSelected={isSelected}
              isAvailable={isAvailable}
              onSelect={onSeatSelect}
            />
          );
        });
      })}
      
      <Environment preset="night" />
    </group>
  );
}

// Main Component
export default function AutoCameraTheater({ movie, onBookingComplete, onBack }) {
  const [seatCount, setSeatCount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  const rows = ["A", "B", "C", "D", "E", "F"];
  
  const handleStartJourney = () => {
    if (seatCount > 0) {
      setStep(2);
      setAnimate(true);
    }
  };
  
  const handleAnimationComplete = () => {
    setStep(3);
    setShowMap(true);
  };
  
  const handleSeatSelect = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else if (selectedSeats.length < seatCount) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };
  
  const handleConfirm = () => {
    if (selectedSeats.length === seatCount) {
      onBookingComplete({ 
        movie: movie?.title,
        seats: selectedSeats, 
        count: seatCount,
        total: selectedSeats.length * 14.99
      });
    }
  };
  
  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 2.5], fov: 70 }}
        style={{ background: "#000000" }}
      >
        <TheaterScene
          seatCount={seatCount}
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
        />
        
        {animate && (
          <AutoCameraController 
            shouldAnimate={animate}
            onAnimationComplete={handleAnimationComplete}
          />
        )}
      </Canvas>
      
      {/* Step 1: Seat Count */}
      {step === 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 text-center min-w-[300px] border border-yellow-500/30">
            <h2 className="text-2xl font-bold text-white mb-2">{movie?.title}</h2>
            <p className="text-gray-400 mb-6">How many seats?</p>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <button onClick={() => setSeatCount(Math.max(0, seatCount - 1))} className="w-12 h-12 bg-gray-700 rounded-full text-white text-2xl">-</button>
              <span className="text-5xl font-bold text-yellow-400">{seatCount}</span>
              <button onClick={() => setSeatCount(Math.min(10, seatCount + 1))} className="w-12 h-12 bg-gray-700 rounded-full text-white text-2xl">+</button>
            </div>
            
            <button onClick={handleStartJourney} disabled={seatCount === 0} className="w-full py-3 bg-yellow-500 text-black rounded-full font-bold disabled:bg-gray-700 disabled:text-gray-400">
              Start Cinematic Journey
            </button>
            
            <button onClick={onBack} className="mt-4 text-gray-500 text-sm">← Back</button>
          </div>
        </div>
      )}
      
      {/* Step 2: Animation Progress */}
      {step === 2 && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-64">
          <div className="bg-black/80 rounded-full p-3">
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 animate-progress" />
            </div>
            <p className="text-white text-xs text-center mt-2">Camera rising to top view...</p>
          </div>
        </div>
      )}
      
      {/* Step 3: Seat Map */}
      {step === 3 && showMap && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-3xl w-full border border-yellow-500/30">
            <h2 className="text-xl font-bold text-white text-center mb-4">Select Your Seats</h2>
            
            <div className="text-center mb-4">
              <div className="w-48 h-0.5 bg-yellow-500 mx-auto rounded-full mb-1" />
              <p className="text-gray-500 text-xs">SCREEN</p>
            </div>
            
            <div className="overflow-x-auto">
              <svg viewBox="0 0 700 400" className="w-full">
                {rows.map((row, rowIdx) => (
                  <g key={row} transform={`translate(0, ${rowIdx * 45 + 30})`}>
                    <text x="20" y="15" className="text-gray-400 text-sm">{row}</text>
                    {[...Array(10)].map((_, colIdx) => {
                      const seatId = `${row}${colIdx + 1}`;
                      const isSelected = selectedSeats.includes(seatId);
                      const isSelectable = selectedSeats.length < seatCount || isSelected;
                      
                      return (
                        <rect
                          key={colIdx}
                          x={colIdx * 42 + 50}
                          y="0"
                          width="35"
                          height="28"
                          rx="4"
                          className={`cursor-pointer ${isSelected ? "fill-yellow-400" : isSelectable ? "fill-gray-700 hover:fill-gray-600" : "fill-gray-800 opacity-50 cursor-not-allowed"}`}
                          onClick={() => isSelectable && handleSeatSelect(seatId)}
                        />
                      );
                    })}
                  </g>
                ))}
              </svg>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex justify-between mb-4">
                <div><p className="text-gray-400 text-sm">Seats: <span className="text-white font-bold">{selectedSeats.join(", ") || "None"}</span></p></div>
                <div><p className="text-gray-400 text-sm">Total: <span className="text-yellow-400 font-bold">${(selectedSeats.length * 14.99).toFixed(2)}</span></p></div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => { setStep(1); setShowMap(false); }} className="flex-1 py-2 bg-gray-700 rounded-full">Back</button>
                <button onClick={handleConfirm} disabled={selectedSeats.length !== seatCount} className={`flex-1 py-2 rounded-full font-bold ${selectedSeats.length === seatCount ? "bg-yellow-500 text-black" : "bg-gray-700 text-gray-400"}`}>
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2.5s linear forwards;
        }
      `}</style>
    </div>
  );
}