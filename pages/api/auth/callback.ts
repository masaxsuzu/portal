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
    return res.status(400).json({ error: 'Missing code' });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const allowedUser = process.env.GITHUB_ALLOWED_USER;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'GitHub OAuth not configured' });
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

  const tokenData = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'Failed to get access token' });
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
    return res.status(401).json({ error: 'Failed to get user info' });
  }

  if (allowedUser && username !== allowedUser) {
    return res.status(403).json({ error: 'Access denied' });
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
