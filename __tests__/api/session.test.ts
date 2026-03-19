/**
 * @jest-environment node
 */
import { GET } from '../../app/api/auth/session/route';
import { createSessionToken } from '../../app/api/auth/callback/route';
import { NextRequest } from 'next/server';

describe('/api/auth/session', () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = 'test-session-secret';
    process.env.GITHUB_ALLOWED_USER = 'masaxsuzu';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function makeRequest(cookie?: string) {
    const url = new URL('http://localhost/api/auth/session');
    const headers: Record<string, string> = {};
    if (cookie) headers['cookie'] = cookie;
    return new NextRequest(url.toString(), { headers });
  }

  it('returns expiresIn: 0 when no auth cookie', async () => {
    const res = await GET(makeRequest());
    const data = await res.json();
    expect(data.expiresIn).toBe(0);
  });

  it('returns expiresIn: 0 when token is invalid', async () => {
    const res = await GET(makeRequest('auth=invalid.token.value'));
    const data = await res.json();
    expect(data.expiresIn).toBe(0);
  });

  it('returns expiresIn: 0 when SESSION_SECRET is not set', async () => {
    delete process.env.SESSION_SECRET;
    const res = await GET(makeRequest('auth=some.token.here'));
    const data = await res.json();
    expect(data.expiresIn).toBe(0);
  });

  it('returns positive expiresIn for a valid token', async () => {
    const token = createSessionToken('masaxsuzu');
    const res = await GET(makeRequest(`auth=${token}`));
    const data = await res.json();
    expect(data.expiresIn).toBeGreaterThan(0);
    expect(data.expiresIn).toBeLessThanOrEqual(60 * 60 * 3);
  });

  it('returns expiresIn: 0 for a token from a disallowed user', async () => {
    process.env.GITHUB_ALLOWED_USER = 'masaxsuzu';
    // Manually craft a token for another user with the correct secret
    const crypto = await import('crypto');
    const secret = process.env.SESSION_SECRET!;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const hmac = crypto
      .createHmac('sha256', secret)
      .update(`otheruser.${timestamp}`)
      .digest('hex');
    const token = `otheruser.${timestamp}.${hmac}`;

    const res = await GET(makeRequest(`auth=${token}`));
    const data = await res.json();
    expect(data.expiresIn).toBe(0);
  });
});
