import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart, Truck, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#684534]/50 bg-[#4E3629] text-[#FDFBF7]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#74A12E] text-[#FDFBF7] shadow-md">
                <Sprout className="h-6 w-6" />
              </div>
              <span className="font-display text-xl font-black text-[#FDFBF7]">
                Agri<span className="text-[#95CB41]">Link</span>
              </span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-[#FDFBF7]/70">
              {t('footer.brandDesc')}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#95CB41]">{t('footer.marketplaceHeading')}</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#FDFBF7]/85">
              <li><Link to="/marketplace?category=Vegetables" className="hover:text-[#95CB41] transition-colors">{t('footer.vegLink')}</Link></li>
              <li><Link to="/marketplace?category=Fruits" className="hover:text-[#95CB41] transition-colors">{t('footer.fruitsLink')}</Link></li>
              <li><Link to="/marketplace?category=Grains" className="hover:text-[#95CB41] transition-colors">{t('footer.grainsLink')}</Link></li>
              <li><Link to="/marketplace?category=Spices" className="hover:text-[#95CB41] transition-colors">{t('footer.spicesLink')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#95CB41]">{t('footer.guaranteeHeading')}</h4>
            <ul className="mt-4 space-y-2 text-xs text-[#FDFBF7]/80">
              <li className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-[#74A12E]" /> {t('footer.verifiedFarmersOnly')}</li>
              <li className="flex items-center"><Heart className="mr-2 h-4 w-4 text-[#74A12E]" /> {t('footer.transparentFee')}</li>
              <li className="flex items-center"><Truck className="mr-2 h-4 w-4 text-[#74A12E]" /> {t('footer.coldChainDelivery')}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#95CB41]">{t('footer.supportHeading')}</h4>
            <p className="mt-4 text-xs text-[#FDFBF7]/80">
              {t('footer.supportHotline')}
              <br />
              <span className="font-bold text-[#FDFBF7] text-sm">+91 1800-AGRILINK</span>
            </p>
            <p className="mt-2 text-xs text-[#FDFBF7]/60">support@agrilink.demo</p>
            <Link to="/register" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#95CB41] hover:underline">
              {t('footer.joinNetwork')} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-[#684534]/60 pt-6 text-center text-[11px] uppercase tracking-[0.16em] text-[#FDFBF7]/50">
          <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
