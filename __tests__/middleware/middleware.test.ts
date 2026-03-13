/**
 * @jest-environment node
 */
import { middleware, computeExpectedToken } from '../../middleware';
import { NextRequest } from 'next/server';

function makeRequest(path: string, authToken?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (authToken !== undefined) {
    headers['cookie'] = `auth=${authToken}`;
  }
  return new NextRequest(`http://localhost${path}`, { headers });
}

describe('computeExpectedToken', () => {
  beforeEach(() => {
    process.env.PASSWORD = 'test-password';
    process.env.SALT = 'test-salt';
  });

  it('should return a 64-character hex string (SHA-256)', async () => {
    const token = await computeExpectedToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it('should produce different tokens for different salts', async () => {
    process.env.SALT = 'salt-a';
    const tokenA = await computeExpectedToken();
    process.env.SALT = 'salt-b';
    const tokenB = await computeExpectedToken();
    expect(tokenA).not.toBe(tokenB);
  });

  it('should produce different tokens for different passwords', async () => {
    process.env.PASSWORD = 'password-a';
    const tokenA = await computeExpectedToken();
    process.env.PASSWORD = 'password-b';
    const tokenB = await computeExpectedToken();
    expect(tokenA).not.toBe(tokenB);
  });
});

describe('middleware', () => {
  let validToken: string;

  beforeEach(async () => {
    process.env.PASSWORD = 'test-password';
    process.env.SALT = 'test-salt';
    validToken = await computeExpectedToken();
  });

  describe('unauthenticated access', () => {
    it('should redirect to /login when no cookie on /', async () => {
      const req = makeRequest('/');
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/login');
    });

    it('should allow access to /login without cookie', async () => {
      const req = makeRequest('/login');
      const res = await middleware(req);
      expect(res.status).toBe(200);
    });
  });

  describe('invalid cookie', () => {
    it('should redirect to /login and clear cookie when cookie value is wrong', async () => {
      const req = makeRequest('/', 'invalid-token');
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/login');
      expect(res.headers.get('set-cookie')).toContain('auth=;');
    });

    it('should redirect to /login when cookie value is "true" (old format)', async () => {
      const req = makeRequest('/', 'true');
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/login');
    });
  });

  describe('authenticated access', () => {
    it('should allow access to / with valid cookie', async () => {
      const req = makeRequest('/', validToken);
      const res = await middleware(req);
      expect(res.status).toBe(200);
    });

    it('should redirect to / from /login when already authenticated', async () => {
      const req = makeRequest('/login', validToken);
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/');
    });
  });
});
