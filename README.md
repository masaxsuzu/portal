# portal

`masaxsuzu` のポートフォリオサイト。Next.js (Pages Router) + TypeScript + Tailwind CSS 製。GitHub OAuth 認証付き。

## セットアップ

```bash
npm install
```

`.env.local` を作成:

```bash
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_ALLOWED_USER=your-github-username
SESSION_SECRET=your-random-secret
```

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開く。
