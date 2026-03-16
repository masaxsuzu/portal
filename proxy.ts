// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export async function computeExpectedToken(): Promise<string> {
  const salt = process.env.SALT ?? '';
  const password = process.env.PASSWORD ?? '';
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
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

  const expectedToken = await computeExpectedToken();
  const isValid = authCookie.value === expectedToken;

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
