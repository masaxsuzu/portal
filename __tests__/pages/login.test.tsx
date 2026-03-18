import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from '../../app/login/page';
import { AppProvider } from '../../contexts/AppContext';

let mockErrorCode: string | null = null;

jest.mock('next/navigation', () => ({
  useSearchParams: () =>
    new URLSearchParams(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      mockErrorCode ? `error=${mockErrorCode}` : ''
    ),
}));

describe('LoginPage', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear();
    mockErrorCode = null;
  });

  afterEach(() => {
    document.body.removeChild(container);
    localStorage.clear();
    mockErrorCode = null;
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

  it('renders GitHub login link pointing to /api/auth/github', () => {
    const root = renderLogin();

    const link = container.querySelector('a[href="/api/auth/github"]');
    expect(link).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('renders the GitHub SVG icon inside the login link', () => {
    const root = renderLogin();

    const link = container.querySelector('a[href="/api/auth/github"]');
    expect(link?.querySelector('svg')).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('renders heading and subtext', () => {
    const root = renderLogin();

    expect(container.querySelector('h1')?.textContent).toBeTruthy();
    expect(container.querySelector('p')?.textContent).toBeTruthy();

    act(() => {
      root.unmount();
    });
  });

  it('does not render a password input', () => {
    const root = renderLogin();

    expect(container.querySelector('input[type="password"]')).toBeNull();

    act(() => {
      root.unmount();
    });
  });

  describe('OAuth error messages', () => {
    const errorCodes = [
      'missing_code',
      'not_configured',
      'token_failed',
      'user_failed',
      'access_denied',
    ];

    it.each(errorCodes)('shows error message for ?error=%s', (errorCode) => {
      mockErrorCode = errorCode;
      const root = renderLogin();
      expect(container.querySelector('p.text-red-400')).not.toBeNull();
      act(() => root.unmount());
    });

    it('shows no error message when error param is absent', () => {
      const root = renderLogin();
      expect(container.querySelector('p.text-red-400')).toBeNull();
      act(() => root.unmount());
    });
  });
});
