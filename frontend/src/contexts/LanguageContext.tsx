import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

export type Language = 'en' | 'mi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, mi: string) => string;  // Translation helper
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(() => {
  const savedLang = localStorage.getItem('lang');
  return savedLang === 'mi' || savedLang === 'en' ? savedLang : 'en';
  });

  useEffect(() => {
  localStorage.setItem('lang', language);
}, [language]);

  // Translation helper - returns text based on current language
  const t = (en: string, mi: string): string => {
    return language === 'en' ? en : mi;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

