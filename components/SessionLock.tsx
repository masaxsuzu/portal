'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const REDIRECT_SECONDS = 10;

function getSessionExpires(): number | null {
  const match = document.cookie.match(/(?:^|;\s*)session_expires=(\d+)/);
  return match ? Number(match[1]) : null;
}

export default function SessionLock() {
  const [locked, setLocked] = useState(false);
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
  const { t } = useAppContext();

  useEffect(() => {
    const id = setInterval(() => {
      const expires = getSessionExpires();
      if (expires !== null && Math.floor(Date.now() / 1000) >= expires) {
        setLocked(true);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(id);
          window.location.assign('/login?error=session_expired');
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [locked]);

  if (!locked) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-cardbg border border-cardborder rounded-lg p-8 max-w-sm w-full shadow-xl text-center">
        <h2 className="text-primary text-xl font-semibold mb-3">
          {t.sessionExpiredTitle}
        </h2>
        <p className="text-primary/60 text-sm mb-4">{t.sessionExpiredMessage}</p>
        <p className="text-primary/40 text-xs">
          {t.sessionExpiredCountdown.replace('{n}', String(countdown))}
        </p>
      </div>
    </div>
  );
}
