/**
 * @jest-environment node
 */
import { proxy, verifySessionToken } from '../../proxy';
import { createSessionToken } from '../../app/api/auth/callback/route';
import { NextRequest } from 'next/server';

function makeRequest(path: string, authToken?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (authToken !== undefined) {
    headers['cookie'] = `auth=${authToken}`;
  }
  return new NextRequest(`http://localhost${path}`, { headers });
}

describe('verifySessionToken', () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = 'test-secret';
  });

  it('should return true for a valid token', async () => {
    const token = createSessionToken('masaxsuzu');
    expect(await verifySessionToken(token)).toBe(true);
  });

  it('should return false for a tampered token', async () => {
    const token = createSessionToken('masaxsuzu');
    const tampered = token.slice(0, -4) + 'ffff';
    expect(await verifySessionToken(tampered)).toBe(false);
  });

  it('should return false for a token without a dot separator', async () => {
    expect(await verifySessionToken('nodottoken')).toBe(false);
  });

  it('should return false for an empty string', async () => {
    expect(await verifySessionToken('')).toBe(false);
  });

  it('should return false when secret differs', async () => {
    const token = createSessionToken('masaxsuzu');
    process.env.SESSION_SECRET = 'different-secret';
    expect(await verifySessionToken(token)).toBe(false);
  });
});

describe('proxy', () => {
  let validToken: string;

  beforeEach(() => {
    process.env.SESSION_SECRET = 'test-secret';
    validToken = createSessionToken('masaxsuzu');
  });

  describe('unauthenticated access', () => {
    it('should redirect to /login when no cookie on /', async () => {
      const req = makeRequest('/');
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/login');
    });

    it('should allow access to /login without cookie', async () => {
      const req = makeRequest('/login');
      const res = await proxy(req);
      expect(res.status).toBe(200);
    });
  });

  describe('invalid cookie', () => {
    it('should redirect to /login and clear cookie when cookie value is wrong', async () => {
      const req = makeRequest('/', 'invalid-token');
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/login');
      expect(res.headers.get('set-cookie')).toContain('auth=;');
    });

    it('should redirect to /login when cookie value is "true" (old format)', async () => {
      const req = makeRequest('/', 'true');
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/login');
    });
  });

  describe('authenticated access', () => {
    it('should allow access to / with valid cookie', async () => {
      const req = makeRequest('/', validToken);
      const res = await proxy(req);
      expect(res.status).toBe(200);
    });

    it('should redirect to / from /login when already authenticated', async () => {
      const req = makeRequest('/login', validToken);
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/');
    });
  });
});
