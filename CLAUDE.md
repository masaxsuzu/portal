# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

`masaxsuzu` のポートフォリオサイト。Next.js (Pages Router) + TypeScript + Tailwind CSS 製。パスワード認証付き。

## Development Commands

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# リント
npm run lint

# フォーマット修正
npm run format

# フォーマット確認
npm run format:check

# テスト (CI 準拠)
npm run test:coverage:ci
```

## Before Creating a PR

**必ず以下をすべてパスしてからコミット・プッシュすること:**

```bash
npm run lint
npm run format:check
npm run test:coverage:ci
npm run build
npm run format  # ビルドで自動変更されたファイルを修正
npm run format:check  # 再確認
```

> `npm run build` が `tsconfig.json` などを自動書き換えることがある。
> ビルド後に必ず `npm run format` を実行してからコミットすること。

## Architecture

- **認証**: `middleware.ts` が Cookie (`auth`) を検査し、未認証ユーザーを `/login` にリダイレクト
- **コンテンツ**: `pages/data.json` を編集することでページ内容を変更できる
- **コンポーネント**: `components/` 配下の `About` / `Cards` / `MainCta` / `Divider` が `data.json` の `components` 配列に基づいて動的に描画される
- **API**: `pages/api/login.ts` がパスワード検証を行い Cookie をセット

## Environment Variables

| 変数名     | 説明                 | 必須 |
| ---------- | -------------------- | ---- |
| `PASSWORD` | ログイン用パスワード | ✓    |

`.env.local` に記述する:

```bash
PASSWORD=your-secret-password
```

## Testing

```bash
# 全テスト (CI と同じ)
npm run test:coverage:ci

# ウォッチモード (開発中)
npm run test:watch
```

### テスト構成

| ファイル                          | 内容                        |
| --------------------------------- | --------------------------- |
| `__tests__/api/login.test.ts`     | ログイン API ユニットテスト |
| `__tests__/components/*.test.tsx` | 各 UI コンポーネントテスト  |
| `__tests__/pages/login.test.tsx`  | ログインページテスト        |
