/**
 * Integration tests: LoginPage + AppContext (real, not mocked)
 * Verifies that language switching actually updates the login UI.
 */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from '../../pages/login';
import { AppProvider } from '../../contexts/AppContext';

describe('LoginPage i18n integration', () => {
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

  function renderLogin() {
    const root = createRoot(container);
    act(() => {
      root.render(
        <AppProvider>
          <LoginPage />
        </AppProvider>
      );
    });
    return root;
  }

  it('renders English text by default', () => {
    const root = renderLogin();

    expect(container.querySelector('h1')?.textContent).toBe('Welcome');
    expect(container.querySelector('p')?.textContent).toBe(
      "masaxsuzu's private portfolio"
    );
    expect(
      container.querySelector('a[href="/api/auth/github"]')
    ).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('renders Japanese text when lang=ja is stored in localStorage', () => {
    localStorage.setItem('lang', 'ja');
    const root = renderLogin();

    expect(container.querySelector('h1')?.textContent).toBe('ようこそ');
    expect(container.querySelector('p')?.textContent).toBe(
      'masaxsuzu のプライベートポートフォリオです'
    );
    expect(
      container.querySelector('a[href="/api/auth/github"]')
    ).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('updates heading when language is toggled via Controls', () => {
    const root = renderLogin();

    // Starts in English
    expect(container.querySelector('h1')?.textContent).toBe('Welcome');

    // Click language toggle
    const langBtn = container.querySelector(
      '[aria-label="Toggle language"]'
    ) as HTMLButtonElement;
    act(() => {
      langBtn.click();
    });

    // Now Japanese
    expect(container.querySelector('h1')?.textContent).toBe('ようこそ');

    // Toggle back to English
    act(() => {
      langBtn.click();
    });

    expect(container.querySelector('h1')?.textContent).toBe('Welcome');

    act(() => {
      root.unmount();
    });
  });

  it('persists language choice to localStorage after toggle', () => {
    const root = renderLogin();

    const langBtn = container.querySelector(
      '[aria-label="Toggle language"]'
    ) as HTMLButtonElement;
    act(() => {
      langBtn.click();
    });

    expect(localStorage.getItem('lang')).toBe('ja');

    act(() => {
      root.unmount();
    });
  });
});
