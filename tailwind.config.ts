import type { Config } from 'tailwindcss';

const colors = {
  background: 'var(--color-background)',
  primary: 'var(--color-primary)',
  white: 'var(--color-on-surface)',
  cardbg: 'var(--color-cardbg)',
  cardborder: 'var(--color-cardborder)',
  skyblue: '#94C1F2',
  article: '#dd62a7',
  npm: '#db626f',
  ts: '#3178c6',
  csharp: '#178600',
  c: '#555555',
  rust: '#dea584',
};

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontSize: {
        sm: '12px',
      },
      fontFamily: {
        default: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      screens: {
        sm: { max: '640px' },
        md: { min: '640px' },
        lg: { min: '1024px' },
      },
    },
  },
  plugins: [],
};

export default config;
