import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Controls from '../../components/Controls';
import { translations } from '../../lib/i18n';

const mockToggleTheme = jest.fn();
const mockToggleLang = jest.fn();

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { usePathname } = require('next/navigation');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useAppContext } = require('../../contexts/AppContext');

describe('Controls Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    mockToggleTheme.mockClear();
    mockToggleLang.mockClear();
    useAppContext.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      lang: 'en',
      toggleLang: mockToggleLang,
      t: translations.en,
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const openMenu = () => {
    const hamburger = container.querySelector(
      '[aria-label="Open menu"]'
    ) as HTMLButtonElement;
    act(() => {
      hamburger.click();
    });
  };

  it('renders hamburger button', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    expect(container.querySelector('[aria-label="Open menu"]')).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('menu is closed by default', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    expect(
      container.querySelector('[aria-label="Toggle language"]')
    ).toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('opens menu when hamburger is clicked', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();

    expect(
      container.querySelector('[aria-label="Toggle language"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[aria-label="Toggle theme"]')
    ).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('shows EN when lang is en', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();

    const langButton = container.querySelector(
      '[aria-label="Toggle language"]'
    );
    expect(langButton?.textContent).toContain('EN');

    act(() => {
      root.unmount();
    });
  });

  it('shows JA when lang is ja', () => {
    useAppContext.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      lang: 'ja',
      toggleLang: mockToggleLang,
      t: translations.ja,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();

    const langButton = container.querySelector(
      '[aria-label="Toggle language"]'
    );
    expect(langButton?.textContent).toContain('JA');

    act(() => {
      root.unmount();
    });
  });

  it('renders theme toggle with switch role in dark mode', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();

    const themeButton = container.querySelector('[aria-label="Toggle theme"]');
    expect(themeButton?.getAttribute('role')).toBe('switch');
    expect(themeButton?.getAttribute('aria-checked')).toBe('true');

    act(() => {
      root.unmount();
    });
  });

  it('renders theme toggle as unchecked in light mode', () => {
    useAppContext.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      lang: 'en',
      toggleLang: mockToggleLang,
      t: translations.en,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();

    const themeButton = container.querySelector('[aria-label="Toggle theme"]');
    expect(themeButton?.getAttribute('aria-checked')).toBe('false');

    act(() => {
      root.unmount();
    });
  });

  it('calls toggleLang when lang button is clicked', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();

    const langButton = container.querySelector(
      '[aria-label="Toggle language"]'
    ) as HTMLButtonElement;
    act(() => {
      langButton.click();
    });

    expect(mockToggleLang).toHaveBeenCalledTimes(1);

    act(() => {
      root.unmount();
    });
  });

  it('calls toggleTheme when theme button is clicked', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();

    const themeButton = container.querySelector(
      '[aria-label="Toggle theme"]'
    ) as HTMLButtonElement;
    act(() => {
      themeButton.click();
    });

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);

    act(() => {
      root.unmount();
    });
  });

  it('shows logout link when not on /login', () => {
    usePathname.mockReturnValue('/');

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();

    expect(container.querySelector('a[aria-label="Logout"]')).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('hides logout link on /login', () => {
    usePathname.mockReturnValue('/login');

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();

    expect(container.querySelector('a[aria-label="Logout"]')).toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('closes menu when backdrop is clicked', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();
    expect(
      container.querySelector('[aria-label="Toggle language"]')
    ).not.toBeNull();

    act(() => {
      (
        container.querySelector('[data-testid="backdrop"]') as HTMLDivElement
      ).click();
    });

    expect(
      container.querySelector('[aria-label="Toggle language"]')
    ).toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('closes menu when X button is clicked', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();
    expect(
      container.querySelector('[aria-label="Toggle language"]')
    ).not.toBeNull();

    act(() => {
      (
        container.querySelector('[aria-label="Close menu"]') as HTMLButtonElement
      ).click();
    });

    expect(
      container.querySelector('[aria-label="Toggle language"]')
    ).toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('closes menu when hamburger is clicked again', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    openMenu();
    expect(
      container.querySelector('[aria-label="Toggle language"]')
    ).not.toBeNull();

    // click again to close
    const hamburger = container.querySelector(
      '[aria-label="Open menu"]'
    ) as HTMLButtonElement;
    act(() => {
      hamburger.click();
    });

    expect(
      container.querySelector('[aria-label="Toggle language"]')
    ).toBeNull();

    act(() => {
      root.unmount();
    });
  });
});
