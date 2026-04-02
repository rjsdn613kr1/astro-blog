export const SITE = {
  website: "https://rjsdn613kr1.github.io/astro-blog/",
  author: "suko_yasa",
  profile: "https://github.com/rjsdn613kr1",
  desc: "생각과 경험을 기록하는 공간",
  title: "suko_yasa",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "ko",
  timezone: "Asia/Seoul",
} as const;
