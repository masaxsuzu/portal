import { createMocks } from 'node-mocks-http';
import handler, { hashToken } from '../../pages/api/login';
import { NextApiRequest, NextApiResponse } from 'next';

describe('/api/login', () => {
  beforeEach(() => {
    process.env.PASSWORD = 'test-password';
    process.env.SALT = 'test-salt';
  });

  it('should return 405 for non-POST requests', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('should return 200 and set cookie with hashed token for correct password', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        password: 'test-password',
      },
    });

    handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ success: true });

    const cookies = res._getHeaders()['set-cookie'];
    expect(cookies).toBeDefined();
    const expectedToken = hashToken('test-password');
    expect(cookies).toContain(`auth=${expectedToken}`);
    expect(cookies).not.toContain('auth=true');
    expect(cookies).toContain('HttpOnly');
    expect(cookies).toContain('SameSite=Strict');
  });

  it('should return 401 for incorrect password', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        password: 'wrong-password',
      },
    });

    handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'パスワードが間違っています',
    });
  });

  it('should return 401 when no password provided', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {},
    });

    handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'パスワードが間違っています',
    });
  });

  it('should set secure cookie in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        password: 'test-password',
      },
    });

    handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const cookies = res._getHeaders()['set-cookie'];
    expect(cookies).toContain('Secure');

    (process.env as any).NODE_ENV = originalEnv;
  });

  it('should set cookie with correct expiration time', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        password: 'test-password',
      },
    });

    handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const cookies = res._getHeaders()['set-cookie'];
    expect(cookies).toContain('Max-Age=3600');
  });

  describe('hashToken', () => {
    it('should produce different tokens for different salts', () => {
      process.env.SALT = 'salt-a';
      const tokenA = hashToken('password');
      process.env.SALT = 'salt-b';
      const tokenB = hashToken('password');
      expect(tokenA).not.toBe(tokenB);
    });

    it('should produce a 64-character hex string (SHA-256)', () => {
      const token = hashToken('test-password');
      expect(token).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should use empty string as default salt when SALT is not set', () => {
      delete process.env.SALT;
      const token = hashToken('password');
      expect(token).toMatch(/^[0-9a-f]{64}$/);
    });
  });
});
