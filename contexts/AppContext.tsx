'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type { Lang, Translations } from '../lib/i18n';
import { translations } from '../lib/i18n';

export type Theme = 'dark' | 'light';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  toggleLang: () => void;
  t: Translations;
}

const AppContext = createContext<AppContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  lang: 'en',
  toggleLang: () => {},
  t: translations.en,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    /* istanbul ignore next */
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || saved === 'light' ? saved : 'dark';
  });
  const [lang, setLang] = useState<Lang>(() => {
    /* istanbul ignore next */
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'ja') return saved;
    return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'ja' : 'en'));

  return (
    <AppContext.Provider
      value={{ theme, toggleTheme, lang, toggleLang, t: translations[lang] }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
