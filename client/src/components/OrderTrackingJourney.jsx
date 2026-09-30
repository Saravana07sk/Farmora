import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, CheckCircle2, Package, Truck, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const stageConfigs = [
  { key: 'PLACED', icon: Sprout },
  { key: 'CONFIRMED', icon: CheckCircle2 },
  { key: 'PROCESSING', icon: Package },
  { key: 'OUT_FOR_DELIVERY', icon: Truck },
  { key: 'DELIVERED', icon: Home },
];

const statusToIdx = {
  PLACED: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  READY_FOR_DELIVERY: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

const OrderTrackingJourney = ({ currentStatus = 'PLACED' }) => {
  const { t, translateStatus } = useLanguage();
  const currentIdx = statusToIdx[currentStatus] !== undefined ? statusToIdx[currentStatus] : 0;
  const isCancelled = currentStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-6 text-center">
        <h4 className="text-sm font-bold text-rose-800">{t('trackingJourney.cancelledTitle')}</h4>
        <p className="mt-1 text-xs text-rose-600">{t('trackingJourney.cancelledDesc')}</p>
      </div>
    );
  }

  // Progress percentage (0% to 100%)
  const progressPercent = (currentIdx / (stageConfigs.length - 1)) * 100;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E3F20]">
            {t('trackingJourney.title')}
          </h3>
          <p className="text-xs text-[#4E3629]/70">{t('trackingJourney.sub')}</p>
        </div>
        <span className="rounded-full bg-[#74A12E]/15 px-3 py-1 text-xs font-black text-[#74A12E] uppercase">
          {translateStatus(currentStatus)}
        </span>
      </div>

      {/* Visual Track Container */}
      <div className="relative py-6">
        {/* Background Grey Track Line */}
        <div className="absolute left-6 right-6 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#4E3629]/10" />

        {/* Animated Green Progress Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="absolute left-6 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#1E3F20] via-[#74A12E] to-[#9CD04A]"
          style={{ maxWidth: 'calc(100% - 48px)' }}
        />

        {/* Milestones Grid */}
        <div className="relative z-10 flex justify-between">
          {stageConfigs.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = currentIdx >= idx;
            const isCurrent = currentIdx === idx;
            const stageLabel = t(`trackingJourney.stages.${stage.key}.label`);
            const stageDesc = t(`trackingJourney.stages.${stage.key}.desc`);

            return (
              <div key={stage.key} className="flex flex-col items-center">
                {/* Node Icon Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.15, 1] : 1,
                  }}
                  transition={{
                    repeat: isCurrent ? Infinity : 0,
                    duration: 2.2,
                    ease: 'easeInOut',
                  }}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all shadow-sm ${
                    isCompleted
                      ? 'border-[#74A12E] bg-[#74A12E] text-[#FDFBF7] shadow-[#74A12E]/30'
                      : 'border-[#4E3629]/20 bg-[#FAF6EE] text-[#4E3629]/50'
                  } ${isCurrent ? 'ring-4 ring-[#74A12E]/30' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>

                {/* Milestone Labels */}
                <div className="mt-3 text-center">
                  <span className={`block text-xs font-bold ${isCompleted ? 'text-[#1E3F20]' : 'text-[#4E3629]/50'}`}>
                    {stageLabel}
                  </span>
                  <span className="block text-[10px] text-[#4E3629]/60">
                    {stageDesc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingJourney;
