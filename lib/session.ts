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
