import React, { createContext, useContext, useState, useEffect } from 'react';
import fr from '../../messages/fr.json';
import en from '../../messages/en.json';
import ar from '../../messages/ar.json';

type Language = 'fr' | 'en' | 'ar';

interface LanguageContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, any> = { fr, en, ar };

// Helper function to resolve nested dot notation keys (e.g. "services.general.title")
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object') {
      return acc[part];
    }
    return undefined;
  }, obj) || path;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Language>(() => {
    const saved = localStorage.getItem('clinic_lang');
    return (saved === 'fr' || saved === 'en' || saved === 'ar') ? saved : 'fr';
  });

  const setLocale = (lang: Language) => {
    setLocaleState(lang);
    localStorage.setItem('clinic_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = (key: string): string => {
    const dict = translations[locale];
    return getNestedValue(dict, key);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
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
