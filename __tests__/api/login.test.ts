import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/login';
import { NextApiRequest, NextApiResponse } from 'next';

describe('/api/login', () => {
  beforeEach(() => {
    // Reset environment variables
    process.env.PASSWORD = 'test-password';
  });

  it('should return 405 for non-POST requests', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('should return 200 and set cookie for correct password', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        password: 'test-password',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ success: true });
    
    // Check if cookie is set
    const cookies = res._getHeaders()['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies).toContain('auth=true');
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

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ 
      success: false, 
      message: 'パスワードが間違っています' 
    });
  });

  it('should return 401 when no password provided', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ 
      success: false, 
      message: 'パスワードが間違っています' 
    });
  });

  it('should set secure cookie in production', async () => {
    // Mock production environment
    const originalEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        password: 'test-password',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    // Check if secure cookie is set in production
    const cookies = res._getHeaders()['set-cookie'];
    expect(cookies).toContain('Secure');

    // Restore original environment
    (process.env as any).NODE_ENV = originalEnv;
  });

  it('should set cookie with correct expiration time', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        password: 'test-password',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    // Check if cookie has correct max-age (1 hour = 3600 seconds)
    const cookies = res._getHeaders()['set-cookie'];
    expect(cookies).toContain('Max-Age=3600');
  });
});