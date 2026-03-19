import { NextRequest, NextResponse } from 'next/server';

const SESSION_TTL_SECONDS = 60 * 60 * 3; // 3時間

export async function verifySessionToken(
  token: string,
  allowedUser?: string
): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [username, timestampStr, signature] = parts;
  if (!username || !timestampStr || !signature) return false;

  const timestamp = Number(timestampStr);
  if (isNaN(timestamp)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now - timestamp > SESSION_TTL_SECONDS) return false;

  // allowedUser が設定されている場合のみユーザー名を検証する
  if (allowedUser && username !== allowedUser) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const sigBytes = new Uint8Array(
    (signature.match(/.{2}/g) ?? []).map((b) => parseInt(b, 16))
  );

  return crypto.subtle.verify(
    'HMAC',
    key,
    sigBytes,
    encoder.encode(`${username}.${timestampStr}`)
  );
}

export async function proxy(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');
  const allowedUser = process.env.GITHUB_ALLOWED_USER;

  if (!authCookie) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const isValid = await verifySessionToken(authCookie.value, allowedUser);

  if (!isValid) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth');
    return response;
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login/:path*'],
};
