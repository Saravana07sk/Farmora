import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PriceBreakdown = ({ subtotal = 0, platformFee = 0, deliveryFee = 0, totalAmount = 0, feePercentage = 3 }) => {
  const { isTamil } = useLanguage();

  return (
    <div className="rounded-2xl border border-[#4E3629]/15 bg-[#FAF6EE] p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-3">
        <h3 className="flex items-center text-sm font-semibold uppercase tracking-wider text-[#1E3F20]">
          <ShieldCheck className="mr-2 h-4 w-4 text-[#74A12E]" />
          {isTamil ? 'வெளிப்படையான விலை விவரம்' : 'Transparent Pricing Breakdown'}
        </h3>
        <span className="rounded-full bg-[#74A12E]/15 px-2.5 py-0.5 text-xs font-bold text-[#74A12E]">
          {isTamil ? 'மறைமுக கட்டணம் இல்லை' : 'Zero Hidden Fees'}
        </span>
      </div>

      <div className="mt-4 space-y-2.5 text-sm text-[#4E3629]/80">
        <div className="flex justify-between">
          <span>{isTamil ? 'விளைபொருள் மொத்தம்' : 'Produce Subtotal'}</span>
          <span className="font-semibold text-[#1E3F20]">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center text-[#4E3629]/80">
            {isTamil ? `அக்ரிலிங்க் தளக் கட்டணம் (${feePercentage}%)` : `AgriLink Platform Fee (${feePercentage}%)`}
            <span className="group relative ml-1.5 cursor-pointer">
              <Info className="h-3.5 w-3.5 text-[#4E3629]/50 hover:text-[#74A12E]" />
              <span className="absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 rounded-lg bg-[#1E3F20] px-2.5 py-1 text-xs text-[#FDFBF7] shadow-lg group-hover:block whitespace-nowrap">
                {isTamil ? 'தர சரிபார்ப்பு மற்றும் விவசாயி ஆதரவு நிதியளிப்பு' : 'Directly funds quality verification & farmer support'}
              </span>
            </span>
          </span>
          <span className="font-semibold text-[#1E3F20]">₹{platformFee.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between">
          <span>{isTamil ? 'பசுமை விநியோக கட்டணம்' : 'Logistics & Delivery Fee'}</span>
          {deliveryFee === 0 ? (
            <span className="font-bold text-[#74A12E]">{isTamil ? 'இலவசம்' : 'FREE'}</span>
          ) : (
            <span className="font-semibold text-[#1E3F20]">₹{deliveryFee.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#4E3629]/15 pt-3">
        <div>
          <span className="text-base font-bold text-[#1E3F20]">{isTamil ? 'மொத்த செலுத்த வேண்டிய தொகை' : 'Total Payable'}</span>
          <p className="text-xs text-[#4E3629]/70">{isTamil ? 'அனைத்து வரிகள் மற்றும் நேரடி விவசாயி பணம் உள்ளடக்கியது' : 'Includes all taxes and direct farm payouts'}</p>
        </div>
        <span className="text-2xl font-extrabold text-[#74A12E]">₹{totalAmount.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
};

export default PriceBreakdown;
