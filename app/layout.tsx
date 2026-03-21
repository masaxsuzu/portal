import type { Metadata } from 'next';
import Script from 'next/script';
import { headers } from 'next/headers';
import '../styles/globals.css';
import { AppProvider } from '../contexts/AppContext';
import Controls from '../components/Controls';

export const metadata: Metadata = {
  title: 'masaxsuzu',
  description: 'Portfolio Website',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <Script
          src="/theme-init.js"
          strategy="beforeInteractive"
          nonce={nonce}
        />
      </head>
      <body className="flex flex-col min-h-dvh bg-background">
        <AppProvider>
          <Controls />
          <main className="flex flex-col flex-1 pt-14">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
