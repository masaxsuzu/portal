import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import crypto from 'crypto';

export function createSessionToken(username: string): string {
  const secret = process.env.SESSION_SECRET ?? '';
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(username)
    .digest('hex');
  return `${username}.${hmac}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    console.error('[auth/callback] Missing code in query');
    return res.redirect('/login?error=missing_code');
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const allowedUser = process.env.GITHUB_ALLOWED_USER;

  if (!clientId || !clientSecret) {
    console.error('[auth/callback] GitHub OAuth env vars not configured');
    return res.redirect('/login?error=not_configured');
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    console.error(
      '[auth/callback] Failed to get access token:',
      tokenData.error,
      tokenData.error_description
    );
    return res.redirect('/login?error=token_failed');
  }

  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  const userData = (await userRes.json()) as { login?: string };
  const username = userData.login;

  if (!username) {
    console.error('[auth/callback] Failed to get user info from GitHub API');
    return res.redirect('/login?error=user_failed');
  }

  if (allowedUser && username !== allowedUser) {
    console.error(`[auth/callback] Access denied for user: ${username}`);
    return res.redirect('/login?error=access_denied');
  }

  const sessionToken = createSessionToken(username);
  const cookie = serialize('auth', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  res.setHeader('Set-Cookie', cookie);
  res.redirect('/');
}
