export type Lang = 'en' | 'ja';

export const translations = {
  en: {
    mainCtaBio: 'Software Engineer | C# | Fitness enthusiast',
    aboutTitle: 'About Me',
    aboutDesc:
      "Hi! I'm masaxsuzu, a software engineer, most of the time I work in Desktop App and Backend development (C#) and some other stuffs. I also like contributing on open source projects and learning new computer science concepts! Outside of coding, I work out at the gym.",
    cardsTitle: 'Public Content',
  },
  ja: {
    mainCtaBio: 'ソフトウェアエンジニア | C# | フィットネス愛好家',
    aboutTitle: '自己紹介',
    aboutDesc:
      'こんにちは！masaxsuzu です。主にデスクトップアプリ・バックエンド開発（C#）に携わっています。オープンソースへの貢献やコンピュータサイエンスの学習も好きです。コーディング以外ではジムでトレーニングをしています。',
    cardsTitle: '公開コンテンツ',
  },
} as const;

export type Translations = (typeof translations)[Lang];
