import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const CATEGORY_ITEMS = [
  { id: 'All', label: 'All Produce', icon: '✨', count: '100+' },
  { id: 'Vegetables', label: 'Vegetables', icon: '🥬', count: '45+' },
  { id: 'Fruits', label: 'Fruits', icon: '🥭', count: '30+' },
  { id: 'Grains', label: 'Grains', icon: '🌾', count: '18+' },
  { id: 'Pulses', label: 'Pulses', icon: '🫘', count: '12+' },
  { id: 'Spices', label: 'Spices', icon: '🌶️', count: '15+' },
  { id: 'Dairy', label: 'Dairy', icon: '🥛', count: '8+' },
  { id: 'Other', label: 'Other Produce', icon: '🍯', count: '6+' },
];

const CategoryPills3D = ({ activeCategory = 'All', onSelectCategory }) => {
  const { translateCategory } = useLanguage();
  const containerRef = useRef(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="relative w-full py-2" style={{ perspective: 1000 }}>
      {/* Scrollable Container with Subtle Edge Fade */}
      <div
        ref={containerRef}
        className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-2 no-scrollbar scroll-smooth"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {CATEGORY_ITEMS.map((cat) => {
          const isActive = activeCategory === cat.id;
          const isHovered = hoveredCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              animate={{
                y: isActive ? -4 : isHovered ? -3 : 0,
                rotateX: isActive ? 6 : isHovered ? 4 : 0,
                scale: isActive ? 1.04 : 1,
              }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              style={{ transformStyle: 'preserve-3d' }}
              className={`relative flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 select-none shadow-sm ${
                isActive
                  ? 'bg-gradient-to-b from-[#82B134] to-[#74A12E] text-[#FDFBF7] shadow-lg shadow-[#74A12E]/30 ring-2 ring-[#74A12E]/50'
                  : 'bg-[#FDFBF7] text-[#1E3F20] hover:bg-[#FAF6EE] hover:text-[#74A12E] border border-[#4E3629]/15 shadow-[#1E3F20]/5'
              }`}
            >
              {/* 3D Depth Highlight on top edge */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-[1px] rounded-t-2xl ${
                  isActive ? 'bg-white/40' : 'bg-white/80'
                }`}
              />

              {/* Emoji Icon with subtle 3D pop */}
              <span
                className="text-base transition-transform group-hover:scale-125"
                style={{ transform: 'translateZ(12px)' }}
              >
                {cat.icon}
              </span>

              {/* Category Label */}
              <span
                className="tracking-tight"
                style={{ transform: 'translateZ(8px)' }}
              >
                {translateCategory(cat.id)}
              </span>

              {/* Micro Count Tag */}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-white/20 text-[#FDFBF7]'
                    : 'bg-[#FAF6EE] text-[#4E3629]/70'
                }`}
                style={{ transform: 'translateZ(6px)' }}
              >
                {cat.count}
              </span>

              {/* Active Golden Sheen */}
              {isActive && (
                <motion.div
                  layoutId="active-pill-glow"
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-60"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPills3D;
