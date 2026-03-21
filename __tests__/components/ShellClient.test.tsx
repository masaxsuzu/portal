import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ShellClient from '../../components/ShellClient';

jest.mock('../../components/Controls', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return function MockControls({
    isOpen,
    setIsOpen,
  }: {
    isOpen: boolean;
    setIsOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  }) {
    return (
      <div data-testid="controls" data-open={String(isOpen)}>
        <button
          aria-label="Open menu"
          onClick={() => setIsOpen((prev: boolean) => !prev)}
        />
      </div>
    );
  };
});

describe('ShellClient', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders Controls and children', () => {
    const root = createRoot(container);
    act(() => {
      root.render(
        <ShellClient>
          <p data-testid="child">content</p>
        </ShellClient>
      );
    });

    expect(container.querySelector('[data-testid="controls"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="child"]')).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });

  it('passes isOpen=false to Controls by default', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<ShellClient>content</ShellClient>);
    });

    expect(
      container
        .querySelector('[data-testid="controls"]')
        ?.getAttribute('data-open')
    ).toBe('false');

    act(() => {
      root.unmount();
    });
  });

  it('passes isOpen=true to Controls after hamburger click', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<ShellClient>content</ShellClient>);
    });

    act(() => {
      (
        container.querySelector('[aria-label="Open menu"]') as HTMLButtonElement
      ).click();
    });

    expect(
      container
        .querySelector('[data-testid="controls"]')
        ?.getAttribute('data-open')
    ).toBe('true');

    act(() => {
      root.unmount();
    });
  });

  it('main has translate-x-60 class when menu is open', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<ShellClient>content</ShellClient>);
    });

    act(() => {
      (
        container.querySelector('[aria-label="Open menu"]') as HTMLButtonElement
      ).click();
    });

    const main = container.querySelector('main');
    expect(main?.className).toContain('translate-x-60');

    act(() => {
      root.unmount();
    });
  });

  it('clicking main when closed does not change state', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<ShellClient>content</ShellClient>);
    });

    act(() => {
      (container.querySelector('main') as HTMLElement).click();
    });

    expect(
      container
        .querySelector('[data-testid="controls"]')
        ?.getAttribute('data-open')
    ).toBe('false');

    act(() => {
      root.unmount();
    });
  });

  it('clicking main closes the menu', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<ShellClient>content</ShellClient>);
    });

    // open
    act(() => {
      (
        container.querySelector('[aria-label="Open menu"]') as HTMLButtonElement
      ).click();
    });
    expect(
      container
        .querySelector('[data-testid="controls"]')
        ?.getAttribute('data-open')
    ).toBe('true');

    // click main to close
    act(() => {
      (container.querySelector('main') as HTMLElement).click();
    });
    expect(
      container
        .querySelector('[data-testid="controls"]')
        ?.getAttribute('data-open')
    ).toBe('false');

    act(() => {
      root.unmount();
    });
  });
});
