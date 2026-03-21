'use client';

import { useState } from 'react';
import Controls from './Controls';

export default function ShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-x-hidden flex flex-col flex-1">
      <Controls isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Content area — pushed right when menu opens */}
      <main
        className={`flex flex-col flex-1 pt-14 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-60 shadow-[-20px_0_48px_rgba(0,0,0,0.25)]' : ''
        }`}
        onClick={() => {
          if (isOpen) setIsOpen(false);
        }}
      >
        {children}
      </main>
    </div>
  );
}
