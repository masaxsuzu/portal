'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../contexts/AppContext';

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

export default function Controls() {
  const { theme, toggleTheme, lang, toggleLang } = useAppContext();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        className="fixed top-4 left-4 z-50 bg-cardbg border border-cardborder text-primary w-9 h-9 rounded-lg flex items-center justify-center hover:border-skyblue transition-colors"
      >
        <HamburgerIcon />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-60 bg-cardbg shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cardborder">
              <span className="text-primary text-sm font-semibold tracking-wide uppercase opacity-60">
                Menu
              </span>
            </div>

            {/* Menu items */}
            <nav className="flex flex-col py-2">
              {/* Language */}
              <button
                onClick={toggleLang}
                aria-label="Toggle language"
                className="flex items-center justify-between px-5 py-3.5 text-primary hover:bg-background transition-colors"
              >
                <span className="text-sm">Language</span>
                <span className="text-sm font-semibold">
                  {lang.toUpperCase()}
                </span>
              </button>

              {/* Dark mode */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                role="switch"
                aria-checked={theme === 'dark'}
                className="flex items-center justify-between px-5 py-3.5 text-primary hover:bg-background transition-colors"
              >
                <span className="text-sm">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
                {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
              </button>

              {/* Logout */}
              {pathname !== '/login' && (
                <>
                  <div className="my-1 border-t border-cardborder" />
                  <a
                    href="/api/auth/logout"
                    aria-label="Logout"
                    className="flex items-center justify-between px-5 py-3.5 text-primary hover:text-skyblue transition-colors"
                  >
                    <span className="text-sm">Logout</span>
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
