import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  RotateCw,
  Sun,
  Lightbulb,
  Sunset,
  Sparkles,
  ShieldCheck,
  Award,
  ShoppingBag,
  Maximize2,
} from 'lucide-react';
import {
  FloatingTomato,
  FloatingMango,
  FloatingOrange,
  FloatingCarrot,
  FloatingApple,
} from './FloatingProduce';
import Button3D from '../ui/Button3D';

// 3D Wheat / Grain model for grains & pulses
const WheatStalk3D = ({ scale = 1.2 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={ref} scale={scale} position={[0, -0.6, 0]}>
      {/* Central Stem */}
      <mesh castShadow>
        <cylinderGeometry args={[0.02, 0.03, 1.8, 8]} />
        <meshStandardMaterial color="#c29b38" roughness={0.7} />
      </mesh>
      {/* Grains / Husks along the stalk */}
      {Array.from({ length: 12 }).map((_, i) => {
        const y = -0.2 + i * 0.12;
        const angle = i * 1.6;
        return (
          <group key={i} position={[0, y, 0]} rotation={[0.4, angle, 0.3]}>
            <mesh castShadow>
              <coneGeometry args={[0.05, 0.22, 6]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#e0ae39' : '#d49b28'}
                roughness={0.6}
              />
            </mesh>
            {/* Beard / Awn */}
            <mesh position={[0, 0.16, 0]} rotation={[0.1, 0, 0.2]}>
              <cylinderGeometry args={[0.005, 0.008, 0.3, 4]} />
              <meshStandardMaterial color="#c29b38" roughness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// 3D Potato / Tuber model
const Potato3D = ({ scale = 1.1 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={ref} scale={scale}>
      <mesh castShadow receiveShadow scale={[0.9, 0.65, 0.75]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#b08968"
          roughness={0.85}
          metalness={0.02}
        />
      </mesh>
      {/* Potato Eyes */}
      {[
        [-0.3, 0.1, 0.4],
        [0.2, -0.15, 0.35],
        [0.1, 0.2, -0.4],
        [-0.35, -0.1, -0.3],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos} scale={0.06}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="#7f5539" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

// Selector helper for produce 3D representation
const ProduceModel = ({ name = '', category = '' }) => {
  const lowerName = name.toLowerCase();
  const lowerCat = category.toLowerCase();

  if (lowerName.includes('tomato')) {
    return <FloatingTomato scale={1.5} floatSpeed={0} />;
  }
  if (lowerName.includes('mango')) {
    return <FloatingMango scale={1.6} floatSpeed={0} />;
  }
  if (lowerName.includes('orange') || lowerName.includes('citrus') || lowerName.includes('lemon')) {
    return <FloatingOrange scale={1.5} floatSpeed={0} />;
  }
  if (lowerName.includes('carrot') || lowerName.includes('radish')) {
    return <FloatingCarrot scale={1.4} floatSpeed={0} />;
  }
  if (lowerName.includes('apple') || lowerName.includes('pomegranate') || lowerName.includes('guava')) {
    return <FloatingApple scale={1.5} floatSpeed={0} />;
  }
  if (lowerName.includes('potato') || lowerName.includes('onion') || lowerName.includes('ginger')) {
    return <Potato3D />;
  }
  if (lowerCat.includes('grain') || lowerCat.includes('pulse') || lowerName.includes('rice') || lowerName.includes('wheat')) {
    return <WheatStalk3D />;
  }

  // Fallback to organic tomato/apple
  return <FloatingTomato scale={1.5} floatSpeed={0} />;
};

const ProduceInspectModal3D = ({ isOpen, onClose, product, onAddToCart }) => {
  const [lightMode, setLightMode] = useState('studio'); // 'sun' | 'studio' | 'harvest'
  const [autoRotate, setAutoRotate] = useState(true);

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop with Frosted Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative z-10 flex flex-col md:flex-row w-full max-w-4xl h-[88vh] max-h-[720px] overflow-hidden rounded-3xl border border-white/20 bg-slate-900/95 text-white shadow-2xl shadow-black/60"
        >
          {/* Left Column: 3D Viewport */}
          <div className="relative flex-1 h-[52%] md:h-full bg-gradient-to-b from-slate-900 via-slate-800/90 to-emerald-950/40">
            {/* 3D Canvas */}
            <Canvas
              shadows
              camera={{ position: [0, 0, 3.2], fov: 45 }}
              className="h-full w-full cursor-grab active:cursor-grabbing"
            >
              {/* Lighting Presets */}
              {lightMode === 'studio' && (
                <>
                  <ambientLight intensity={0.8} />
                  <directionalLight
                    position={[3, 4, 3]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={1024}
                  />
                  <directionalLight position={[-3, 2, -2]} intensity={0.5} />
                  <pointLight position={[0, -2, 2]} intensity={0.3} color="#a7f3d0" />
                </>
              )}

              {lightMode === 'sun' && (
                <>
                  <ambientLight intensity={0.6} color="#fef3c7" />
                  <directionalLight
                    position={[4, 5, 2]}
                    intensity={1.6}
                    color="#fde047"
                    castShadow
                  />
                  <directionalLight position={[-2, -1, 1]} intensity={0.4} color="#6ee7b7" />
                </>
              )}

              {lightMode === 'harvest' && (
                <>
                  <ambientLight intensity={0.5} color="#fed7aa" />
                  <directionalLight
                    position={[-3, 3, 2]}
                    intensity={1.8}
                    color="#fb923c"
                    castShadow
                  />
                  <directionalLight position={[3, 1, -2]} intensity={0.4} color="#f472b6" />
                </>
              )}

              <Suspense fallback={null}>
                <Center>
                  <ProduceModel name={product.name} category={product.category} />
                </Center>
                <ContactShadows
                  position={[0, -1.05, 0]}
                  opacity={0.6}
                  scale={3}
                  blur={1.8}
                  far={1.5}
                />
              </Suspense>

              <OrbitControls
                autoRotate={autoRotate}
                autoRotateSpeed={2.5}
                enablePan={false}
                minDistance={1.8}
                maxDistance={5.0}
              />
            </Canvas>

            {/* Orbit Controls Overlay Hint */}
            <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-black/40 px-3 py-1.5 text-[11px] font-semibold text-white/70 backdrop-blur-md">
              <RotateCw className="h-3.5 w-3.5 text-lime-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Drag to orbit 360° • Scroll to zoom</span>
            </div>

            {/* Light Mode Switcher & Controls */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 rounded-2xl bg-black/50 p-1.5 backdrop-blur-md border border-white/10">
              <button
                onClick={() => setLightMode('studio')}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                  lightMode === 'studio'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title="Studio Neutral White Lighting"
              >
                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                <span>Studio</span>
              </button>
              <button
                onClick={() => setLightMode('sun')}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                  lightMode === 'sun'
                    ? 'bg-amber-400 text-amber-950 shadow'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title="Farm Morning Sun"
              >
                <Sun className="h-3.5 w-3.5 text-amber-950" />
                <span>Sunlight</span>
              </button>
              <button
                onClick={() => setLightMode('harvest')}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                  lightMode === 'harvest'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title="Golden Harvest Dusk"
              >
                <Sunset className="h-3.5 w-3.5" />
                <span>Dusk</span>
              </button>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`rounded-xl px-2 py-1 text-xs font-bold transition ${
                  autoRotate ? 'bg-emerald-600 text-white' : 'text-white/60 hover:bg-white/10'
                }`}
                title="Toggle Auto Rotation"
              >
                Spin
              </button>
            </div>
          </div>

          {/* Right Column: Produce Specification HUD */}
          <div className="relative flex flex-col justify-between w-full md:w-[360px] p-6 md:p-7 bg-slate-900/90 border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              {/* Header Badges */}
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-lime-400/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-lime-300 border border-lime-400/30">
                  3D Digital Twin
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/80">
                  {product.category}
                </span>
              </div>

              {/* Product Title & Grade */}
              <h2 className="mt-2.5 text-2xl font-black tracking-tight text-white">
                {product.name}
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Grown & Harvested by <span className="text-lime-300 font-semibold">{product.farmer?.farmName || product.farmer?.name || 'Verified Farm'}</span>
              </p>

              {/* Freshness & Quality Cards */}
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white/70 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-lime-400" /> Peak Freshness Index
                    </span>
                    <span className="font-black text-lime-300">98.5% Fresh</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[98.5%] rounded-full bg-gradient-to-r from-emerald-500 to-lime-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Quality Grade</span>
                    <span className="font-black text-white text-sm mt-0.5 block flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-amber-400" /> {product.qualityGrade || 'Grade A+'}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Farming</span>
                    <span className="font-bold text-emerald-300 text-xs mt-1 block">
                      {product.farmingMethod || '100% Organic'}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-200 block">Verified Traceability</span>
                    <span className="text-[11px] text-emerald-300/70">Inspected farm soil & harvest date verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Pricing & CTA */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-white/50 block font-medium">Farm Direct Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-lime-300">₹{product.price}</span>
                  <span className="text-xs text-white/60 font-semibold">/ {product.unit}</span>
                </div>
              </div>

              <Button3D
                variant="lime"
                size="md"
                onClick={() => {
                  if (onAddToCart) onAddToCart();
                  onClose();
                }}
                icon={ShoppingBag}
              >
                Add to Cart
              </Button3D>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProduceInspectModal3D;
