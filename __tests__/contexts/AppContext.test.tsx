/**
 * Unit tests: AppContext
 * Verifies theme/lang state management, localStorage persistence, and DOM side effects.
 */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider, useAppContext } from '../../contexts/AppContext';

function Consumer({
  onRender,
}: {
  onRender: (ctx: ReturnType<typeof useAppContext>) => void;
}) {
  const ctx = useAppContext();
  onRender(ctx);
  return null;
}

function renderProvider(onRender: (ctx: ReturnType<typeof useAppContext>) => void) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <AppProvider>
        <Consumer onRender={onRender} />
      </AppProvider>
    );
  });
  return { container, root };
}

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  describe('theme', () => {
    it('defaults to dark when no localStorage value', () => {
      let ctx!: ReturnType<typeof useAppContext>;
      const { root, container } = renderProvider((c) => (ctx = c));
      expect(ctx.theme).toBe('dark');
      act(() => root.unmount());
      document.body.removeChild(container);
    });

    it('restores theme from localStorage', () => {
      localStorage.setItem('theme', 'light');
      let ctx!: ReturnType<typeof useAppContext>;
      const { root, container } = renderProvider((c) => (ctx = c));
      expect(ctx.theme).toBe('light');
      act(() => root.unmount());
      document.body.removeChild(container);
    });

    it('adds dark class to documentElement in dark mode', () => {
      const { root, container } = renderProvider(() => {});
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      act(() => root.unmount());
      document.body.removeChild(container);
    });

    it('toggleTheme switches to light and updates DOM and localStorage', () => {
      let ctx!: ReturnType<typeof useAppContext>;
      const { root, container } = renderProvider((c) => (ctx = c));
      act(() => ctx.toggleTheme());
      expect(ctx.theme).toBe('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem('theme')).toBe('light');
      act(() => root.unmount());
      document.body.removeChild(container);
    });

    it('toggleTheme twice returns to dark', () => {
      let ctx!: ReturnType<typeof useAppContext>;
      const { root, container } = renderProvider((c) => (ctx = c));
      act(() => ctx.toggleTheme());
      act(() => ctx.toggleTheme());
      expect(ctx.theme).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
      act(() => root.unmount());
      document.body.removeChild(container);
    });
  });

  describe('lang', () => {
    it('defaults to en when no localStorage value', () => {
      let ctx!: ReturnType<typeof useAppContext>;
      const { root, container } = renderProvider((c) => (ctx = c));
      expect(ctx.lang).toBe('en');
      act(() => root.unmount());
      document.body.removeChild(container);
    });

    it('restores lang from localStorage', () => {
      localStorage.setItem('lang', 'ja');
      let ctx!: ReturnType<typeof useAppContext>;
      const { root, container } = renderProvider((c) => (ctx = c));
      expect(ctx.lang).toBe('ja');
      act(() => root.unmount());
      document.body.removeChild(container);
    });

    it('toggleLang switches to ja and persists to localStorage', () => {
      let ctx!: ReturnType<typeof useAppContext>;
      const { root, container } = renderProvider((c) => (ctx = c));
      act(() => ctx.toggleLang());
      expect(ctx.lang).toBe('ja');
      expect(localStorage.getItem('lang')).toBe('ja');
      act(() => root.unmount());
      document.body.removeChild(container);
    });

    it('toggleLang twice returns to en', () => {
      let ctx!: ReturnType<typeof useAppContext>;
      const { root, container } = renderProvider((c) => (ctx = c));
      act(() => ctx.toggleLang());
      act(() => ctx.toggleLang());
      expect(ctx.lang).toBe('en');
      expect(localStorage.getItem('lang')).toBe('en');
      act(() => root.unmount());
      document.body.removeChild(container);
    });

    it('t reflects the active language translations', () => {
      let ctx!: ReturnType<typeof useAppContext>;
      const { root, container } = renderProvider((c) => (ctx = c));
      expect(ctx.t.loginTitle).toBe('Welcome');
      act(() => ctx.toggleLang());
      expect(ctx.t.loginTitle).toBe('ようこそ');
      act(() => root.unmount());
      document.body.removeChild(container);
    });
  });
});
