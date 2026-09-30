import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Tractor, Apple, Store, ShoppingBag, Truck, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const STAGE_CONFIGS = [
  {
    id: 'seed',
    titleEn: 'Heirloom Seed',
    titleTa: 'விதை & மண் தேர்வு',
    step: '01',
    icon: Sprout,
    badgeEn: 'Stage 1 • Planting',
    badgeTa: 'நிலை 1 • விதைப்பு',
    color: '#52b788',
    descEn: 'Certified non-GMO, organic seeds selected and planted by verified agricultural producers.',
    descTa: 'பாரம்பரிய, ஆரோக்கியமான இயற்கை விதைகள் தேர்வு செய்யப்பட்டு ஊட்டச்சத்து மிக்க மண்ணில் நடப்படுகின்றன.',
    detailsEn: 'Soil testing, organic compost enrichment, and micro-climate planning ensure robust germination.',
    detailsTa: 'மண் பரிசோதனை, இயற்கை உர ஊட்டச்சத்து மற்றும் தட்பவெப்ப திட்டமிடலுடன் சிறந்த முளைப்புத்திறன் உறுதி செய்யப்படுகிறது.',
  },
  {
    id: 'farm',
    titleEn: 'Verified Farm',
    titleTa: 'இயற்கை சாகுபடி',
    step: '02',
    icon: Tractor,
    badgeEn: 'Stage 2 • Cultivation',
    badgeTa: 'நிலை 2 • சாகுபடி',
    color: '#2d6a4f',
    descEn: 'Cultivated in verified regional farms across Tamil Nadu, Karnataka, and Maharashtra.',
    descTa: 'தமிழ்நாடு, கர்நாடகா உள்ளிட்ட மண்டலப் பண்ணைகளில் ரசாயன உரங்களின்றி கவனமாக வளர்க்கப்படுகிறது.',
    detailsEn: 'Zero chemical pesticides. Monitored through GPS boundary verification and regular harvest audits.',
    detailsTa: 'பூச்சிக்கொல்லி இல்லாத இயற்கை முறை. ஜிபிஎஸ் நில எல்லை மற்றும் அறுவடை தணிக்கை மூலம் கண்காணிக்கப்படுகிறது.',
  },
  {
    id: 'produce',
    titleEn: 'Fresh Harvest Produce',
    titleTa: 'புதிய அறுவடை',
    step: '03',
    icon: Apple,
    badgeEn: 'Stage 3 • Harvest',
    badgeTa: 'நிலை 3 • அறுவடை',
    color: '#eb5e28',
    descEn: 'Harvested early morning at peak freshness and firmness, sorted under rigorous organic standards.',
    descTa: 'அதிகாலை நேரத்தில் புதிதாக அறுவடை செய்யப்பட்டு, தரமான இயற்கை முறையில் தரம் பிரிக்கப்படுகிறது.',
    detailsEn: 'Hand-picked, field-cleaned, and packed in breathable eco-crates to minimize bruising.',
    detailsTa: 'கைகளால் பறிக்கப்பட்டு, தூய்மை செய்யப்பட்டு, சேதமடையாமல் இருக்க காற்றோட்டமுள்ள சுற்றுச்சூழல் கூடைகளில் பேக் செய்யப்படுகிறது.',
  },
  {
    id: 'market',
    titleEn: 'Direct Marketplace',
    titleTa: 'நேரடி சந்தை',
    step: '04',
    icon: Store,
    badgeEn: 'Stage 4 • Transparency',
    badgeTa: 'நிலை 4 • வெளிப்படைத்தன்மை',
    color: '#f4a261',
    descEn: 'Listed directly on AgriLink without intermediary brokers. Farmers set fair market prices.',
    descTa: 'இடைத்தரகர்கள் இன்றி அக்ரிலிங்கில் நேரடியாக பட்டியலிடப்படுகிறது. விவசாயிகள் தங்களுக்குரிய நியாய விலையை நிர்ணயிக்கின்றனர்.',
    detailsEn: 'Buyers view transparent breakdown: Produce Subtotal + 3% Platform Fee + Delivery.',
    detailsTa: 'வாங்குபவர்கள் வெளிப்படையான விலைக் கணக்கீட்டைக் காண்கிறார்கள்: விளைபொருள் விலை + 3% தளக் கட்டணம் + விநியோகம்.',
  },
  {
    id: 'cart',
    titleEn: 'Smart Basket',
    titleTa: 'விளைபொருள் கூடை',
    step: '05',
    icon: ShoppingBag,
    badgeEn: 'Stage 5 • Order Lock',
    badgeTa: 'நிலை 5 • ஆர்டர் பதிவு',
    color: '#74c69d',
    descEn: 'Buyer reserves quantity with guaranteed stock allocation and instant farmer notification.',
    descTa: 'வாங்குபவர் தேவையான அளவை தேர்வு செய்து உறுதி செய்கிறார். உடனடியாக விவசாயிக்கு தகவல் அனுப்பப்படுகிறது.',
    detailsEn: 'Direct order dispatch alerts sent instantly to the farm packing station.',
    detailsTa: 'பண்ணை பேக்கிங் நிலையத்திற்கு நேரடி ஆர்டர் எச்சரிக்கை வினாடிகளில் சென்றடைகிறது.',
  },
  {
    id: 'delivery',
    titleEn: 'Direct Delivery',
    titleTa: 'நேரடி விநியோகம்',
    step: '06',
    icon: Truck,
    badgeEn: 'Stage 6 • Doorstep',
    badgeTa: 'நிலை 6 • வாசல் வரை',
    color: '#1b4332',
    descEn: 'Direct transit from farm packing shed to buyer location, preserving freshness.',
    descTa: 'பண்ணையிலிருந்து நேரடியாக வாடிக்கையாளர் வீட்டுக்கே விரைவான பசுமை விநியோகம்.',
    detailsEn: 'Complete end-to-end status tracking from harvest dispatch to final handover.',
    detailsTa: 'அறுவடை முதல் கைசேரும் வரை முழுமையான நேரடி நிலை கண்காணிப்பு வசதி.',
  },
];

const ScrollStory = () => {
  const { isTamil } = useLanguage();
  const [activeStage, setActiveStage] = useState(0);

  const stages = STAGE_CONFIGS.map((c) => ({
    id: c.id,
    step: c.step,
    icon: c.icon,
    color: c.color,
    title: isTamil ? c.titleTa : c.titleEn,
    badge: isTamil ? c.badgeTa : c.badgeEn,
    description: isTamil ? c.descTa : c.descEn,
    details: isTamil ? c.detailsTa : c.detailsEn,
  }));

  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-emerald-700/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 backdrop-blur-md">
            {isTamil ? 'உங்கள் உணவின் முழு பயணம்' : 'The Journey of Your Food'}
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {isTamil ? 'விதை முதல் உங்கள் வாசல் வரை' : 'From Seed to Doorstep'}
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            {isTamil
              ? 'நேரடி விவசாய வர்த்தகத்தை இயக்கும் 6-படி வெளிப்படையான வாழ்க்கை சுழற்சி.'
              : 'Experience the transparent 6-stage lifecycle that powers direct farm-to-market commerce.'}
          </p>
        </div>

        {/* Timeline Progress Track */}
        <div className="mt-12 flex justify-between gap-2 overflow-x-auto pb-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`group flex min-w-[120px] flex-1 flex-col items-center rounded-2xl p-3 text-center transition-all ${
                  isActive
                    ? 'bg-white/15 border border-emerald-400/40 shadow-lg shadow-emerald-950/40 backdrop-blur-md'
                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                    isActive ? 'bg-emerald-500 text-slate-950 shadow-md scale-110' : 'bg-white/10 text-slate-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`mt-2 text-xs font-bold ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {stage.title}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{stage.step}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Stage Display Card */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-2xl shadow-2xl"
            >
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-300">
                    {stages[activeStage].badge}
                  </div>
                  <h3 className="text-2xl font-black text-white sm:text-3xl">
                    {stages[activeStage].title}
                  </h3>
                  <p className="text-base leading-relaxed text-slate-300">
                    {stages[activeStage].description}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-400 border-l-2 border-emerald-500/50 pl-4 italic">
                    {stages[activeStage].details}
                  </p>
                </div>

                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-950/60 shadow-inner">
                    {React.createElement(stages[activeStage].icon, {
                      className: 'h-20 w-20 text-emerald-400 drop-shadow-[0_10px_20px_rgba(45,106,79,0.5)]',
                    })}
                  </div>
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-bold text-slate-400">
                <button
                  disabled={activeStage === 0}
                  onClick={() => setActiveStage((p) => Math.max(0, p - 1))}
                  className="rounded-xl px-3 py-1.5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  {isTamil ? '← முந்தைய நிலை' : '← Previous Stage'}
                </button>
                <span className="font-mono text-emerald-400">
                  {isTamil ? `நிலை ${activeStage + 1} / ${stages.length}` : `Stage ${activeStage + 1} of ${stages.length}`}
                </span>
                <button
                  disabled={activeStage === stages.length - 1}
                  onClick={() => setActiveStage((p) => Math.min(stages.length - 1, p + 1))}
                  className="rounded-xl px-3 py-1.5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  {isTamil ? 'அடுத்த நிலை →' : 'Next Stage →'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ScrollStory;
