import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from '../../pages/login';
import { AppProvider } from '../../contexts/AppContext';

jest.mock('next/router', () => ({
  useRouter: () => ({ query: {} }),
}));

describe('LoginPage', () => {
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
});
