'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

function getSessionExpires(): number | null {
  const match = document.cookie.match(/(?:^|;\s*)session_expires=(\d+)/);
  return match ? Number(match[1]) : null;
}

export default function SessionLock() {
  const [locked, setLocked] = useState(false);
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
    const id = setTimeout(() => {
      window.location.assign('/login?error=session_expired');
    }, 3000);
    return () => clearTimeout(id);
  }, [locked]);

  if (!locked) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-cardbg border border-cardborder rounded-lg p-8 max-w-sm w-full shadow-xl text-center">
        <h2 className="text-primary text-xl font-semibold mb-3">
          {t.sessionExpiredTitle}
        </h2>
        <p className="text-primary/60 text-sm">{t.sessionExpiredMessage}</p>
      </div>
    </div>
  );
}
