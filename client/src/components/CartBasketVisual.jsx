import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CartBasketVisual = ({ items = [] }) => {
  const { t, translateUnit } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#4E3629]/15 bg-gradient-to-b from-[#FAF6EE] to-[#FDFBF7] p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#74A12E] text-[#FDFBF7] shadow-sm">
            <ShoppingBasket className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1E3F20] uppercase tracking-wider">{t('cartVisual.title')}</h4>
            <p className="text-[11px] text-[#4E3629]/70">{t('cartVisual.sub')}</p>
          </div>
        </div>
        <span className="rounded-full bg-[#74A12E]/15 px-3 py-1 text-xs font-extrabold text-[#74A12E]">
          {items.length} {t('cartVisual.distinctBadge')}
        </span>
      </div>

      {/* Visual Basket Display */}
      <div className="relative mt-6 flex min-h-[140px] items-end justify-center rounded-2xl bg-[#4E3629]/5 p-4 border border-[#4E3629]/15">
        {/* Woven Basket Graphic Base */}
        <div className="absolute inset-x-8 bottom-0 h-16 rounded-b-2xl border-t-2 border-[#4E3629]/40 bg-gradient-to-r from-[#634535] via-[#4E3629] to-[#634535] shadow-inner opacity-90" />

        {/* Floating Produce Inside Basket */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pb-3">
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div
                key={item.productId || item.name || idx}
                layout
                initial={{ y: -60, scale: 0.3, opacity: 0, rotate: -20 }}
                animate={{ y: 0, scale: 1, opacity: 1, rotate: [-5, 5, 0] }}
                exit={{
                  y: -50,
                  scale: 0.2,
                  opacity: 0,
                  rotate: 25,
                  transition: { duration: 0.45, ease: 'easeIn' },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 22,
                  delay: idx * 0.05,
                }}
                className="group relative flex items-center space-x-2 rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7]/95 px-3 py-2 shadow-lg backdrop-blur-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-10 w-10 rounded-xl object-cover shadow-sm"
                />
                <div className="text-left pr-1">
                  <span className="block text-xs font-bold text-[#1E3F20] max-w-[120px] truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-bold text-[#74A12E]">
                    {item.quantity} {translateUnit(item.unit)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <p className="py-6 text-xs font-semibold text-[#4E3629]/50">{t('cartVisual.emptyBasket')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartBasketVisual;
