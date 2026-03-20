'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '../../contexts/AppContext';
import type { Translations } from '../../lib/i18n';

function getOAuthErrorMessage(
  error: string | null,
  t: Translations
): string | null {
  switch (error) {
    case 'missing_code':
      return t.oauthErrorMissingCode;
    case 'not_configured':
      return t.oauthErrorNotConfigured;
    case 'token_failed':
      return t.oauthErrorTokenFailed;
    case 'user_failed':
      return t.oauthErrorUserFailed;
    case 'access_denied':
      return t.oauthErrorAccessDenied;
    default:
      return null;
  }
}

function GitHubIcon() {
  return (
    <svg
      height="20"
      width="20"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export default function LoginContent({ bypassMode }: { bypassMode: boolean }) {
  const { t } = useAppContext();
  const searchParams = useSearchParams();
  const errorMessage = getOAuthErrorMessage(searchParams.get('error'), t);

  return (
    <div className="bg-cardbg border border-cardborder rounded-lg p-8 min-w-[320px] shadow-lg text-center">
      <h1 className="text-primary text-2xl text-center mb-2">{t.loginTitle}</h1>
      <p className="text-primary/50 text-sm text-center mb-6">
        {t.loginSubtext}
      </p>
      {errorMessage && (
        <p className="text-red-400 text-sm mb-4">{errorMessage}</p>
      )}
      {bypassMode ? (
        <Link
          href="/api/auth/bypass"
          className="flex items-center justify-center gap-2 w-full py-3 rounded bg-skyblue text-background font-semibold hover:opacity-90 transition-opacity"
        >
          {t.loginButton}
        </Link>
      ) : (
        <Link
          href="/api/auth/github"
          className="flex items-center justify-center gap-2 w-full py-3 rounded bg-skyblue text-background font-semibold hover:opacity-90 transition-opacity"
        >
          <GitHubIcon />
          {t.loginButton}
        </Link>
      )}
    </div>
  );
}
