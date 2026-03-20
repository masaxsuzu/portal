'use client';

import { usePathname } from 'next/navigation';
import { useAppContext } from '../contexts/AppContext';

export default function Controls() {
  const { theme, toggleTheme, lang, toggleLang } = useAppContext();
  const pathname = usePathname();

  return (
    <div className="fixed top-4 right-4 flex gap-2 z-50">
      <button
        onClick={toggleLang}
        aria-label="Toggle language"
        className="bg-cardbg border border-cardborder text-primary px-3 py-1 rounded-lg text-sm hover:border-skyblue transition-colors"
      >
        {lang === 'en' ? 'JA' : 'EN'}
      </button>
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="bg-cardbg border border-cardborder text-primary px-3 py-1 rounded-lg text-sm hover:border-skyblue transition-colors"
      >
        {theme === 'dark' ? (
          <i className="fa-solid fa-sun" />
        ) : (
          <i className="fa-solid fa-moon" />
        )}
      </button>
      {pathname !== '/login' && (
        <a
          href="/api/auth/logout"
          aria-label="Logout"
          className="bg-cardbg border border-cardborder text-primary px-3 py-1 rounded-lg text-sm hover:border-skyblue transition-colors"
        >
          <i className="fa-solid fa-right-from-bracket" />
        </a>
      )}
    </div>
  );
}
