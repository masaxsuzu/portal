import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from '../../app/login/page';
import { AppProvider } from '../../contexts/AppContext';

let mockErrorCode: string | null = null;

jest.mock('next/navigation', () => ({
  useSearchParams: () =>
    new URLSearchParams(mockErrorCode ? `error=${mockErrorCode}` : ''),
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

  it('renders bypass login link when bypassMode is true', () => {
    process.env.AUTH_BYPASS_USER = 'preview-user';
    const root = renderLogin();

    const link = container.querySelector('a[href="/api/auth/bypass"]');
    expect(link).not.toBeNull();
    expect(container.querySelector('a[href="/api/auth/github"]')).toBeNull();

    act(() => {
      root.unmount();
    });
    delete process.env.AUTH_BYPASS_USER;
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
    const errorCases: [string, string][] = [
      ['missing_code', 'OAuth error: missing code'],
      ['not_configured', 'OAuth error: server not configured'],
      ['token_failed', 'OAuth error: failed to get access token'],
      ['user_failed', 'OAuth error: failed to get user info'],
      ['access_denied', 'Access denied'],
    ];

    it.each(errorCases)(
      'shows correct error message for ?error=%s',
      (errorCode, expectedMessage) => {
        mockErrorCode = errorCode;
        const root = renderLogin();
        const errorEl = container.querySelector('p.text-red-400');
        expect(errorEl).not.toBeNull();
        expect(errorEl?.textContent).toBe(expectedMessage);
        act(() => root.unmount());
      }
    );

    it('shows no error message when error param is absent', () => {
      const root = renderLogin();
      expect(container.querySelector('p.text-red-400')).toBeNull();
      act(() => root.unmount());
    });
  });
});
