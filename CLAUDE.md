# CLAUDE.md

このプロジェクトは masaxsuzu の技術的な遊び場である。

Claude Code を使って開発することを前提にしている。

プルリクエストのレビューでは自動テストがなされていることを前提とする。

## 技術スタック

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5（strict）
- **Styling**: Tailwind CSS 4
- **Auth**: GitHub OAuth（cookie セッション）

## プロジェクト構造

- `app/` — ページ・API ルート（App Router）
- `components/` — UI コンポーネント
- `contexts/` — AppContext（言語・テーマ）
- `lib/` — session.ts / i18n.ts

## テスト

| 種別 | ツール | コマンド |
|---|---|---|
| ユニット / 統合 | Jest | `npm test` |
| E2E | Playwright (Chromium) | CI 環境（PR 作成後）で確認 |

カバレッジ要件: 全体 80% / API ルート 100%

## pre-push フック（Husky）

`git push` 時に自動実行:
`npm run lint && npm run test:coverage:ci && npm run build && npm run format && npm run format:check`
