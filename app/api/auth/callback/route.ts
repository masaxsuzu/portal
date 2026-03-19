import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export function createSessionToken(username: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET is not configured');
  }
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(`${username}.${timestamp}`)
    .digest('hex');
  return `${username}.${timestamp}.${hmac}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.error('[auth/callback] SESSION_SECRET is not configured');
    return NextResponse.redirect(
      new URL('/login?error=not_configured', req.url),
      { status: 302 }
    );
  }

  const state = searchParams.get('state');
  const storedState = req.cookies.get('oauth_state')?.value;
  if (!state || !storedState || state !== storedState) {
    console.error('[auth/callback] OAuth state mismatch');
    return NextResponse.redirect(
      new URL('/login?error=state_mismatch', req.url),
      { status: 302 }
    );
  }

  const code = searchParams.get('code');

  if (!code) {
    console.error('[auth/callback] Missing code in query');
    return NextResponse.redirect(
      new URL('/login?error=missing_code', req.url),
      { status: 302 }
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const allowedUser = process.env.GITHUB_ALLOWED_USER;

  if (!clientId || !clientSecret) {
    console.error('[auth/callback] GitHub OAuth env vars not configured');
    return NextResponse.redirect(
      new URL('/login?error=not_configured', req.url),
      { status: 302 }
    );
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
    console.error('[auth/callback] Failed to get access token');
    return NextResponse.redirect(
      new URL('/login?error=token_failed', req.url),
      { status: 302 }
    );
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
    return NextResponse.redirect(new URL('/login?error=user_failed', req.url), {
      status: 302,
    });
  }

  if (!allowedUser || username !== allowedUser) {
    console.error('[auth/callback] Access denied for user: [REDACTED]');
    return NextResponse.redirect(
      new URL('/login?error=access_denied', req.url),
      { status: 302 }
    );
  }

  const sessionToken = createSessionToken(username);

  const response = NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  });
  response.cookies.set('auth', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 3,
  });
  response.cookies.set('oauth_state', '', { maxAge: 0, path: '/' });
  return response;
}
