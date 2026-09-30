import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import {
  CrateAndBasket,
  FloatingTomato,
  FloatingMango,
  FloatingOrange,
  FloatingCarrot,
  FloatingApple,
  FloatingLeaf,
} from './FloatingProduce';

// Interactive Mouse Parallax Rig
const CameraRig = ({ children }) => {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    // Gentle mouse parallax
    const targetX = (state.pointer.x * Math.PI) / 12;
    const targetY = (state.pointer.y * Math.PI) / 18;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.05);
  });

  return <group ref={group}>{children}</group>;
};

// Scene Content
const SceneContent = () => {
  return (
    <>
      {/* Lighting: Soft warm agricultural sunrise */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        color="#fffbf0"
      />
      <directionalLight position={[-6, -2, -4]} intensity={0.4} color="#74c69d" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color="#ffe8d6" />

      <CameraRig>
        {/* Central Wooden Harvest Crate with Produce */}
        <CrateAndBasket position={[0, -0.3, 0]} scale={1.15} />

        {/* Floating Produce Around Basket with organic motions */}
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
          <FloatingTomato position={[-2.2, 0.9, 0.5]} scale={0.75} />
        </Float>

        <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.1}>
          <FloatingMango position={[2.3, 0.8, -0.2]} scale={0.85} />
        </Float>

        <Float speed={1.8} rotationIntensity={1} floatIntensity={1.4}>
          <FloatingCarrot position={[-1.8, -0.9, 0.8]} scale={0.75} />
        </Float>

        <Float speed={1.4} rotationIntensity={0.7} floatIntensity={0.9}>
          <FloatingApple position={[2.0, -0.7, 0.6]} scale={0.8} />
        </Float>

        <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1.3}>
          <FloatingOrange position={[1.5, 1.8, -0.5]} scale={0.65} />
        </Float>

        {/* Gently Floating Leaves & Golden Dust Particles */}
        <FloatingLeaf position={[-1.2, 1.6, 0.4]} scale={0.7} color="#52b788" />
        <FloatingLeaf position={[1.1, -1.4, 0.3]} scale={0.6} color="#74c69d" />
        <FloatingLeaf position={[-2.5, -0.2, -0.3]} scale={0.5} color="#40916c" />

        {/* Ambient floating sparkles/pollen */}
        <Sparkles count={35} scale={6} size={2.5} speed={0.4} color="#f4a261" opacity={0.6} />
      </CameraRig>

      {/* Realistic contact shadow beneath crate */}
      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.5}
        scale={6}
        blur={1.8}
        far={3}
        color="#081c15"
      />
    </>
  );
};

// Graceful 2D Fallback for when WebGL is unavailable or user requests reduced motion
const FallbackHeroVisual = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-white/20 bg-emerald-950/40 p-6 backdrop-blur-xl shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=800"
          alt="Fresh Harvest Basket"
          className="h-64 w-full rounded-2xl object-cover shadow-lg"
        />
        <div className="mt-4 text-center">
          <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
            {document.documentElement.lang === 'ta' ? 'புதிய இயற்கை அறுவடை' : 'Fresh Organic Harvest'}
          </span>
          <p className="mt-1 text-xs text-slate-300">
            {document.documentElement.lang === 'ta' ? 'சரிபார்க்கப்பட்ட பண்ணைகளிலிருந்து உங்கள் வாசலுக்கு' : 'Directly from verified farms to your doorstep'}
          </p>
        </div>
      </div>
    </div>
  );
};

const Hero3DScene = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Check WebGL support safely
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!hasWebGL || prefersReducedMotion) {
    return <FallbackHeroVisual />;
  }

  return (
    <div className="relative h-[480px] w-full lg:h-[560px]">
      <Canvas
        camera={{ position: [0, 0.4, 4.8], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3DScene;
