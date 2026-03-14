/**
 * Integration tests: LoginPage + AppContext (real, not mocked)
 * Verifies that language switching actually updates the login UI.
 */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from '../../pages/login';
import { AppProvider } from '../../contexts/AppContext';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: jest.fn(),
  }),
}));

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

    expect(container.querySelector('h1')?.textContent).toBe('Login');
    expect(
      container
        .querySelector('input[type="password"]')
        ?.getAttribute('placeholder')
    ).toBe('Password');
    expect(container.querySelector('button[type="submit"]')?.textContent).toBe(
      'Login'
    );

    act(() => {
      root.unmount();
    });
  });

  it('renders Japanese text when lang=ja is stored in localStorage', () => {
    localStorage.setItem('lang', 'ja');
    const root = renderLogin();

    expect(container.querySelector('h1')?.textContent).toBe('ログイン');
    expect(
      container
        .querySelector('input[type="password"]')
        ?.getAttribute('placeholder')
    ).toBe('パスワード');
    expect(container.querySelector('button[type="submit"]')?.textContent).toBe(
      'ログイン'
    );

    act(() => {
      root.unmount();
    });
  });

  it('updates login text when language is toggled via Controls', () => {
    const root = renderLogin();

    // Starts in English
    expect(container.querySelector('h1')?.textContent).toBe('Login');

    // Click language toggle (shows "JA" when current lang is "en")
    const langBtn = container.querySelector(
      '[aria-label="Toggle language"]'
    ) as HTMLButtonElement;
    act(() => {
      langBtn.click();
    });

    // Now Japanese
    expect(container.querySelector('h1')?.textContent).toBe('ログイン');
    expect(
      container
        .querySelector('input[type="password"]')
        ?.getAttribute('placeholder')
    ).toBe('パスワード');

    // Toggle back to English
    act(() => {
      langBtn.click();
    });

    expect(container.querySelector('h1')?.textContent).toBe('Login');

    act(() => {
      root.unmount();
    });
  });

  it('shows English error message after failed login (default lang)', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const root = renderLogin();

    const form = container.querySelector('form') as HTMLFormElement;
    await act(async () => {
      form.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });

    const errorEl = container.querySelector('p');
    expect(errorEl?.textContent).toBe('Password is incorrect');

    act(() => {
      root.unmount();
    });
  });

  it('shows Japanese error message after failed login when lang=ja', async () => {
    localStorage.setItem('lang', 'ja');
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const root = renderLogin();

    const form = container.querySelector('form') as HTMLFormElement;
    await act(async () => {
      form.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });

    const errorEl = container.querySelector('p');
    expect(errorEl?.textContent).toBe('パスワードが正しくありません');

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
