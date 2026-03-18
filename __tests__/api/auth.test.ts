/**
 * @jest-environment node
 */
import { GET as githubHandler } from '../../app/api/auth/github/route';
import {
  GET as callbackHandler,
  createSessionToken,
} from '../../app/api/auth/callback/route';
import { NextRequest } from 'next/server';

describe('/api/auth/github', () => {
  beforeEach(() => {
    process.env.GITHUB_CLIENT_ID = 'test-client-id';
  });

  it('should redirect to GitHub OAuth URL with state parameter', () => {
    const res = githubHandler();

    expect(res.status).toBe(302);
    const location = res.headers.get('location');
    expect(location).toContain('https://github.com/login/oauth/authorize');
    expect(location).toContain('client_id=test-client-id');
    expect(location).toContain('scope=read%3Auser');
    expect(location).toMatch(/[?&]state=[0-9a-f]{64}/);
  });

  it('should set oauth_state cookie', () => {
    const res = githubHandler();

    const cookie = res.headers.get('set-cookie');
    expect(cookie).toContain('oauth_state=');
    expect(cookie).toContain('HttpOnly');
  });

  it('should return 500 when GITHUB_CLIENT_ID is not set', () => {
    delete process.env.GITHUB_CLIENT_ID;

    const res = githubHandler();

    expect(res.status).toBe(500);
  });
});

describe('/api/auth/callback', () => {
  beforeEach(() => {
    process.env.GITHUB_CLIENT_ID = 'test-client-id';
    process.env.GITHUB_CLIENT_SECRET = 'test-client-secret';
    process.env.GITHUB_ALLOWED_USER = 'masaxsuzu';
    process.env.SESSION_SECRET = 'test-session-secret';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function makeCallbackRequest(
    query?: Record<string, string>,
    oauthState: string = 'test-state'
  ) {
    const url = new URL('http://localhost/api/auth/callback');
    url.searchParams.set('state', oauthState);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        url.searchParams.set(k, v);
      }
    }
    return new NextRequest(url.toString(), {
      headers: { cookie: `oauth_state=${oauthState}` },
    });
  }

  it('should redirect to /login?error=not_configured when SESSION_SECRET is not set', async () => {
    delete process.env.SESSION_SECRET;

    const req = makeCallbackRequest({ code: 'test-code' });

    const res = await callbackHandler(req);

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain(
      '/login?error=not_configured'
    );
  });

  it('should redirect to /login?error=state_mismatch when state is missing', async () => {
    const url = new URL('http://localhost/api/auth/callback');
    url.searchParams.set('code', 'test-code');
    const req = new NextRequest(url.toString());

    const res = await callbackHandler(req);

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain(
      '/login?error=state_mismatch'
    );
  });

  it('should redirect to /login?error=state_mismatch when state does not match cookie', async () => {
    const url = new URL('http://localhost/api/auth/callback');
    url.searchParams.set('code', 'test-code');
    url.searchParams.set('state', 'wrong-state');
    const req = new NextRequest(url.toString(), {
      headers: { cookie: 'oauth_state=correct-state' },
    });

    const res = await callbackHandler(req);

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain(
      '/login?error=state_mismatch'
    );
  });

  it('should redirect to /login?error=missing_code when code is missing', async () => {
    const req = makeCallbackRequest();

    const res = await callbackHandler(req);

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('/login?error=missing_code');
  });

  it('should redirect to /login?error=not_configured when GitHub credentials are not configured', async () => {
    delete process.env.GITHUB_CLIENT_ID;

    const req = makeCallbackRequest({ code: 'test-code' });

    const res = await callbackHandler(req);

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain(
      '/login?error=not_configured'
    );
  });

  it('should redirect to /login?error=token_failed when GitHub token exchange fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({}),
    });

    const req = makeCallbackRequest({ code: 'bad-code' });

    const res = await callbackHandler(req);

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('/login?error=token_failed');
  });

  it('should redirect to /login?error=user_failed when GitHub user info fetch fails', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ access_token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        json: async () => ({}),
      });

    const req = makeCallbackRequest({ code: 'test-code' });

    const res = await callbackHandler(req);

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('/login?error=user_failed');
  });

  it('should redirect to /login?error=access_denied when user is not the allowed user', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ access_token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ login: 'other-user' }),
      });

    const req = makeCallbackRequest({ code: 'test-code' });

    const res = await callbackHandler(req);

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('/login?error=access_denied');
  });

  it('should set auth cookie and redirect on successful login', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ access_token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ login: 'masaxsuzu' }),
      });

    const req = makeCallbackRequest({ code: 'test-code' });

    const res = await callbackHandler(req);

    expect(res.status).toBe(302);
    const allCookies = res.headers.getSetCookie().join('\n');
    expect(allCookies).toContain('auth=');
    expect(allCookies).toContain('HttpOnly');
    expect(allCookies.toLowerCase()).toContain('samesite=lax');
    expect(allCookies).toContain('Max-Age=86400');
  });

  it('should set Secure cookie in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as NodeJS.ProcessEnv).NODE_ENV = 'production';

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ access_token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ login: 'masaxsuzu' }),
      });

    const req = makeCallbackRequest({ code: 'test-code' });

    const res = await callbackHandler(req);

    expect(res.headers.getSetCookie().join('\n')).toContain('Secure');

    (process.env as NodeJS.ProcessEnv).NODE_ENV = originalEnv;
  });

  it('should allow any user when GITHUB_ALLOWED_USER is not set', async () => {
    delete process.env.GITHUB_ALLOWED_USER;

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ access_token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ login: 'any-user' }),
      });

    const req = makeCallbackRequest({ code: 'test-code' });

    const res = await callbackHandler(req);

    expect(res.status).toBe(302);
  });
});

describe('createSessionToken', () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = 'test-secret';
  });

  it('should return a token in the format username.hmac', () => {
    const token = createSessionToken('masaxsuzu');
    const parts = token.split('.');
    expect(parts).toHaveLength(2);
    expect(parts[0]).toBe('masaxsuzu');
    expect(parts[1]).toMatch(/^[0-9a-f]{64}$/);
  });

  it('should produce different tokens for different secrets', () => {
    process.env.SESSION_SECRET = 'secret-a';
    const tokenA = createSessionToken('masaxsuzu');
    process.env.SESSION_SECRET = 'secret-b';
    const tokenB = createSessionToken('masaxsuzu');
    expect(tokenA).not.toBe(tokenB);
  });

  it('should produce different tokens for different usernames', () => {
    const tokenA = createSessionToken('user-a');
    const tokenB = createSessionToken('user-b');
    expect(tokenA).not.toBe(tokenB);
  });

  it('should throw when SESSION_SECRET is not set', () => {
    delete process.env.SESSION_SECRET;
    expect(() => createSessionToken('masaxsuzu')).toThrow(
      'SESSION_SECRET is not configured'
    );
  });
});
