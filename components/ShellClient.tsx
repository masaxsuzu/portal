'use client';

import { useState, useEffect } from 'react';
import Controls from './Controls';

export default function ShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll while the menu is open (JS required — no pure-CSS way)
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col flex-1">
      <Controls isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* pt = h-14 (3.5rem) + safe-area-inset-top */}
      <main className="flex flex-col flex-1 pt-header-sat">
        {children}
      </main>
    </div>
  );
}
