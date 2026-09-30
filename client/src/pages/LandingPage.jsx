import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Truck,
  Sparkles,
  MapPin,
} from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Hero3DScene from '../components/3d/Hero3DScene';
import ScrollStory from '../components/ScrollStory';
import Button3D from '../components/ui/Button3D';
import { useLanguage } from '../context/LanguageContext';

const regions = ['Nashik', 'Punjab', 'Kodagu', 'Andhra', 'Himachal', 'Satara', 'Ooty', 'Kolhapur', 'Ratnagiri', 'Mysuru'];

const LandingPage = () => {
  const { t, isTamil } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/products?limit=4&sort=popularity');
        if (res.data.success) {
          setFeaturedProducts(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch featured produce:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16 pb-16 bg-[#FDFBF7] text-[#1E3F20]">
      {/* 3D Hero Section with Deep Forest #1E3F20 & Fertile Soil Accent */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1E3F20] via-[#2A5230] to-[#142C16] pt-12 pb-20 text-[#FDFBF7]">
        {/* Subtle grid background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#74A12E_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 min-h-[580px]">
            {/* Left Column: Headlines & CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left z-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#74A12E]/40 bg-[#74A12E]/15 px-4 py-1.5 text-xs font-bold text-[#D2ECA6] backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-[#D2ECA6]" />
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-[#FDFBF7] sm:text-6xl lg:text-[4.2rem] leading-[1.12]">
                {t('hero.titlePart1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B6DF73] via-[#FAF6EE] to-[#E3D4CB]">
                  {t('hero.titlePart2')}
                </span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-[#FDFBF7]/85 sm:text-lg">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start pt-2">
                <Link to="/marketplace">
                  <Button3D
                    variant="primary"
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    {t('hero.exploreCta')}
                  </Button3D>
                </Link>

                <Link to="/register?role=farmer">
                  <Button3D
                    variant="secondary"
                    size="lg"
                    className="border-[#FDFBF7]/30 bg-[#FDFBF7]/10 text-[#FDFBF7] hover:bg-[#FDFBF7]/20"
                  >
                    {t('hero.sellCta')}
                  </Button3D>
                </Link>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-[#FDFBF7]/15 pt-6 text-left max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-black text-[#FDFBF7]">3%</p>
                  <p className="text-[11px] font-semibold text-[#D2ECA6]">{isTamil ? 'நிலையான தளக் கட்டணம்' : 'Fixed Platform Fee'}</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#FDFBF7]">100%</p>
                  <p className="text-[11px] font-semibold text-[#D2ECA6]">{isTamil ? 'சரிபார்க்கப்பட்ட விவசாயிகள்' : 'Verified Farmers'}</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#FDFBF7]">₹0</p>
                  <p className="text-[11px] font-semibold text-[#D2ECA6]">{isTamil ? 'இடைத்தரகர் கட்டணம்' : 'Broker Markups'}</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: 3D Interactive Produce Crate Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="lg:col-span-6 relative flex items-center justify-center"
            >
              <div className="w-full relative">
                <Hero3DScene />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/40 px-4 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur-md pointer-events-none">
                  {t('hero.hoverCrate')}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Origin Regions Ticker with Soft Cream & Fertile Soil Accents */}
      <div className="overflow-hidden border-y border-[#4E3629]/15 bg-[#FAF6EE] py-3.5 shadow-sm">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {[...regions, ...regions].map((region, i) => (
            <span key={i} className="flex items-center text-xs font-bold uppercase tracking-wider text-[#4E3629]">
              <MapPin className="mr-1.5 h-3.5 w-3.5 text-[#74A12E]" />
              {t('hero.directFrom')} {region} {t('hero.farmHub')}
            </span>
          ))}
        </div>
      </div>

      {/* Value Proposition Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#74A12E]">{t('valueProps.kicker')}</span>
          <h2 className="mt-1 text-3xl font-black text-[#1E3F20]">{t('valueProps.title')}</h2>
          <p className="mt-2 text-sm text-[#4E3629]/80">{t('valueProps.subtitle')}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-7 shadow-sm transition hover:shadow-xl hover:border-[#74A12E]/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5D0] text-[#74A12E] shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#1E3F20]">{t('valueProps.verifiedTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#4E3629]/80">
              {t('valueProps.verifiedDesc')}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-7 shadow-sm transition hover:shadow-xl hover:border-[#74A12E]/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5D0] text-[#74A12E] shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#1E3F20]">{t('valueProps.feeTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#4E3629]/80">
              {t('valueProps.feeDesc')}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-7 shadow-sm transition hover:shadow-xl hover:border-[#74A12E]/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5D0] text-[#74A12E] shadow-sm">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#1E3F20]">{t('valueProps.logisticsTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#4E3629]/80">
              {t('valueProps.logisticsDesc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Scroll Storytelling Section: Seed -> Farm -> Produce -> Market -> Cart -> Delivery */}
      <ScrollStory />

      {/* Featured Produce Showcase with 3D cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#74A12E]">{isTamil ? 'நேரடி அறுவடை' : 'Direct Harvest'}</span>
            <h2 className="text-2xl font-black text-[#1E3F20]">{isTamil ? 'சிறப்பு விளைபொருட்கள்' : 'Featured Direct Produce'}</h2>
          </div>
          <Link
            to="/marketplace"
            className="group flex items-center text-sm font-bold text-[#74A12E] hover:text-[#5C8223]"
          >
            <span>{isTamil ? 'அனைத்து விளைபொருட்களும்' : 'View All Produce'}</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 animate-pulse rounded-3xl bg-[#FAF6EE] border border-[#4E3629]/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Closing Call to Action Banner with Deep Forest #1E3F20 & Fertile Soil #4E3629 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E3F20] via-[#2A5230] to-[#4E3629] p-10 text-[#FDFBF7] shadow-2xl border border-[#74A12E]/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="rounded-full bg-[#74A12E]/30 px-3 py-1 text-xs font-bold text-[#D2ECA6] border border-[#74A12E]/40">
                {t('valueProps.ctaBadge')}
              </span>
              <h3 className="mt-3 text-2xl font-black sm:text-3xl">{t('valueProps.ctaTitle')}</h3>
              <p className="mt-1 text-sm text-[#FDFBF7]/80">{t('valueProps.ctaSub')}</p>
            </div>
            <Link to="/marketplace">
              <Button3D variant="primary" size="lg">
                {t('valueProps.ctaBtn')}
              </Button3D>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
