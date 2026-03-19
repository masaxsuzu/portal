/**
 * @jest-environment node
 *
 * セキュリティ攻撃シナリオのインテグレーションテスト
 *
 * これらのテストは実際の攻撃ベクターを文書化する目的で書かれている。
 * 一部は現在の実装が持つ既知の制限（replay攻撃など）を示し、
 * 一部は修正済みの脆弱性（SESSION_SECRET 漏洩時の allowlist バイパス）の
 * 回帰テストとして機能する。
 */
import {
  createSessionToken,
  GET as callbackGET,
} from '../../app/api/auth/callback/route';
import { proxy } from '../../proxy';
import { NextRequest } from 'next/server';

function makeCallbackRequest(
  params: Record<string, string>,
  stateCookie?: string
): NextRequest {
  const url = new URL('http://localhost/api/auth/callback');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const headers: Record<string, string> = {};
  if (stateCookie !== undefined)
    headers['cookie'] = `oauth_state=${stateCookie}`;
  return new NextRequest(url.toString(), { headers });
}

function makeRequest(path: string, authToken?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (authToken !== undefined) {
    headers['cookie'] = `auth=${authToken}`;
  }
  return new NextRequest(`http://localhost${path}`, { headers });
}

describe('Attack: SESSION_SECRET 漏洩による allowlist バイパス', () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = 'leaked-secret';
    process.env.GITHUB_ALLOWED_USER = 'masaxsuzu';
  });

  afterEach(() => {
    delete process.env.GITHUB_ALLOWED_USER;
  });

  /**
   * 修正済み:
   *   verifySessionToken が GITHUB_ALLOWED_USER とトークン内ユーザー名の
   *   一致を検証するようになり、allowlist バイパスは不可能になった。
   *
   * 攻撃手順:
   *   1. SESSION_SECRET を何らかの手段で入手する（env ファイル露出、ログ漏洩など）
   *   2. createSessionToken('attacker') で自分用の有効な HMAC トークンを生成
   *   3. auth Cookie としてセットしてアクセス → 307 redirect（修正後）
   */
  it('[FIXED] SESSION_SECRET が漏洩しても allowlist 外のユーザーはアクセスできない', async () => {
    // 攻撃者が漏洩した SESSION_SECRET を使って自分のトークンを偽造
    const attackerToken = createSessionToken('evil-attacker');

    const req = makeRequest('/', attackerToken);
    const res = await proxy(req);

    // HMAC は正しいが evil-attacker は GITHUB_ALLOWED_USER ではないため拒否される
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login');
  });

  it('[FIXED] 管理者以外の任意のユーザー名でトークンを偽造してもアクセスできない', async () => {
    const candidates = [
      'admin',
      'root',
      'github-actions-bot',
      'masaxsuzu-evil',
    ];

    for (const username of candidates) {
      const forgedToken = createSessionToken(username);
      const req = makeRequest('/', forgedToken);
      const res = await proxy(req);

      // HMAC が正しくてもユーザー名不一致のため拒否される
      expect(res.status).toBe(307);
    }
  });
});

describe('Attack: トークンリプレイ（Cookie 盗用）', () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = 'test-secret';
  });

  /**
   * 制限事項:
   *   ログアウト機能がないため、盗まれたトークンは maxAge（3h）が
   *   切れるまで無効化できない。
   *
   * 攻撃手順:
   *   1. XSS・通信傍受・ログ漏洩などで被害者の auth Cookie を入手
   *   2. そのまま Cookie にセットしてアクセス
   */
  it('[LIMITATION] 盗んだ auth Cookie は有効期限まで使い回せる', async () => {
    // 被害者の正規トークン
    const victimToken = createSessionToken('masaxsuzu');

    // 攻撃者が別のリクエストで同じトークンを使用
    const attackerReq = makeRequest('/', victimToken);
    const res = await proxy(attackerReq);

    // サーバー側にリボケーション機能がないため通過する
    expect(res.status).toBe(200);
  });
});

describe('Attack: トークン偽造（SECRET なし）', () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = 'unknown-secret';
  });

  /**
   * 正常なケース: SECRET を知らなければトークン偽造は不可能であることを確認。
   */
  it('[SAFE] SECRET を知らずに署名を推測してもアクセスできない', async () => {
    // 攻撃者が総当たりで HMAC を試みる（例: 全部 'a' のパディング）
    const guessedToken = 'masaxsuzu.' + 'a'.repeat(64);
    const req = makeRequest('/', guessedToken);
    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login');
  });

  it('[SAFE] ユーザー名部分を改ざんしても署名不一致で弾かれる', async () => {
    // 別の SECRET で作ったトークンの username を masaxsuzu に置き換え
    process.env.SESSION_SECRET = 'attacker-knows-this-secret';
    const originalToken = createSessionToken('other-user');
    const [, timestamp, signature] = originalToken.split('.');

    // username だけ masaxsuzu に差し替え（署名は other-user.timestamp のまま）
    const tamperedToken = `masaxsuzu.${timestamp}.${signature}`;

    process.env.SESSION_SECRET = 'unknown-secret'; // サーバー側は別の secret を使用
    const req = makeRequest('/', tamperedToken);
    const res = await proxy(req);

    expect(res.status).toBe(307);
  });

  it('[SAFE] 署名の末尾 4 バイトを改ざんしたトークンは拒否される', async () => {
    process.env.SESSION_SECRET = 'test-secret';
    const token = createSessionToken('masaxsuzu');
    const tampered = token.slice(0, -4) + 'ffff';

    const req = makeRequest('/', tampered);
    const res = await proxy(req);

    expect(res.status).toBe(307);
  });
});

describe('Attack: CSRF（OAuth state 不一致）', () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = 'test-secret';
  });

  /**
   * OAuth の state パラメータは CSRF 防御として機能する。
   * 攻撃者が被害者を細工した callback URL に誘導しても、
   * Cookie の oauth_state と一致しなければ拒否される。
   */
  it('[SAFE] state がクエリにない場合は拒否される', async () => {
    const req = makeCallbackRequest({ code: 'some-code' }, 'legit-state');
    const res = await callbackGET(req);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('state_mismatch');
  });

  it('[SAFE] oauth_state Cookie がない場合は拒否される', async () => {
    const req = makeCallbackRequest({
      code: 'some-code',
      state: 'legit-state',
    });
    const res = await callbackGET(req);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('state_mismatch');
  });

  it('[SAFE] state と oauth_state Cookie が一致しない場合は拒否される', async () => {
    // 攻撃者が被害者のブラウザで別の state を使い callback を踏ませる
    const req = makeCallbackRequest(
      { code: 'attacker-code', state: 'attacker-state' },
      'legit-state'
    );
    const res = await callbackGET(req);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('state_mismatch');
  });
});

describe('Attack: 奇形トークン', () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = 'test-secret';
  });

  const malformedTokens = [
    { label: 'ドットなし', value: 'nodottoken' },
    { label: '空文字', value: '' },
    { label: 'ドットのみ', value: '.' },
    { label: 'username が空', value: '.abcd1234' },
    { label: 'signature が空', value: 'masaxsuzu.' },
    { label: 'true（旧フォーマット）', value: 'true' },
  ];

  it.each(malformedTokens)(
    '[SAFE] 奇形トークン "$label" はすべて拒否される',
    async ({ value }) => {
      const req = makeRequest('/', value);
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/login');
    }
  );
});
