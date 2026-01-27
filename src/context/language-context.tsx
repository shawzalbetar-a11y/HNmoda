"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import ar from '@/locales/ar.json';

const translations: Record<string, any> = { en, tr, ar };

type Language = 'en' | 'tr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && ['en', 'tr', 'ar'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
      document.documentElement.lang = storedLanguage;
      document.documentElement.dir = storedLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    // Force a re-render by reloading the page. A bit heavy, but ensures all components update.
    window.location.reload();
  };

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
