/**
 * Integration tests: HomePage + AppContext (real, not mocked)
 * Verifies that language/theme switching updates the main page UI correctly.
 */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from '../../app/page';
import { AppProvider } from '../../contexts/AppContext';

describe('HomePage i18n integration', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear();
  });

  afterEach(() => {
    document.body.removeChild(container);
    localStorage.clear();
  });

  function renderHome() {
    const root = createRoot(container);
    act(() => {
      root.render(
        <AppProvider>
          <HomePage />
        </AppProvider>
      );
    });
    return root;
  }

  function openMenu() {
    const hamburger = container.querySelector(
      '[aria-label="Open menu"]'
    ) as HTMLButtonElement;
    act(() => {
      hamburger.click();
    });
  }

  it('renders English bio and section titles by default', () => {
    const root = renderHome();

    expect(container.textContent).toContain(
      'Software Engineer | C# | Fitness enthusiast'
    );
    expect(container.textContent).toContain('About Me');
    expect(container.textContent).toContain('Public Content');

    act(() => root.unmount());
  });

  it('renders Japanese bio and section titles when lang=ja is stored', () => {
    localStorage.setItem('lang', 'ja');
    const root = renderHome();

    expect(container.textContent).toContain(
      'ソフトウェアエンジニア | C# | フィットネス愛好家'
    );
    expect(container.textContent).toContain('自己紹介');
    expect(container.textContent).toContain('公開コンテンツ');

    act(() => root.unmount());
  });

  it('updates main page text when language is toggled', () => {
    const root = renderHome();

    expect(container.textContent).toContain('About Me');

    openMenu();

    const langBtn = container.querySelector(
      '[aria-label="Toggle language"]'
    ) as HTMLButtonElement;
    act(() => langBtn.click());

    expect(container.textContent).toContain('自己紹介');
    expect(container.textContent).toContain(
      'ソフトウェアエンジニア | C# | フィットネス愛好家'
    );

    act(() => langBtn.click());

    expect(container.textContent).toContain('About Me');
    expect(container.textContent).toContain(
      'Software Engineer | C# | Fitness enthusiast'
    );

    act(() => root.unmount());
  });

  it('always renders masaxsuzu name regardless of language', () => {
    const root = renderHome();
    expect(container.textContent).toContain('masaxsuzu');

    openMenu();

    const langBtn = container.querySelector(
      '[aria-label="Toggle language"]'
    ) as HTMLButtonElement;
    act(() => langBtn.click());

    expect(container.textContent).toContain('masaxsuzu');

    act(() => root.unmount());
  });

  it('defaults to ja when navigator.language is Japanese and no localStorage', () => {
    const original = navigator.language;
    Object.defineProperty(navigator, 'language', {
      value: 'ja-JP',
      configurable: true,
    });
    const root = renderHome();

    expect(container.textContent).toContain('自己紹介');

    act(() => root.unmount());
    Object.defineProperty(navigator, 'language', {
      value: original,
      configurable: true,
    });
  });

  it('restores light theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'light');
    const root = renderHome();

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => root.unmount());
  });

  it('toggles to light theme and updates documentElement class', () => {
    const root = renderHome();

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    openMenu();

    const themeBtn = container.querySelector(
      '[aria-label="Toggle theme"]'
    ) as HTMLButtonElement;
    act(() => themeBtn.click());

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');

    act(() => root.unmount());
  });

  it('toggles theme back to dark', () => {
    const root = renderHome();

    openMenu();

    const themeBtn = container.querySelector(
      '[aria-label="Toggle theme"]'
    ) as HTMLButtonElement;
    act(() => themeBtn.click());
    act(() => themeBtn.click());

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    act(() => root.unmount());
  });
});
