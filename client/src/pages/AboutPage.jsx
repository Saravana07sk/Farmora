import React from 'react';
import { ShieldCheck, Sprout, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PriceBreakdown from '../components/PriceBreakdown';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="agri-about-hero">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#74A12E] text-[#FDFBF7] shadow-lg shadow-[#74A12E]/25">
          <Sprout className="h-8 w-8" />
        </div>
        <p className="agri-kicker text-[#74A12E]">{t('about.kicker')}</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-6xl text-[#FDFBF7]">{t('about.title')}</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#FDFBF7]/75">
          {t('about.subtitle')}
        </p>
      </div>

      <section className="space-y-6 rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-8 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-[#1E3F20]">{t('about.guaranteeTitle')}</h2>
        <p className="text-sm leading-relaxed text-[#4E3629]/80">
          {t('about.guaranteeText')}
        </p>
        <PriceBreakdown
          subtotal={1000}
          platformFee={30}
          deliveryFee={70}
          totalAmount={1100}
          feePercentage={3}
        />
      </section>

      <section className="space-y-4 rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-8 shadow-sm">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-[#1E3F20]">
          <ShieldCheck className="h-6 w-6 text-[#74A12E]" /> {t('about.standardsTitle')}
        </h2>
        <ul className="space-y-3 text-sm text-[#4E3629]/80">
          <li className="flex items-start">
            <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-[#74A12E]" />
            <span><strong>{t('about.landVerification')}</strong> {t('about.landVerificationDesc')}</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-[#74A12E]" />
            <span><strong>{t('about.qualityInspection')}</strong> {t('about.qualityInspectionDesc')}</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-[#74A12E]" />
            <span><strong>{t('about.verifiedBadge')}</strong> {t('about.verifiedBadgeDesc')}</span>
          </li>
        </ul>
        <Link to="/marketplace" className="agri-text-link mt-4 inline-flex">
          {t('about.browseHarvestBtn')} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
