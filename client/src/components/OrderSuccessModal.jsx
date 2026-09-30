import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Package, ShoppingBasket, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const OrderSuccessModal = ({ orderId, orderNumber, onClose }) => {
  const navigate = useNavigate();
  const { t, isTamil } = useLanguage();
  const [step, setStep] = useState(0); // 0: Produce -> Basket, 1: Basket -> Crate, 2: Final Confirmed

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1100);
    const t2 = setTimeout(() => setStep(2), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#74A12E]/30 bg-gradient-to-b from-[#1E3F20] to-[#122814] p-8 text-center text-[#FDFBF7] shadow-2xl"
      >
        {/* Subtle floating leaves background */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#74A12E]/20 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-[#4E3629]/40 blur-2xl" />

        {/* 3-Step Journey Micro-Animation: Produce -> Basket -> Crate */}
        <div className="relative mx-auto my-6 flex h-36 w-full items-center justify-center">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-produce"
                initial={{ scale: 0.5, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 30, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="flex space-x-3 text-3xl">
                  <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>🍅</motion.span>
                  <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}>🥭</motion.span>
                  <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.1, delay: 0.4 }}>🥕</motion.span>
                </div>
                <span className="text-xs font-bold text-[#A5D64E]">{isTamil ? 'புதிய அறுவடை தேர்ந்தெடுக்கப்படுகிறது...' : 'Selecting Fresh Harvest...'}</span>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-basket"
                initial={{ scale: 0.6, y: -10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4E3629]/30 text-amber-300 border border-[#4E3629]/40 shadow-lg">
                  <ShoppingBasket className="h-9 w-9" />
                </div>
                <span className="text-xs font-bold text-amber-200">{isTamil ? 'அறுவடை கூடை தயாராகிறது...' : 'Assembling Harvest Basket...'}</span>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-crate"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-[#74A12E] text-[#FDFBF7] shadow-xl shadow-[#74A12E]/30">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <span className="text-xs font-bold text-[#A5D64E]">{isTamil ? 'சுற்றுச்சூழல் பாதுகாப்பான கூடை தயார்' : 'Sealed in Temperature-Controlled Crate'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confirmed Typography */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#FDFBF7] sm:text-3xl">
            {t('checkout.orderSuccess')}
          </h2>
          <p className="text-sm text-[#FDFBF7]/75">
            {t('checkout.orderSubtext')}
          </p>
          {orderNumber && (
            <p className="font-mono text-xs text-[#A5D64E] font-bold">
              {isTamil ? `ஆர்டர் எண்: #${orderNumber}` : `Order ID: #${orderNumber}`}
            </p>
          )}
        </div>

        {/* Action Button to Order Tracking */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              if (onClose) onClose();
              navigate(`/buyer/orders/${orderId}`);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#82B134] to-[#74A12E] py-3.5 text-sm font-black text-[#FDFBF7] shadow-lg shadow-[#74A12E]/25 transition hover:brightness-105"
          >
            <span>{isTamil ? 'விநியோகப் பயணத்தைக் கண்காணிக்க' : 'Track Delivery Journey'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessModal;
