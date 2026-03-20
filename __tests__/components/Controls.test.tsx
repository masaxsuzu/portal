import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Controls from '../../components/Controls';

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
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders both toggle buttons', () => {
    useAppContext.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      lang: 'en',
      toggleLang: mockToggleLang,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);

    act(() => {
      root.unmount();
    });
  });

  it('shows JA button when lang is en', () => {
    useAppContext.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      lang: 'en',
      toggleLang: mockToggleLang,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    const langButton = container.querySelector(
      '[aria-label="Toggle language"]'
    );
    expect(langButton?.textContent).toBe('JA');

    act(() => {
      root.unmount();
    });
  });

  it('shows EN button when lang is ja', () => {
    useAppContext.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      lang: 'ja',
      toggleLang: mockToggleLang,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    const langButton = container.querySelector(
      '[aria-label="Toggle language"]'
    );
    expect(langButton?.textContent).toBe('EN');

    act(() => {
      root.unmount();
    });
  });

  it('renders sun icon in dark mode', () => {
    useAppContext.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      lang: 'en',
      toggleLang: mockToggleLang,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    const themeButton = container.querySelector('[aria-label="Toggle theme"]');
    const icon = themeButton?.querySelector('svg');
    expect(icon).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('renders moon icon in light mode', () => {
    useAppContext.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      lang: 'en',
      toggleLang: mockToggleLang,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    const themeButton = container.querySelector('[aria-label="Toggle theme"]');
    const icon = themeButton?.querySelector('svg');
    expect(icon).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('calls toggleLang when lang button is clicked', () => {
    useAppContext.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      lang: 'en',
      toggleLang: mockToggleLang,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

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

  it('shows logout link when not on /login', () => {
    usePathname.mockReturnValue('/');
    useAppContext.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      lang: 'en',
      toggleLang: mockToggleLang,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    expect(container.querySelector('a[aria-label="Logout"]')).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('hides logout link on /login', () => {
    usePathname.mockReturnValue('/login');
    useAppContext.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      lang: 'en',
      toggleLang: mockToggleLang,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

    expect(container.querySelector('a[aria-label="Logout"]')).toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('calls toggleTheme when theme button is clicked', () => {
    useAppContext.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      lang: 'en',
      toggleLang: mockToggleLang,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<Controls />);
    });

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
});
