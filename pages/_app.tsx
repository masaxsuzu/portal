import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function _App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
