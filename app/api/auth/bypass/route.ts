import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  if (!process.env.AUTH_BYPASS_USER) {
    return NextResponse.redirect(new URL('/login', req.url), { status: 302 });
  }
  return NextResponse.redirect(new URL('/', req.url), { status: 302 });
}
