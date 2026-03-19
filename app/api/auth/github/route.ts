import { NextResponse } from 'next/server';
import crypto from 'crypto';

export function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub OAuth not configured' },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(32).toString('hex');

  const oauthBase = process.env.GITHUB_OAUTH_BASE_URL ?? 'https://github.com';
  const url = new URL(`${oauthBase}/login/oauth/authorize`);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('scope', 'read:user');
  url.searchParams.set('state', state);

  const response = NextResponse.redirect(url.toString(), { status: 302 });
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/callback',
    maxAge: 60 * 10,
  });

  return response;
}
