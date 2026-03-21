'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../contexts/AppContext';

interface Props {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const XIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="1" y1="1" x2="13" y2="13" />
    <line x1="13" y1="1" x2="1" y2="13" />
  </svg>
);

const HamburgerIcon = () => (
  <svg
    width="18"
    height="14"
    viewBox="0 0 18 14"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="0" y="0" width="18" height="2" rx="1" />
    <rect x="0" y="6" width="18" height="2" rx="1" />
    <rect x="0" y="12" width="18" height="2" rx="1" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    className="w-4 h-4 fill-current"
    aria-hidden="true"
  >
    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
  </svg>
);

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    className="w-4 h-4 fill-current"
    aria-hidden="true"
  >
    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707z" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    className="w-4 h-4 fill-current"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
    />
    <path
      fillRule="evenodd"
      d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
    />
  </svg>
);

export default function Controls({
  isOpen: isOpenProp,
  setIsOpen: setIsOpenProp,
}: Props = {}) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = isOpenProp ?? isOpenInternal;
  const setIsOpen = setIsOpenProp ?? setIsOpenInternal;
  const { theme, toggleTheme, lang, toggleLang, t } = useAppContext();
  const pathname = usePathname();

  // Sync address-bar color (Safari / Chrome on Android)
  useEffect(() => {
    const color = theme === 'light' ? '#f5f4fb' : '#13111a';
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', color);
  }, [theme]);

  return (
    <>
      {/* Fixed header — height = safe-area-inset-top + 3.5rem (h-14) */}
      <header
        className={`fixed top-0 inset-x-0 z-30 transition-colors duration-200 ${
          isOpen ? 'bg-background border-b border-cardborder' : ''
        }`}
      >
        {/*
         * Always-visible notch / status-bar fill.
         * Sits at the very top; height = env(safe-area-inset-top).
         * On Chrome (no notch) this collapses to 0 and is invisible.
         */}
        <div className="bg-background h-[var(--sat)]" />
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Open menu"
          aria-expanded={isOpen}
          className="flex items-center justify-center w-14 h-14 text-primary hover:opacity-70 transition-opacity"
        >
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200 ${
              !isOpen ? 'bg-background/60 backdrop-blur-md shadow-sm' : ''
            }`}
          >
            <HamburgerIcon />
          </span>
        </button>
      </header>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            data-testid="backdrop"
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-cardbg shadow-2xl flex flex-col">
            {/* Header — X button aligned with hamburger; safe-area pushes both down equally */}
            <div className="flex items-center border-b border-cardborder shrink-0 pt-[var(--sat)]">
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="flex items-center justify-center w-14 h-14 text-primary hover:opacity-70 transition-opacity"
              >
                <XIcon />
              </button>
              <span className="text-primary text-xs font-semibold tracking-widest uppercase opacity-50">
                {t.menuTitle}
              </span>
            </div>

            {/* Menu items */}
            <nav className="flex flex-col flex-1 overflow-y-auto py-2">
              {/* Language */}
              <button
                onClick={toggleLang}
                aria-label="Toggle language"
                className="flex items-center justify-between px-5 py-4 text-primary hover:bg-background transition-colors"
              >
                <span className="text-sm">{t.menuLanguage}</span>
                <span className="text-sm font-semibold">
                  {lang.toUpperCase()}
                </span>
              </button>

              {/* Dark / Light mode */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                role="switch"
                aria-checked={theme === 'dark'}
                className="flex items-center justify-between px-5 py-4 text-primary hover:bg-background transition-colors"
              >
                <span className="text-sm">{t.menuTheme}</span>
                {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
              </button>

              {/* Logout */}
              {pathname !== '/login' && (
                <>
                  <div className="my-1 border-t border-cardborder" />
                  <a
                    href="/api/auth/logout"
                    aria-label="Logout"
                    className="flex items-center justify-between px-5 py-4 text-primary hover:text-skyblue transition-colors"
                  >
                    <span className="text-sm">{t.menuLogout}</span>
                    <LogoutIcon />
                  </a>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
