import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '../../../../proxy';

const SESSION_TTL_SECONDS = 60 * 60 * 3;

export async function GET(req: NextRequest) {
  const authCookie = req.cookies.get('auth');
  if (!authCookie) {
    return NextResponse.json({ expiresIn: 0 });
  }

  const isValid = await verifySessionToken(
    authCookie.value,
    process.env.GITHUB_ALLOWED_USER
  );
  if (!isValid) {
    return NextResponse.json({ expiresIn: 0 });
  }

  const parts = authCookie.value.split('.');
  const timestamp = Number(parts[1]);
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = timestamp + SESSION_TTL_SECONDS - now;
  return NextResponse.json({ expiresIn: Math.max(0, expiresIn) });
}
