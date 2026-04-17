// src/components/booking/ThreeTheater.jsx
"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  Html, 
  Text, 
  Box, 
  Plane,
  Environment,
  Float
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Seat Component with glow effect
function Seat({ position, seatNumber, isSelected, isAvailable, onSelect, intensity = 0 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Dynamic glow material based on selection
  const seatColor = isSelected 
    ? new THREE.Color(0xffd700) // Gold for selected
    : isAvailable 
    ? new THREE.Color(0x4a4a4a) // Gray for available
    : new THREE.Color(0x2a2a2a); // Dark for taken

  const emissiveIntensity = isSelected ? 0.5 + intensity * 0.8 : 0;

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => isAvailable && onSelect(seatNumber)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.8, 0.5, 0.8]} />
      <meshStandardMaterial 
        color={seatColor}
        emissive={isSelected ? "#ffd700" : "#000000"}
        emissiveIntensity={emissiveIntensity}
        metalness={0.7}
        roughness={0.3}
      />
      {/* Seat back */}
      <mesh position={[0, 0.4, -0.4]}>
        <boxGeometry args={[0.8, 0.5, 0.1]} />
        <meshStandardMaterial color={seatColor} metalness={0.5} />
      </mesh>
      
      {/* Hover effect */}
      {hovered && isAvailable && !isSelected && (
        <Html center>
          <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded shadow-lg">
            Seat {seatNumber}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Theater Row Component
function TheaterRow({ row, startX, startZ, seatsPerRow, selectedSeats, onSeatSelect, glowIntensity }) {
  const seats = [];
  for (let i = 0; i < seatsPerRow; i++) {
    const seatNumber = `${row}${i + 1}`;
    const isSelected = selectedSeats.includes(seatNumber);
    const isAvailable = true; // Check against backend
    
    seats.push(
      <Seat
        key={seatNumber}
        position={[startX + i * 1.2, 0, startZ]}
        seatNumber={seatNumber}
        isSelected={isSelected}
        isAvailable={isAvailable}
        onSelect={onSeatSelect}
        intensity={glowIntensity}
      />
    );
  }
  return <group>{seats}</group>;
}

// Camera Controller for Smooth Transitions
function CameraController({ targetView, onTransitionComplete }) {
  const { camera, scene } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!targetView) return;

    setIsAnimating(true);
    
    // Store original position
    const startPos = camera.position.clone();
    const startTarget = new THREE.Vector3(0, 2, 0);
    
    // Define view positions
    const views = {
      front: { position: new THREE.Vector3(0, 5, 15), target: new THREE.Vector3(0, 3, 0) },
      top: { position: new THREE.Vector3(0, 20, 0), target: new THREE.Vector3(0, 0, 0) },
      side: { position: new THREE.Vector3(15, 5, 0), target: new THREE.Vector3(0, 2, 0) }
    };

    const target = views[targetView] || views.front;
    
    // GSAP animation for camera movement
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        if (onTransitionComplete) onTransitionComplete();
      }
    });

    // Animate camera position
    tl.to(camera.position, {
      x: target.position.x,
      y: target.position.y,
      z: target.position.z,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        // Make camera look at center
        camera.lookAt(target.target);
      }
    }, 0);

    return () => tl.kill();
  }, [targetView, camera]);

  return null;
}

// Main Theater Scene
function TheaterScene({ seatCount, onConfirmCount, onCameraShiftComplete, selectedSeats, onSeatSelect }) {
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [cameraView, setCameraView] = useState("front");
  const [showSeatMap, setShowSeatMap] = useState(false);

  // Update glow intensity based on seat count
  useEffect(() => {
    const intensity = Math.min(seatCount / 10, 1);
    setGlowIntensity(intensity);
  }, [seatCount]);

  const handleConfirmCount = () => {
    onConfirmCount(seatCount);
    setCameraView("top");
  };

  const handleCameraTransitionComplete = () => {
    setShowSeatMap(true);
    if (onCameraShiftComplete) onCameraShiftComplete();
  };

  return (
    <group>
      {/* Screen */}
      <mesh position={[0, 4, -8]} rotation={[0, 0, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffd700"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Screen Frame */}
      <mesh position={[0, 4, -7.9]}>
        <boxGeometry args={[12.5, 6.5, 0.2]} />
        <meshStandardMaterial color="#8B4513" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Theater Seats - Staggered arrangement */}
      {[...Array(8)].map((_, rowIndex) => {
        const rowLetter = String.fromCharCode(65 + rowIndex);
        const startZ = -4 + rowIndex * 1.5;
        const startX = -6 + (rowIndex % 2) * 0.6; // Stagger effect
        return (
          <TheaterRow
            key={rowIndex}
            row={rowLetter}
            startX={startX}
            startZ={startZ}
            seatsPerRow={12}
            selectedSeats={selectedSeats}
            onSeatSelect={onSeatSelect}
            glowIntensity={glowIntensity}
          />
        );
      })}
      
      {/* Camera Controller */}
      <CameraController 
        targetView={cameraView} 
        onTransitionComplete={handleCameraTransitionComplete}
      />
      
      {/* UI Overlay - Seat Counter */}
      {!showSeatMap && (
        <Html center position={[0, 8, 0]}>
          <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-6 text-center min-w-[300px]">
            <h3 className="text-white text-xl mb-4">Select Number of Seats</h3>
            <div className="flex items-center justify-center gap-6 mb-6">
              <button 
                onClick={() => onConfirmCount(Math.max(0, seatCount - 1))}
                className="w-12 h-12 bg-gray-700 rounded-full text-white text-2xl hover:bg-gray-600"
              >
                -
              </button>
              <span className="text-4xl font-bold text-yellow-400">{seatCount}</span>
              <button 
                onClick={() => onConfirmCount(Math.min(10, seatCount + 1))}
                className="w-12 h-12 bg-gray-700 rounded-full text-white text-2xl hover:bg-gray-600"
              >
                +
              </button>
            </div>
            <button
              onClick={handleConfirmCount}
              disabled={seatCount === 0}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                seatCount > 0 
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:scale-105" 
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm {seatCount} Seat{seatCount !== 1 ? "s" : ""}
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Watch the seats light up as you select!
            </p>
          </div>
        </Html>
      )}
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={0.5} intensity={1} castShadow />
      <pointLight position={[0, 5, -5]} intensity={0.5} color="#ffd700" />
      <directionalLight position={[5, 10, 7]} intensity={0.8} castShadow />
      
      {/* Screen Glow */}
      <pointLight position={[0, 4, -6]} intensity={glowIntensity * 0.5} color="#ffd700" />
      
      <Environment preset="night" />
    </group>
  );
}

// Main Component
export default function ThreeTheater({ 
  onBookingComplete,
  initialSeatCount = 0 
}) {
  const [seatCount, setSeatCount] = useState(initialSeatCount);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBirdseye, setShowBirdseye] = useState(false);
  const [maxSeats] = useState(10);

  const handleConfirmCount = (count) => {
    setSeatCount(count);
  };

  const handleCameraShiftComplete = () => {
    // Camera has shifted to top view, now show interactive seat map
    setShowBirdseye(true);
  };

  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < seatCount) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleConfirmSeats = () => {
    if (selectedSeats.length === seatCount) {
      onBookingComplete?.({ seats: selectedSeats, count: seatCount });
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 60 }}
        style={{ background: "#000000" }}
      >
        <TheaterScene
          seatCount={seatCount}
          onConfirmCount={setSeatCount}
          onCameraShiftComplete={handleCameraShiftComplete}
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
        />
      </Canvas>
      
      {/* Birdseye Seat Map Overlay */}
      {showBirdseye && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-10 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-4xl w-full mx-4">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Select Your Exact Seats
            </h2>
            
            <div className="text-center mb-8">
              <div className="w-64 h-1 bg-yellow-400 mx-auto rounded-full mb-2" />
              <p className="text-gray-400 text-sm">SCREEN</p>
            </div>
            
            {/* 2D SVG Seat Map */}
            <div className="overflow-x-auto">
              <svg viewBox="0 0 800 600" className="w-full h-auto">
                {[...Array(8)].map((_, rowIdx) => {
                  const row = String.fromCharCode(65 + rowIdx);
                  return (
                    <g key={row} transform={`translate(0, ${rowIdx * 60 + 50})`}>
                      <text x="30" y="20" className="text-gray-400 text-sm">
                        {row}
                      </text>
                      {[...Array(12)].map((_, colIdx) => {
                        const seatId = `${row}${colIdx + 1}`;
                        const isSelected = selectedSeats.includes(seatId);
                        const isAvailable = selectedSeats.length < seatCount || isSelected;
                        
                        return (
                          <g key={colIdx}>
                            <rect
                              x={colIdx * 50 + 80}
                              y="0"
                              width="35"
                              height="35"
                              rx="5"
                              className={`cursor-pointer transition-all ${
                                isSelected
                                  ? "fill-yellow-400 stroke-yellow-600"
                                  : isAvailable
                                  ? "fill-gray-700 stroke-gray-600 hover:fill-gray-600"
                                  : "fill-gray-800 stroke-gray-700 cursor-not-allowed"
                              }`}
                              onClick={() => isAvailable && handleSeatSelect(seatId)}
                            />
                            <text
                              x={colIdx * 50 + 97}
                              y="22"
                              className={`text-xs ${
                                isSelected ? "fill-black" : "fill-gray-400"
                              } text-center pointer-events-none`}
                            >
                              {colIdx + 1}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-700 rounded" />
                <span className="text-gray-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-400 rounded" />
                <span className="text-gray-400">Selected</span>
              </div>
            </div>
            
            {/* Booking Summary */}
            <div className="mt-8 flex justify-between items-center">
              <div>
                <p className="text-gray-400">Selected Seats</p>
                <p className="text-2xl font-bold text-white">
                  {selectedSeats.join(", ") || "None"}
                </p>
                <p className="text-sm text-gray-400">
                  {selectedSeats.length} of {seatCount} seats selected
                </p>
              </div>
              
              <button
                onClick={handleConfirmSeats}
                disabled={selectedSeats.length !== seatCount}
                className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${
                  selectedSeats.length === seatCount
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg hover:scale-105"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm Booking (${(selectedSeats.length * 12.99).toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-gray-500 text-sm bg-black/50 px-3 py-1 rounded">
        Drag to orbit • {showBirdseye ? "Click seats to select" : "Select seat count above"}
      </div>
    </div>
  );
}