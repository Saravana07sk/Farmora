import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Button3D — Spatial 3D Tactile Button
 * Features:
 * - GPU-accelerated CSS 3D perspective with gyro-like cursor tilt
 * - Moving specular light sheen following pointer
 * - Physical Z-axis depress with dynamic shadow contraction
 * - Optional organic micro-particle burst on click
 */
const Button3D = ({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'lime'
  size = 'md', // 'sm' | 'md' | 'lg' | 'icon'
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  title,
}) => {
  const buttonRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleMouseMove = (e) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate normalized -1 to +1 coordinate
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    // Subtle 3D tilt angles (max 10 degrees)
    setTilt({
      x: -normY * 9,
      y: normX * 9,
    });

    // Sheen position percentage
    setSheenPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSheenPos({ x: 50, y: 50 });
    setIsPressed(false);
  };

  const handleClick = (e) => {
    if (disabled) return;

    // Spawn tiny organic micro-particles around click position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newParticles = Array.from({ length: 4 }).map((_, i) => ({
        id: Date.now() + i,
        x,
        y,
        angle: (i * 90 + Math.random() * 45) * (Math.PI / 180),
        speed: 18 + Math.random() * 20,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 600);
    }

    if (onClick) onClick(e);
  };

  // Variant Styles — The Fertile Ground Palette
  const variants = {
    primary:
      'bg-gradient-to-b from-[#82B134] to-[#74A12E] text-[#FDFBF7] shadow-lg shadow-[#74A12E]/30 border-t border-[#9FD34B]/50 hover:from-[#92C43D] hover:to-[#82B134]',
    secondary:
      'bg-[#FDFBF7] text-[#1E3F20] border border-[#4E3629]/25 shadow-sm shadow-[#4E3629]/10 hover:bg-[#F4ECE0] hover:border-[#4E3629]/40',
    accent:
      'bg-gradient-to-b from-[#634535] to-[#4E3629] text-[#FDFBF7] shadow-lg shadow-[#4E3629]/30 border-t border-[#AD8B77]/40 hover:from-[#75523F] hover:to-[#634535]',
    lime:
      'bg-gradient-to-b from-[#8DC23B] to-[#74A12E] text-[#FDFBF7] font-black shadow-lg shadow-[#74A12E]/25 border-t border-[#B6DF73] hover:from-[#9BD343] hover:to-[#84B535]',
    ghost:
      'bg-transparent text-[#1E3F20] hover:bg-[#F4ECE0] shadow-none border border-transparent',
    danger:
      'bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-900/25 border-t border-rose-300/40 hover:from-rose-400 hover:to-rose-500',
  };

  // Size Styles
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2 font-bold',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-extrabold',
    icon: 'p-2.5 rounded-xl aspect-square',
  };

  return (
    <div
      style={{ perspective: 800 }}
      className="inline-block relative select-none"
    >
      <motion.button
        ref={buttonRef}
        type={type}
        title={title}
        disabled={disabled}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => !disabled && setIsPressed(true)}
        onMouseUp={() => !disabled && setIsPressed(false)}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          z: isPressed ? -4 : 0,
          scale: isPressed ? 0.97 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 25,
          mass: 0.5,
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        className={`relative flex items-center justify-center overflow-hidden transition-colors ${
          variants[variant] || variants.primary
        } ${sizes[size] || sizes.md} ${
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer active:shadow-inner'
        } ${className}`}
      >
        {/* Dynamic Specular Sheen (follows mouse cursor) */}
        {!disabled && (
          <div
            className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 90px at ${sheenPos.x}% ${sheenPos.y}%, rgba(255,255,255,0.45), transparent 70%)`,
            }}
          />
        )}

        {/* 3D Depth Highlight Line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/30" />

        {/* Button Content */}
        <span
          className="relative z-10 flex items-center gap-1.5"
          style={{ transform: 'translateZ(10px)' }}
        >
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
        </span>

        {/* Micro-Particles on Click */}
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
            animate={{
              opacity: 0,
              scale: 0.2,
              x: p.x + Math.cos(p.angle) * p.speed,
              y: p.y + Math.sin(p.angle) * p.speed,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-lime-300"
          />
        ))}
      </motion.button>
    </div>
  );
};

export default Button3D;
