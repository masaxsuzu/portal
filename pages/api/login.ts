import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import crypto from 'crypto';

export function hashToken(password: string): string {
  const salt = process.env.SALT ?? '';
  return crypto.createHash('sha256').update(salt + password).digest('hex');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // POST以外は拒否
  }

  const { password } = req.body;
  const PASSWORD = process.env.PASSWORD;

  if (password === PASSWORD) {
    const cookie = serialize('auth', hashToken(password), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1時間
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true });
  } else {
    return res
      .status(401)
      .json({ success: false, message: 'パスワードが間違っています' });
  }
}
