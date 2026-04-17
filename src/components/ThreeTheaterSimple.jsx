// src/components/ThreeTheaterSimple.jsx
"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Box, Plane } from "@react-three/drei";
import { motion } from "framer-motion";

// Simple 3D Scene Component
function SimpleTheaterScene({ seatCount, selectedSeats, onSeatSelect, onBack }) {
  // Generate seats (6 rows x 10 columns)
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seatsPerRow = 10;

  return (
    <group>
      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      
      {/* Main Light */}
      <pointLight position={[0, 10, 0]} intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      
      {/* Movie Screen */}
      <mesh position={[0, 3, -7]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffd700" emissiveIntensity={0.2} metalness={0.9} />
      </mesh>
      
      {/* Screen Frame */}
      <mesh position={[0, 3, -6.95]}>
        <boxGeometry args={[10.3, 5.3, 0.1]} />
        <meshStandardMaterial color="#8B4513" metalness={0.8} />
      </mesh>
      
      {/* Floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      
      {/* Generate Seats */}
      {rows.map((row, rowIndex) => {
        const startZ = -3 + rowIndex * 1.2;
        const startX = -5.5;
        
        return [...Array(seatsPerRow)].map((_, colIndex) => {
          const seatId = `${row}${colIndex + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isAvailable = selectedSeats.length < seatCount || isSelected;
          
          return (
            <mesh
              key={seatId}
              position={[startX + colIndex * 1.1, 0, startZ]}
              onClick={() => isAvailable && onSeatSelect(seatId)}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.7, 0.4, 0.7]} />
              <meshStandardMaterial 
                color={isSelected ? "#ffd700" : isAvailable ? "#4a4a4a" : "#2a2a2a"}
                emissive={isSelected ? "#ffd700" : "#000000"}
                emissiveIntensity={isSelected ? 0.5 : 0}
                metalness={0.6}
              />
              {/* Seat Back */}
              <mesh position={[0, 0.25, -0.35]}>
                <boxGeometry args={[0.7, 0.35, 0.08]} />
                <meshStandardMaterial color={isSelected ? "#ffd700" : "#4a4a4a"} />
              </mesh>
            </mesh>
          );
        });
      })}
      
      {/* Orbit Controls for user interaction */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={5}
        maxDistance={20}
      />
    </group>
  );
}

// Main Component
export default function ThreeTheaterSimple({ movie, onBookingComplete, onBack }) {
  const [seatCount, setSeatCount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1); // 1: count, 2: seats

  // Guard clause - if movie is missing
  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-500 mb-4">Error: Movie data not found</p>
          <button onClick={onBack} className="px-6 py-2 bg-yellow-500 text-black rounded-full font-bold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Select seat count
  if (step === 1) {
    return (
      <div className="relative w-full h-screen bg-black">
        {/* 3D Canvas Background */}
        <Canvas camera={{ position: [0, 4, 12], fov: 55 }}>
          <SimpleTheaterScene 
            seatCount={seatCount}
            selectedSeats={selectedSeats}
            onSeatSelect={() => {}}
            onBack={onBack}
          />
        </Canvas>
        
        {/* UI Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 text-center min-w-[350px] pointer-events-auto border border-yellow-500/30"
          >
            <h2 className="text-2xl font-bold text-white mb-2">🎬 {movie.title}</h2>
            <p className="text-gray-400 mb-6">How many seats would you like?</p>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <button 
                onClick={() => setSeatCount(Math.max(0, seatCount - 1))}
                className="w-14 h-14 bg-gray-700 rounded-full text-white text-2xl font-bold hover:bg-gray-600 hover:scale-110 transition"
              >
                -
              </button>
              <div>
                <span className="text-6xl font-bold text-yellow-400">{seatCount}</span>
                <p className="text-gray-500 text-sm mt-1">seats</p>
              </div>
              <button 
                onClick={() => setSeatCount(Math.min(10, seatCount + 1))}
                className="w-14 h-14 bg-gray-700 rounded-full text-white text-2xl font-bold hover:bg-gray-600 hover:scale-110 transition"
              >
                +
              </button>
            </div>
            
            <button
              onClick={() => seatCount > 0 && setStep(2)}
              disabled={seatCount === 0}
              className={`w-full py-3 rounded-full font-bold text-lg transition-all ${
                seatCount > 0 
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:scale-105" 
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {seatCount > 0 ? `Confirm ${seatCount} Seat${seatCount !== 1 ? "s" : ""}` : "Select Seats First"}
            </button>
            
            <button
              onClick={onBack}
              className="mt-4 text-gray-500 text-sm hover:text-gray-300 transition"
            >
              ← Back to 2D View
            </button>
            
            <p className="text-gray-600 text-xs mt-4">
              🖱️ Drag to rotate the 3D view
            </p>
          </motion.div>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-4 left-4 text-gray-500 text-xs bg-black/50 px-3 py-1 rounded-full">
          🖱️ Drag to rotate camera • Scroll to zoom
        </div>
      </div>
    );
  }

  // Step 2: Select specific seats (2D overlay on 3D)
  const rows = ["A", "B", "C", "D", "E", "F"];
  
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
        movie: movie.title,
        seats: selectedSeats, 
        count: seatCount,
        total: selectedSeats.length * 14.99
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Canvas Background */}
      <Canvas camera={{ position: [0, 12, 0], fov: 60 }}>
        <SimpleTheaterScene 
          seatCount={seatCount}
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
          onBack={onBack}
        />
      </Canvas>
      
      {/* 2D Seat Map Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-auto">
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 max-w-4xl w-full border border-yellow-500/30"
        >
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            🎯 Select Your Exact Seats
          </h2>
          <p className="text-gray-400 text-center mb-6">
            {movie.title} • Select exactly <span className="text-yellow-400 font-bold">{seatCount}</span> seat{seatCount !== 1 ? "s" : ""}
          </p>
          
          <div className="text-center mb-6">
            <div className="w-64 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto rounded-full mb-2" />
            <p className="text-gray-500 text-xs">SCREEN</p>
          </div>
          
          {/* SVG Seat Map */}
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 500" className="w-full h-auto">
              {rows.map((row, rowIdx) => (
                <g key={row} transform={`translate(0, ${rowIdx * 65 + 40})`}>
                  <text x="25" y="22" className="text-gray-400 text-sm font-bold">{row}</text>
                  {[...Array(10)].map((_, colIdx) => {
                    const seatId = `${row}${colIdx + 1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isSelectable = selectedSeats.length < seatCount || isSelected;
                    
                    return (
                      <g key={colIdx}>
                        <rect
                          x={colIdx * 55 + 70}
                          y="0"
                          width="40"
                          height="35"
                          rx="6"
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "fill-yellow-400 stroke-yellow-600 stroke-2"
                              : isSelectable
                              ? "fill-gray-700 stroke-gray-600 hover:fill-gray-600 hover:scale-105"
                              : "fill-gray-800 stroke-gray-700 cursor-not-allowed opacity-50"
                          }`}
                          onClick={() => isSelectable && handleSeatSelect(seatId)}
                        />
                        <text
                          x={colIdx * 55 + 90}
                          y="22"
                          className={`text-xs font-bold pointer-events-none ${
                            isSelected ? "fill-black" : "fill-gray-400"
                          }`}
                        >
                          {colIdx + 1}
                        </text>
                      </g>
                    );
                  })}
                </g>
              ))}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-gray-700 rounded" /><span className="text-gray-400 text-sm">Available</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-yellow-400 rounded" /><span className="text-gray-400 text-sm">Selected</span></div>
          </div>
          
          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm">Selected Seats</p>
                <p className="text-xl font-bold text-white">{selectedSeats.join(", ") || "None"}</p>
                <p className="text-xs text-gray-500">{selectedSeats.length} of {seatCount} seats</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-3xl font-bold text-yellow-400">${(selectedSeats.length * 14.99).toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-full font-bold bg-gray-700 text-white hover:bg-gray-600 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedSeats.length !== seatCount}
                className={`flex-1 py-3 rounded-full font-bold text-lg transition-all ${
                  selectedSeats.length === seatCount
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:scale-105"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {selectedSeats.length === seatCount ? "✨ Confirm ✨" : `Select ${seatCount - selectedSeats.length} more`}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}