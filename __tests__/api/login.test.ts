import { createMocks } from 'node-mocks-http';
import githubHandler from '../../pages/api/auth/github';
import callbackHandler, {
  createSessionToken,
} from '../../pages/api/auth/callback';
import { NextApiRequest, NextApiResponse } from 'next';

describe('/api/auth/github', () => {
  beforeEach(() => {
    process.env.GITHUB_CLIENT_ID = 'test-client-id';
  });

  it('should redirect to GitHub OAuth URL', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    githubHandler(req, res);

    expect(res._getStatusCode()).toBe(302);
    const location = res._getRedirectUrl();
    expect(location).toContain('https://github.com/login/oauth/authorize');
    expect(location).toContain('client_id=test-client-id');
    expect(location).toContain('scope=read%3Auser');
  });

  it('should return 500 when GITHUB_CLIENT_ID is not set', () => {
    delete process.env.GITHUB_CLIENT_ID;

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    githubHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
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

  it('should return 400 when code is missing', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {},
    });

    await callbackHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('should return 500 when GitHub credentials are not configured', async () => {
    delete process.env.GITHUB_CLIENT_ID;

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { code: 'test-code' },
    });

    await callbackHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
  });

  it('should return 401 when GitHub token exchange fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({}),
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { code: 'bad-code' },
    });

    await callbackHandler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

  it('should return 401 when GitHub user info fetch fails', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ access_token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        json: async () => ({}),
      });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { code: 'test-code' },
    });

    await callbackHandler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

  it('should return 403 when user is not the allowed user', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ access_token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ login: 'other-user' }),
      });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { code: 'test-code' },
    });

    await callbackHandler(req, res);

    expect(res._getStatusCode()).toBe(403);
  });

  it('should set auth cookie and redirect on successful login', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ access_token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ login: 'masaxsuzu' }),
      });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { code: 'test-code' },
    });

    await callbackHandler(req, res);

    expect(res._getStatusCode()).toBe(302);
    const cookies = res._getHeaders()['set-cookie'] as string;
    expect(cookies).toContain('auth=');
    expect(cookies).toContain('HttpOnly');
    expect(cookies).toContain('SameSite=Strict');
    expect(cookies).toContain('Max-Age=86400');
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

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { code: 'test-code' },
    });

    await callbackHandler(req, res);

    expect(res._getHeaders()['set-cookie']).toContain('Secure');

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

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { code: 'test-code' },
    });

    await callbackHandler(req, res);

    expect(res._getStatusCode()).toBe(302);
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

  it('should use empty string as default when SESSION_SECRET is not set', () => {
    delete process.env.SESSION_SECRET;
    const token = createSessionToken('masaxsuzu');
    const parts = token.split('.');
    expect(parts).toHaveLength(2);
    expect(parts[1]).toMatch(/^[0-9a-f]{64}$/);
  });
});
