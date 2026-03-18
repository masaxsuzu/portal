/**
 * Integration tests: HomePage + AppContext (real, not mocked)
 * Verifies that language switching updates the main page UI correctly.
 */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from '../../app/page';
import { AppProvider, useAppContext } from '../../contexts/AppContext';

// Controls uses FontAwesome icons — stub it out to avoid icon rendering issues
jest.mock('../../components/Controls', () => () => {
  const { useAppContext: useCtx } = require('../../contexts/AppContext');
  const { toggleLang, toggleTheme } = useCtx();
  return (
    <>
      <button aria-label="Toggle language" onClick={toggleLang} />
      <button aria-label="Toggle theme" onClick={toggleTheme} />
    </>
  );
});

describe('HomePage i18n integration', () => {
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

  it('renders English bio and section titles by default', () => {
    const root = renderHome();

    expect(container.textContent).toContain('Software Engineer | C# | Fitness enthusiast');
    expect(container.textContent).toContain('About Me');
    expect(container.textContent).toContain('Public Content');

    act(() => root.unmount());
  });

  it('renders Japanese bio and section titles when lang=ja is stored', () => {
    localStorage.setItem('lang', 'ja');
    const root = renderHome();

    expect(container.textContent).toContain('ソフトウェアエンジニア | C# | フィットネス愛好家');
    expect(container.textContent).toContain('自己紹介');
    expect(container.textContent).toContain('公開コンテンツ');

    act(() => root.unmount());
  });

  it('updates main page text when language is toggled', () => {
    const root = renderHome();

    expect(container.textContent).toContain('About Me');

    const langBtn = container.querySelector('[aria-label="Toggle language"]') as HTMLButtonElement;
    act(() => langBtn.click());

    expect(container.textContent).toContain('自己紹介');
    expect(container.textContent).toContain('ソフトウェアエンジニア | C# | フィットネス愛好家');

    act(() => langBtn.click());

    expect(container.textContent).toContain('About Me');
    expect(container.textContent).toContain('Software Engineer | C# | Fitness enthusiast');

    act(() => root.unmount());
  });

  it('always renders masaxsuzu name regardless of language', () => {
    const root = renderHome();
    expect(container.textContent).toContain('masaxsuzu');

    const langBtn = container.querySelector('[aria-label="Toggle language"]') as HTMLButtonElement;
    act(() => langBtn.click());

    expect(container.textContent).toContain('masaxsuzu');

    act(() => root.unmount());
  });
});
