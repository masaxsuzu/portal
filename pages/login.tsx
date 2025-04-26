import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const redirectPath = typeof router.query.redirect === 'string' ? router.query.redirect : '/';

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
      setError('パスワードが違います');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', minWidth: '320px'
      }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center', color: '#333' }}>ログイン</h1>
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: isLoading ? '#ccc' : '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          {isLoading ? '認証中...' : 'ログイン'}
        </button>
        {error && <p style={{ marginTop: '1rem', color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
      </form>
    </div>
  );
}
