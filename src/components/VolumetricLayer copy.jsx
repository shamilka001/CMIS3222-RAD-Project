"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uImage;
  uniform sampler2D uDepthMap;
  uniform vec2 uMouse;
  uniform vec2 uThreshold;
  uniform vec2 uImageAspect;
  uniform vec2 uScreenAspect;

  void main() {
    // Recompute UV coordinates to perfectly simulate 'object-fit: cover'
    vec2 ratio = vec2(
      min((uScreenAspect.x / uScreenAspect.y) / (uImageAspect.x / uImageAspect.y), 1.0),
      min((uScreenAspect.y / uScreenAspect.x) / (uImageAspect.y / uImageAspect.x), 1.0)
    );

    vec2 uvCover = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // Read depth map using the corrected aspect UVs
    vec4 depth = texture2D(uDepthMap, uvCover);
    
    // Displace UVs using corrected aspect tracking
    vec2 displacement = uMouse * (depth.r * uThreshold);
    
    // Sample the final color without vertical stretching
    vec4 color = texture2D(uImage, uvCover + displacement);
    gl_FragColor = color;
  }
`;

function FeedbackPlane({ imageSrc, depthSrc }) {
  const materialRef = useRef();
  const [imageTex, depthTex] = useTexture([imageSrc, depthSrc]);
  const { size } = useThree(); // Dynamically hooks into canvas container resizing

  // 1. Calculate the native aspect ratio of your image file once loaded
  const imageAspect = useMemo(() => {
    if (imageTex?.image) {
      return new THREE.Vector2(imageTex.image.width, imageTex.image.height);
    }
    return new THREE.Vector2(16, 9); // Fallback standard
  }, [imageTex]);

  const uniforms = useRef({
    uImage: { value: imageTex },
    uDepthMap: { value: depthTex },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uThreshold: { value: new THREE.Vector2(0.015, 0.012) }, // Calibrated subtle depth
    uImageAspect: { value: imageAspect },
    uScreenAspect: { value: new THREE.Vector2(size.width, size.height) }
  });

  // Keep uniforms in perfect sync with responsive window updates
  useFrame((state) => {
    if (materialRef.current) {
      // Update browser viewport dimensions dynamically
      materialRef.current.uniforms.uScreenAspect.value.set(state.size.width, state.size.height);
      materialRef.current.uniforms.uImageAspect.value.copy(imageAspect);

      // Handle pointer parallax glide
      const currentMouse = materialRef.current.uniforms.uMouse.value;
      currentMouse.x += (state.pointer.x - currentMouse.x) * 0.05;
      currentMouse.y += (state.pointer.y - currentMouse.y) * 0.05;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  );
}

export default function VolumetricLayer({ imageSrc, depthSrc }) {
  return (
    <div className="absolute inset-0 w-full h-full scale-105 pointer-events-auto">
      <Canvas 
        camera={{ position: [0, 0, 1] }} 
        style={{ background: "transparent" }}
        gl={{ antialias: true }}
      >
        <FeedbackPlane imageSrc={imageSrc} depthSrc={depthSrc} />
      </Canvas>
    </div>
  );
}