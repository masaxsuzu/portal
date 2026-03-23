import { test, expect, type Page } from '@playwright/test';

const STUB_URL = 'http://localhost:3001';

async function setStubUser(login: string) {
  await fetch(`${STUB_URL}/test/set-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login }),
  });
}

async function login(page: Page) {
  await setStubUser('testuser');
  await page.goto('/login');
  await page.locator('a[href="/api/auth/github"]').click();
  await expect(page).toHaveURL('/');
}

test('許可ユーザーがログインするとホームに到達する', async ({ page }) => {
  await login(page);
});

test('不正ユーザーはアクセス拒否されログインページに戻る', async ({ page }) => {
  await setStubUser('otheruser');
  await page.goto('/login');
  await page.locator('a[href="/api/auth/github"]').click();
  await expect(page).toHaveURL(/\/login.*access_denied/);
});

test('ログイン後ログアウトするとログインページに遷移する', async ({ page }) => {
  await login(page);
  await page.waitForLoadState('load');
  await page.locator('[aria-label="Open menu"]').click();
  await page.locator('[aria-label="Logout"]').waitFor({ state: 'visible' });
  await page.locator('[aria-label="Logout"]').click();
  await expect(page).toHaveURL('/login');
});

test('ログイン後リロードするとホームページに留まる', async ({ page }) => {
  await login(page);
  await page.reload();
  await expect(page).toHaveURL('/');
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
