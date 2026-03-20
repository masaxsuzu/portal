import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  });
  res.cookies.set('auth', '', { maxAge: 0, path: '/' });
  return res;
}
