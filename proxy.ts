import { NextRequest, NextResponse } from 'next/server';

export async function verifySessionToken(token: string): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) return false;

  const username = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  if (!username || !signature) return false;

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

  return crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(username));
}

export async function proxy(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  if (!authCookie) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const isValid = await verifySessionToken(authCookie.value);

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
