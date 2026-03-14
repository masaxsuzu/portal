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
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedLang = localStorage.getItem('lang') as Lang | null;
    if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme);
    if (savedLang === 'en' || savedLang === 'ja') {
      setLang(savedLang);
    } else {
      const browserLang = navigator.language.toLowerCase();
      setLang(browserLang.startsWith('ja') ? 'ja' : 'en');
    }
  }, []);

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
