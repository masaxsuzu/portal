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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-4 h-4 fill-current"
            aria-hidden="true"
          >
            <path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.4c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.4 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.6c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.4 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM256 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="w-4 h-4 fill-current"
            aria-hidden="true"
          >
            <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
          </svg>
        )}
      </button>
      {pathname !== '/login' && (
        <a
          href="/api/auth/logout"
          aria-label="Logout"
          className="bg-cardbg border border-cardborder text-primary px-3 py-1 rounded-lg text-sm hover:border-skyblue transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-4 h-4 fill-current"
            aria-hidden="true"
          >
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
          </svg>
        </a>
      )}
    </div>
  );
}
