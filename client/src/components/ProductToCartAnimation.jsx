import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const { t } = useLanguage();
  const [flyingItems, setFlyingItems] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [cartBouncing, setCartBouncing] = useState(false);

  const triggerFlyToCart = useCallback(({ imageSrc, startRect, productName = 'Produce' }) => {
    // Locate the navbar cart icon
    const cartEl = document.getElementById('navbar-cart-icon');
    let targetX = window.innerWidth - 80;
    let targetY = 24;

    if (cartEl) {
      const rect = cartEl.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    const startX = startRect ? startRect.left + startRect.width / 2 : window.innerWidth / 2;
    const startY = startRect ? startRect.top + startRect.height / 2 : window.innerHeight / 2;

    const id = Date.now() + Math.random();

    const newItem = {
      id,
      imageSrc: imageSrc || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400',
      startX,
      startY,
      targetX,
      targetY,
      productName,
    };

    setFlyingItems((prev) => [...prev, newItem]);

    // Show confirmation toast
    setToastMessage({ id, name: productName });
    setTimeout(() => {
      setToastMessage((current) => (current?.id === id ? null : current));
    }, 2400);
  }, []);

  const handleAnimationComplete = useCallback((id) => {
    setFlyingItems((prev) => prev.filter((item) => item.id !== id));
    // Trigger cart icon bounce
    setCartBouncing(true);
    setTimeout(() => setCartBouncing(false), 600);
  }, []);

  return (
    <AnimationContext.Provider value={{ triggerFlyToCart, cartBouncing }}>
      {children}

      {/* Floating Produce Flight Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <AnimatePresence>
          {flyingItems.map((item) => {
            // Calculate a curved peak path
            const midX = (item.startX + item.targetX) / 2;
            const midY = Math.min(item.startY, item.targetY) - 100;

            return (
              <motion.div
                key={item.id}
                initial={{
                  x: item.startX - 36,
                  y: item.startY - 36,
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  x: [item.startX - 36, midX - 25, item.targetX - 16],
                  y: [item.startY - 36, midY, item.targetY - 16],
                  scale: [1, 0.75, 0.25],
                  rotate: [0, -25, 25, 10],
                  opacity: [1, 1, 0.9, 0],
                }}
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1], // Smooth custom cubic bezier
                  times: [0, 0.5, 1],
                }}
                onAnimationComplete={() => handleAnimationComplete(item.id)}
                className="absolute h-18 w-18 origin-center rounded-2xl border-2 border-white/80 bg-white p-1 shadow-2xl"
                style={{ width: 72, height: 72 }}
              >
                <img
                  src={item.imageSrc}
                  alt={item.productName}
                  className="h-full w-full rounded-xl object-cover"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modern Signature Toast Confirmation */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-slate-900/90 px-4 py-3 text-white shadow-2xl backdrop-blur-md"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{t('toasts.addedToBasket')}</p>
                <p className="text-[11px] text-slate-300 truncate max-w-[200px]">
                  {toastMessage.name} {t('toasts.inYourCart')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimationContext.Provider>
  );
};

export const useProductAnimation = () => useContext(AnimationContext);
