'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../contexts/AppContext';

export default function SessionLock() {
  const [locked, setLocked] = useState(false);
  const router = useRouter();
  const { t } = useAppContext();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data: { expiresIn: number }) => {
        const ms = data.expiresIn * 1000;
        if (ms <= 0) {
          setLocked(true);
          return;
        }
        timeoutId = setTimeout(() => setLocked(true), ms);
      })
      .catch(() => {});

    return () => clearTimeout(timeoutId);
  }, []);

  if (!locked) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-cardbg border border-cardborder rounded-lg p-8 max-w-sm w-full shadow-xl text-center">
        <h2 className="text-primary text-xl font-semibold mb-3">
          {t.sessionExpiredTitle}
        </h2>
        <p className="text-primary/60 text-sm mb-6">{t.sessionExpiredMessage}</p>
        <button
          onClick={() => router.push('/login?error=session_expired')}
          className="w-full py-3 rounded bg-skyblue text-background font-semibold hover:opacity-90 transition-opacity"
        >
          {t.sessionExpiredButton}
        </button>
      </div>
    </div>
  );
}
