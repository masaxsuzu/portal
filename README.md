# portal

masaxsuzu のポートフォリオサイト。Next.js 製、パスワード認証付き。

## 技術スタック

- **Framework**: Next.js (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Testing**: Jest
- **Runtime**: Node.js

## 機能

- パスワード認証（Cookie ベース、`middleware.ts` でルート保護）
- `data.json` 駆動のコンポーネント描画（About / Cards / MainCta / Divider）
- API ルート `/api/login` によるログイン処理

## 環境変数

| 変数名     | 説明                               | 必須 |
| ---------- | ---------------------------------- | ---- |
| `PASSWORD` | ログイン用パスワード               | ✓    |
| `SALT`     | Cookie トークンのハッシュ用ソルト  | ✓    |

`.env.local` を作成して設定する:

```bash
PASSWORD=your-secret-password
SALT=your-random-salt
```

## セットアップ

```bash
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開く。

## ビルド

```bash
npm run build
npm start
```

## テスト

```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ
npm run test:coverage
```

### テスト構成

| ファイル                                  | 内容                        |
| ----------------------------------------- | --------------------------- |
| `__tests__/api/login.test.ts`             | ログイン API ユニットテスト |
| `__tests__/middleware/middleware.test.ts` | middleware ユニットテスト   |
| `__tests__/components/*.test.tsx`         | 各 UI コンポーネントテスト  |
| `__tests__/pages/login.test.tsx`          | ログインページテスト        |

## プロジェクト構成

```
portal/
├── components/        # UI コンポーネント (About, Cards, MainCta, Divider)
├── pages/
│   ├── api/           # API ルート
│   ├── data.json      # サイトコンテンツ設定
│   ├── index.tsx      # トップページ
│   └── login.tsx      # ログインページ
├── middleware.ts       # 認証ミドルウェア
└── __tests__/         # テスト
```

## コンテンツ編集

`pages/data.json` を編集することでサイトのコンテンツを更新できる。

```json
{
  "title": "サイトタイトル",
  "siteDescription": "説明文",
  "components": [...]
}
```
