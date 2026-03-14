import { useAppContext } from '../contexts/AppContext';

export default function Controls() {
  const { theme, toggleTheme, lang, toggleLang } = useAppContext();

  return (
    <div className="fixed top-4 right-4 flex gap-2 z-50">
      <button
        onClick={toggleLang}
        aria-label="Toggle language"
        className="bg-cardbg border border-cardborder text-primary px-3 py-1 rounded-lg text-sm hover:border-skyblue transition-colors"
      >
        {lang === 'en' ? 'JA' : 'EN'}
      </button>
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="bg-cardbg border border-cardborder text-primary px-3 py-1 rounded-lg text-sm hover:border-skyblue transition-colors"
      >
        {theme === 'dark' ? (
          <i className="fa-solid fa-sun" />
        ) : (
          <i className="fa-solid fa-moon" />
        )}
      </button>
    </div>
  );
}
