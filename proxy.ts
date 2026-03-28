import { NextRequest, NextResponse } from 'next/server';

export { createSessionToken } from './lib/session';

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

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com https://cdnjs.cloudflare.com`,
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
    "img-src 'self' data:",
    "connect-src 'self'",
  ].join('; ');
}

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const authCookie = request.cookies.get('auth');
  const pathname = request.nextUrl.pathname;
  const isPublicPath =
    pathname.startsWith('/login') || pathname.startsWith('/api/auth/');
  const allowedUser = process.env.GITHUB_ALLOWED_USER;

  const redirect = (path: string) => {
    const res = NextResponse.redirect(new URL(path, request.url));
    res.headers.set('Content-Security-Policy', buildCsp(nonce));
    return res;
  };

  const bypassUser = process.env.AUTH_BYPASS_USER;
  if (bypassUser) {
    const response = NextResponse.next({
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers),
          'x-nonce': nonce,
        }),
      },
    });
    response.headers.set('Content-Security-Policy', buildCsp(nonce));
    return response;
  }

  if (!authCookie) {
    if (!isPublicPath) return redirect('/login');
  } else {
    const isValid = await verifySessionToken(authCookie.value, allowedUser);
    if (!isValid) {
      const res = redirect('/login');
      res.cookies.delete('auth');
      return res;
    }
    if (pathname === '/login') return redirect('/');
    if (!isPublicPath && pathname !== '/') return redirect('/');
  }

  const response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        'x-nonce': nonce,
      }),
    },
  });
  response.headers.set('Content-Security-Policy', buildCsp(nonce));
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
