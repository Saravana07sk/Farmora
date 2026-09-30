import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../locales/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('agrilink_lang') || 'en';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('agrilink_lang', newLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
      if (newLang === 'ta') {
        document.documentElement.classList.add('font-tamil');
      } else {
        document.documentElement.classList.remove('font-tamil');
      }
    }
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ta' : 'en');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      if (lang === 'ta') {
        document.documentElement.classList.add('font-tamil');
      } else {
        document.documentElement.classList.remove('font-tamil');
      }
    }
  }, [lang]);

  // Translate by dot-path: e.g. t('hero.titlePart1')
  const t = (path, fallback = '') => {
    if (!path) return fallback;
    const keys = path.split('.');
    let cur = translations[lang];
    for (const k of keys) {
      if (!cur || cur[k] === undefined) {
        // Fallback to English dictionary
        let enCur = translations['en'];
        for (const ek of keys) {
          if (!enCur || enCur[ek] === undefined) return fallback || path;
          enCur = enCur[ek];
        }
        return enCur || fallback || path;
      }
      cur = cur[k];
    }
    return cur || fallback || path;
  };

  // Helper for translating categories dynamically
  const translateCategory = (cat) => {
    if (!cat) return '';
    return translations[lang]?.categories?.[cat] || translations['en']?.categories?.[cat] || cat;
  };

  // Helper for translating farming methods dynamically
  const translateFarmingMethod = (method) => {
    if (!method) return '';
    return translations[lang]?.farmingMethods?.[method] || translations['en']?.farmingMethods?.[method] || method;
  };

  // Helper for translating units (kg, ton, crate, etc.)
  const translateUnit = (unit) => {
    if (!unit) return '';
    return translations[lang]?.units?.[unit.toLowerCase()] || unit;
  };

  // Helper for translating Indian state names
  const translateState = (stateName) => {
    if (!stateName) return '';
    return translations[lang]?.states?.[stateName] || stateName;
  };

  // Helper for translating order & item statuses
  const translateStatus = (status) => {
    if (!status) return '';
    return translations[lang]?.statuses?.[status] || translations[lang]?.statuses?.[status.toUpperCase()] || status;
  };

  // Helper for translating roles (farmer, buyer, admin)
  const translateRole = (role) => {
    if (!role) return '';
    return translations[lang]?.roles?.[role.toLowerCase()] || role;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        translateCategory,
        translateFarmingMethod,
        translateUnit,
        translateState,
        translateStatus,
        translateRole,
        isTamil: lang === 'ta',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
