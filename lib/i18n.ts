export type Lang = 'en' | 'ja';

export const translations = {
  en: {
    mainCtaBio: 'Software Engineer | C# | Fitness enthusiast',
    aboutTitle: 'About Me',
    aboutDesc:
      "Hi! I'm masaxsuzu, a software engineer, most of the time I work in Desktop App and Backend development (C#) and some other stuffs. I also like contributing on open source projects and learning new computer science concepts! Outside of coding, I work out at the gym and enjoy Yu-Gi-Oh.",
    skillsTitle: 'Skills',
    skillsCategories: [
      { name: 'Languages', items: ['C#', 'C', 'Rust', 'TypeScript'] },
      { name: 'Fields', items: ['Desktop App', 'Backend', 'OSS'] },
    ],
    timelineTitle: 'Career',
    timelineEvents: [
      {
        period: '2015',
        description:
          "Master's in Engineering (Electrical & Information Science)",
      },
      { period: '2015 –', description: 'Software Engineer' },
      { period: '2020', description: 'c2 — Self-Hosted C Compiler' },
      { period: '2020', description: 'c3 — C Compiler (Rust)' },
      { period: '2022', description: 'skyla — RDBMS (C#)' },
      { period: '2022', description: "Joined Gold's Gym" },
      {
        period: '2022',
        description: 'hand-simulator — Yu-Gi-Oh Hand Simulator',
      },
      { period: '2025', description: 'Married' },
    ],
    cardsTitle: 'Public Contents',
    loginTitle: 'Welcome',
    loginSubtext: "masaxsuzu's private portfolio",
    loginButton: 'Enter',
    menuTitle: 'Menu',
    menuLanguage: 'Language',
    menuTheme: 'Theme',
    menuLogout: 'Logout',
    oauthErrorMissingCode: 'OAuth error: missing code',
    oauthErrorNotConfigured: 'OAuth error: server not configured',
    oauthErrorTokenFailed: 'OAuth error: failed to get access token',
    oauthErrorUserFailed: 'OAuth error: failed to get user info',
    oauthErrorAccessDenied: 'Access denied',
  },
  ja: {
    mainCtaBio: 'ソフトウェアエンジニア | C# | フィットネス愛好家',
    aboutTitle: '自己紹介',
    aboutDesc:
      'こんにちは！masaxsuzu です。主にデスクトップアプリ・バックエンド開発（C#）に携わっています。コンピュータサイエンスの学習も好きです。コーディング以外ではジムでトレーニングをしたり、遊戯王を楽しんでいます。',
    skillsTitle: 'スキル',
    skillsCategories: [
      { name: '言語', items: ['C#', 'C', 'Rust', 'TypeScript'] },
      { name: '分野', items: ['デスクトップアプリ', 'バックエンド', 'OSS'] },
    ],
    timelineTitle: '経歴',
    timelineEvents: [
      { period: '2015', description: '工学（電気・情報）修士' },
      { period: '2015 –', description: 'ソフトウェアエンジニア' },
      { period: '2020', description: 'c2 — セルフホスト C コンパイラ' },
      { period: '2020', description: 'c3 — C コンパイラ（Rust）' },
      { period: '2022', description: 'skyla — RDBMS（C#）' },
      { period: '2022', description: 'ゴールドジム入会' },
      {
        period: '2022',
        description: 'hand-simulator — 遊戯王ハンドシミュレーター',
      },
      { period: '2025', description: '入籍' },
    ],
    cardsTitle: '公開コンテンツ',
    loginTitle: 'ようこそ',
    loginSubtext: 'masaxsuzu のプライベートポートフォリオです',
    loginButton: '入る',
    menuTitle: 'メニュー',
    menuLanguage: '言語',
    menuTheme: 'テーマ',
    menuLogout: 'ログアウト',
    oauthErrorMissingCode: 'OAuth エラー: コードが見つかりません',
    oauthErrorNotConfigured: 'OAuth エラー: サーバーが未設定です',
    oauthErrorTokenFailed: 'OAuth エラー: アクセストークンの取得に失敗しました',
    oauthErrorUserFailed: 'OAuth エラー: ユーザー情報の取得に失敗しました',
    oauthErrorAccessDenied: 'アクセスが拒否されました',
  },
} as const;

export type Translations = (typeof translations)[Lang];
