'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../contexts/AppContext';

export default function Controls() {
  const { theme, toggleTheme, lang, toggleLang } = useAppContext();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        className="bg-cardbg border border-cardborder text-primary w-9 h-9 rounded-lg flex items-center justify-center hover:border-skyblue transition-colors"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-11 left-0 w-52 bg-cardbg border border-cardborder rounded-xl shadow-xl py-1">
          {/* Language */}
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="flex items-center gap-2.5 text-primary text-sm">
              <i className="fa-solid fa-language w-4 text-center opacity-60" />
              Language
            </span>
            <button
              onClick={toggleLang}
              aria-label="Toggle language"
              className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-background border border-cardborder text-primary hover:border-skyblue transition-colors"
            >
              {lang === 'en' ? 'JA' : 'EN'}
            </button>
          </div>

          {/* Dark mode */}
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="flex items-center gap-2.5 text-primary text-sm">
              <i
                className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} w-4 text-center opacity-60`}
              />
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              role="switch"
              aria-checked={theme === 'dark'}
              className={`relative w-9 h-5 rounded-full transition-colors focus:outline-none ${
                theme === 'dark' ? 'bg-skyblue' : 'bg-cardborder'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Logout */}
          {pathname !== '/login' && (
            <>
              <div className="my-1 border-t border-cardborder" />
              <a
                href="/api/auth/logout"
                aria-label="Logout"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary hover:text-skyblue transition-colors"
              >
                <i className="fa-solid fa-right-from-bracket w-4 text-center" />
                Logout
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
