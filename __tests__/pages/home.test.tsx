import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from '../../app/page';
import { AppProvider } from '../../contexts/AppContext';

describe('HomePage', () => {
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

  function renderHome() {
    const root = createRoot(container);
    act(() => {
      root.render(
        <AppProvider>
          <HomePage />
        </AppProvider>
      );
    });
    return root;
  }

  it('renders masaxsuzu name', () => {
    const root = renderHome();
    expect(container.textContent).toContain('masaxsuzu');
    act(() => root.unmount());
  });

  it('renders About section heading', () => {
    const root = renderHome();
    const headings = Array.from(container.querySelectorAll('h2')).map(
      (h) => h.textContent
    );
    expect(headings).toContain('About Me');
    act(() => root.unmount());
  });

  it('renders Cards section heading', () => {
    const root = renderHome();
    const headings = Array.from(container.querySelectorAll('h2')).map(
      (h) => h.textContent
    );
    expect(headings).toContain('Public Content');
    act(() => root.unmount());
  });

  it('renders Skills section heading', () => {
    const root = renderHome();
    const headings = Array.from(container.querySelectorAll('h2')).map(
      (h) => h.textContent
    );
    expect(headings).toContain('Skills');
    act(() => root.unmount());
  });

  it('renders Timeline section heading', () => {
    const root = renderHome();
    const headings = Array.from(container.querySelectorAll('h2')).map(
      (h) => h.textContent
    );
    expect(headings).toContain('Career');
    act(() => root.unmount());
  });

  it('renders all 4 cards from data.json', () => {
    const root = renderHome();
    const links = container.querySelectorAll(
      'a[href^="https://github.com/masaxsuzu"]'
    );
    expect(links).toHaveLength(4);
    act(() => root.unmount());
  });

  it('renders card titles from data.json', () => {
    const root = renderHome();
    expect(container.textContent).toContain('skyla');
    expect(container.textContent).toContain('c2');
    expect(container.textContent).toContain('c3');
    expect(container.textContent).toContain('hand-simulator');
    act(() => root.unmount());
  });

  it('does not render Controls (moved to layout)', () => {
    const root = renderHome();
    // Controls is now rendered in layout.tsx, not in HomePage directly
    expect(container.querySelector('[aria-label="Open menu"]')).toBeNull();
    act(() => root.unmount());
  });
});
