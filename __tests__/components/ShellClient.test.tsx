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
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.style.overflow = '';
  });

  const openMenu = (root: ReturnType<typeof createRoot>) => {
    void root;
    act(() => {
      (
        container.querySelector('[aria-label="Open menu"]') as HTMLButtonElement
      ).click();
    });
  };

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

    openMenu(root);

    expect(
      container
        .querySelector('[data-testid="controls"]')
        ?.getAttribute('data-open')
    ).toBe('true');

    act(() => {
      root.unmount();
    });
  });

  it('locks body scroll when menu opens', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<ShellClient>content</ShellClient>);
    });

    openMenu(root);
    expect(document.body.style.overflow).toBe('hidden');

    act(() => {
      root.unmount();
    });
  });

  it('restores body scroll when menu closes', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<ShellClient>content</ShellClient>);
    });

    openMenu(root);
    expect(document.body.style.overflow).toBe('hidden');

    // close via toggle
    act(() => {
      (
        container.querySelector('[aria-label="Open menu"]') as HTMLButtonElement
      ).click();
    });
    expect(document.body.style.overflow).toBe('');

    act(() => {
      root.unmount();
    });
  });

  it('restores body scroll on unmount', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<ShellClient>content</ShellClient>);
    });

    openMenu(root);
    expect(document.body.style.overflow).toBe('hidden');

    act(() => {
      root.unmount();
    });
    expect(document.body.style.overflow).toBe('');
  });
});
