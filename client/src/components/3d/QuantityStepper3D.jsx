import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Sparkles } from 'lucide-react';

/**
 * QuantityStepper3D — Tactile 3D Quantity Stepper
 * Features:
 * - Odometer roll transition on number change
 * - 3D Z-axis depress on button clicks
 * - Subtle particle pop on increment
 */
const QuantityStepper3D = ({
  value = 1,
  min = 1,
  max = 9999,
  onChange,
  size = 'md', // 'sm' | 'md' | 'lg'
  unit = '',
  disabled = false,
}) => {
  const [direction, setDirection] = useState(1); // 1 = up, -1 = down
  const [pop, setPop] = useState(false);

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || value >= max) return;
    setDirection(1);
    setPop(true);
    setTimeout(() => setPop(false), 300);
    if (onChange) onChange(value + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || value <= min) return;
    setDirection(-1);
    if (onChange) onChange(value - 1);
  };

  const sizeClasses = {
    sm: {
      btn: 'h-7 w-7 text-xs rounded-lg',
      num: 'w-8 text-xs',
      icon: 'h-3 w-3',
      wrap: 'p-0.5 rounded-xl',
    },
    md: {
      btn: 'h-9 w-9 text-sm rounded-xl',
      num: 'w-11 text-sm',
      icon: 'h-4 w-4',
      wrap: 'p-1 rounded-2xl',
    },
    lg: {
      btn: 'h-11 w-11 text-base rounded-2xl',
      num: 'w-14 text-base',
      icon: 'h-5 w-5',
      wrap: 'p-1.5 rounded-3xl',
    },
  }[size] || {
    btn: 'h-9 w-9 text-sm rounded-xl',
    num: 'w-11 text-sm',
    icon: 'h-4 w-4',
    wrap: 'p-1 rounded-2xl',
  };

  return (
    <div
      style={{ perspective: 600 }}
      className={`relative inline-flex items-center border border-slate-200/90 bg-slate-50/80 shadow-inner select-none ${sizeClasses.wrap}`}
    >
      {/* Decrement Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.9, z: -3 }}
        whileHover={{ scale: 1.05 }}
        disabled={disabled || value <= min}
        onClick={handleDecrement}
        className={`flex items-center justify-center font-black transition-colors ${sizeClasses.btn} ${
          value <= min || disabled
            ? 'opacity-35 cursor-not-allowed bg-transparent text-slate-400'
            : 'bg-white text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100 hover:text-emerald-700'
        }`}
        title="Decrease quantity"
      >
        <Minus className={sizeClasses.icon} />
      </motion.button>

      {/* Animated Odometer Number */}
      <div
        className={`relative flex items-center justify-center overflow-hidden font-black text-slate-900 ${sizeClasses.num}`}
      >
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.span
            key={value}
            custom={direction}
            initial={{ y: direction > 0 ? 14 : -14, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: pop ? 1.25 : 1 }}
            exit={{ y: direction > 0 ? -14 : 14, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className={`block ${pop ? 'text-emerald-700' : 'text-slate-900'}`}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Increment Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.9, z: -3 }}
        whileHover={{ scale: 1.05 }}
        disabled={disabled || value >= max}
        onClick={handleIncrement}
        className={`flex items-center justify-center font-black transition-colors ${sizeClasses.btn} ${
          value >= max || disabled
            ? 'opacity-35 cursor-not-allowed bg-transparent text-slate-400'
            : 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 border-t border-emerald-400/40 hover:bg-emerald-800'
        }`}
        title="Increase quantity"
      >
        <Plus className={sizeClasses.icon} />
      </motion.button>

      {unit && (
        <span className="ml-1.5 pr-2 text-xs font-semibold text-slate-400">
          {unit}
        </span>
      )}
    </div>
  );
};

export default QuantityStepper3D;
