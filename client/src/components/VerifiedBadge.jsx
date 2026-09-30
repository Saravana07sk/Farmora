import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * VerifiedBadge — 3D Holographic Farmer Verification Badge
 * Features:
 * - 3D Gyroscopic tilt on hover
 * - Iridescent chromatic sheen gliding across badge
 * - Pulse glow ring around verification icon
 */
const VerifiedBadge = ({ isVerified, size = 'sm', showLabel = true }) => {
  if (!isVerified) return null;

  const badgeRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheenPos, setSheenPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    setTilt({
      x: -normY * 12,
      y: normX * 12,
    });

    setSheenPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const sizeConfig = {
    sm: {
      wrap: 'px-2 py-0.5 text-[10px] gap-1',
      icon: 'h-3 w-3',
    },
    md: {
      wrap: 'px-2.5 py-1 text-xs gap-1.5',
      icon: 'h-3.5 w-3.5',
    },
    lg: {
      wrap: 'px-3 py-1.5 text-sm gap-2',
      icon: 'h-4 w-4',
    },
  }[size] || {
    wrap: 'px-2 py-0.5 text-[10px] gap-1',
    icon: 'h-3 w-3',
  };

  return (
    <div style={{ perspective: 500 }} className="inline-block select-none">
      <motion.span
        ref={badgeRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative inline-flex items-center rounded-full font-black text-[#1E3F20] border border-[#74A12E]/40 bg-gradient-to-r from-[#74A12E]/15 via-[#FDFBF7] to-[#74A12E]/25 shadow-sm overflow-hidden cursor-help ${sizeConfig.wrap}`}
        title="Verified Farmer — Land records, KYC & Farm Soil Inspected"
      >
        {/* Holographic Iridescent Shimmer */}
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            isHovered ? 'opacity-80' : 'opacity-30'
          }`}
          style={{
            background: `linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.7) 45%, rgba(116,161,46,0.3) 55%, transparent 80%)`,
            transform: isHovered ? `translateX(${sheenPos.x - 50}%)` : 'none',
          }}
        />

        {/* 3D Elevated Icon */}
        <span
          className="relative z-10 flex items-center justify-center"
          style={{ transform: 'translateZ(8px)' }}
        >
          <CheckCircle2
            className={`${sizeConfig.icon} fill-[#74A12E] text-[#FDFBF7] animate-pulse`}
          />
        </span>

        {/* Label */}
        {showLabel && (
          <span
            className="relative z-10 tracking-tight font-extrabold text-[#1E3F20]"
            style={{ transform: 'translateZ(6px)' }}
          >
            Verified Farmer
          </span>
        )}
      </motion.span>
    </div>
  );
};

export default VerifiedBadge;
