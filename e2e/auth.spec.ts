import { test, expect } from '@playwright/test';

const STUB_URL = 'http://localhost:3001';

async function setStubUser(login: string) {
  await fetch(`${STUB_URL}/test/set-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login }),
  });
}

test('許可ユーザーがログインするとホームに到達する', async ({ page }) => {
  await setStubUser('testuser');
  await page.goto('/login');
  await page.getByRole('link', { name: /github/i }).click();
  await expect(page).toHaveURL('/');
});

test('不正ユーザーはアクセス拒否されログインページに戻る', async ({ page }) => {
  await setStubUser('otheruser');
  await page.goto('/login');
  await page.getByRole('link', { name: /github/i }).click();
  await expect(page).toHaveURL(/\/login.*access_denied/);
});

test('無効なセッションクッキーはログインページにリダイレクトされる', async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: 'auth',
      value: 'tampered.invalidcookie',
      domain: 'localhost',
      path: '/',
    },
  ]);
  await page.goto('/');
  await expect(page).toHaveURL('/login');
});
