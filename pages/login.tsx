import { useState } from 'react';
import { useRouter } from 'next/router';
import Controls from '../components/Controls';
import { useAppContext } from '../contexts/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useAppContext();

  const getValidRedirectPath = (path: unknown): string => {
    if (typeof path !== 'string') return '/';
    // Only allow relative paths starting with / and not containing protocol or double slashes
    if (path.startsWith('/') && !path.startsWith('//') && !path.includes(':')) {
      return path;
    }
    return '/';
  };
  const redirectPath = getValidRedirectPath(router.query.redirect);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setIsLoading(false);

    if (res.ok) {
      router.push(redirectPath);
    } else {
      setError(t.loginError);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <Controls />
      <form
        onSubmit={handleSubmit}
        className="bg-cardbg border border-cardborder rounded-lg p-8 min-w-[320px] shadow-lg"
      >
        <h1 className="text-primary text-2xl text-center mb-2">
          {t.loginTitle}
        </h1>
        <p className="text-primary/50 text-sm text-center mb-6">
          {t.loginSubtext}
        </p>
        <input
          type="password"
          placeholder={t.loginPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-3 mb-4 rounded bg-background border border-cardborder text-primary placeholder-primary/40 outline-none focus:border-skyblue disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded bg-skyblue text-background font-semibold disabled:opacity-50"
        >
          {isLoading ? t.loginLoading : t.loginButton}
        </button>
        {error && (
          <p className="mt-4 text-sm text-center text-red-400">{error}</p>
        )}
      </form>
    </div>
  );
}
