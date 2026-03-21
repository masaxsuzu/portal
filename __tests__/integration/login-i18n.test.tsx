/**
 * Integration tests: LoginPage + AppContext (real, not mocked)
 * Verifies that language switching actually updates the login UI.
 */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from '../../app/login/page';
import Controls from '../../components/Controls';
import { AppProvider } from '../../contexts/AppContext';

let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: jest.fn(() => '/login'),
}));

describe('LoginPage i18n integration', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear();
    mockSearchParams = new URLSearchParams();
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
          <Controls />
          <LoginPage />
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

    // Open menu then click language toggle
    openMenu();
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

  it('shows localized error message in English for access_denied', () => {
    mockSearchParams = new URLSearchParams('error=access_denied');
    const root = renderLogin();

    expect(container.querySelector('p.text-red-400')?.textContent).toBe(
      'Access denied'
    );

    act(() => {
      root.unmount();
    });
  });

  it('shows localized error message in Japanese when lang=ja', () => {
    localStorage.setItem('lang', 'ja');
    mockSearchParams = new URLSearchParams('error=access_denied');
    const root = renderLogin();

    expect(container.querySelector('p.text-red-400')?.textContent).toBe(
      'アクセスが拒否されました'
    );

    act(() => {
      root.unmount();
    });
  });

  it('persists language choice to localStorage after toggle', () => {
    const root = renderLogin();

    openMenu();
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
