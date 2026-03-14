import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppProvider } from '../contexts/AppContext';

export default function _App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
