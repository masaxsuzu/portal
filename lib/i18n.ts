export type Lang = 'en' | 'ja';

export const translations = {
  en: {
    mainCtaBio: 'Software Engineer | C# | Fitness enthusiast',
    aboutTitle: 'About Me',
    aboutDesc:
      "Hi! I'm masaxsuzu, a software engineer, most of the time I work in Desktop App and Backend development (C#) and some other stuffs. I also like contributing on open source projects and learning new computer science concepts! Outside of coding, I work out at the gym.",
    cardsTitle: 'Public Content',
    loginTitle: 'Welcome',
    loginSubtext: "masaxsuzu's private portfolio",
    loginButton: 'Enter',
    oauthErrorMissingCode: 'OAuth error: missing code',
    oauthErrorNotConfigured: 'OAuth error: server not configured',
    oauthErrorTokenFailed: 'OAuth error: failed to get access token',
    oauthErrorUserFailed: 'OAuth error: failed to get user info',
    oauthErrorAccessDenied: 'Access denied',
    sessionExpiredTitle: 'Session Expired',
    sessionExpiredMessage: 'Your session has expired. Please log in again.',
    sessionExpiredCountdown: 'Redirecting in {n} seconds...',
    oauthErrorSessionExpired: 'Your session has expired. Please log in again.',
  },
  ja: {
    mainCtaBio: 'ソフトウェアエンジニア | C# | フィットネス愛好家',
    aboutTitle: '自己紹介',
    aboutDesc:
      'こんにちは！masaxsuzu です。主にデスクトップアプリ・バックエンド開発（C#）に携わっています。オープンソースへの貢献やコンピュータサイエンスの学習も好きです。コーディング以外ではジムでトレーニングをしています。',
    cardsTitle: '公開コンテンツ',
    loginTitle: 'ようこそ',
    loginSubtext: 'masaxsuzu のプライベートポートフォリオです',
    loginButton: '入る',
    oauthErrorMissingCode: 'OAuth エラー: コードが見つかりません',
    oauthErrorNotConfigured: 'OAuth エラー: サーバーが未設定です',
    oauthErrorTokenFailed: 'OAuth エラー: アクセストークンの取得に失敗しました',
    oauthErrorUserFailed: 'OAuth エラー: ユーザー情報の取得に失敗しました',
    oauthErrorAccessDenied: 'アクセスが拒否されました',
    sessionExpiredTitle: 'セッション期限切れ',
    sessionExpiredMessage:
      'セッションの有効期限が切れました。再度ログインしてください。',
    sessionExpiredCountdown: '{n}秒後にリダイレクトします...',
    oauthErrorSessionExpired:
      'セッションの有効期限が切れました。再度ログインしてください。',
  },
} as const;

export type Translations = (typeof translations)[Lang];
