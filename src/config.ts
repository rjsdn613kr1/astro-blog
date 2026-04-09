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

// Giscus 댓글 설정
// https://giscus.app/ 에서 설정값을 얻어 아래를 채워주세요
export const GISCUS = {
  enabled: true, // true로 바꾸면 댓글 활성화
  repo: "rjsdn613kr1/astro-blog" as `${string}/${string}`,
  repoId: "R_kgDOR38xZg", // giscus.app에서 발급받은 repoId
  category: "Announcements",
  categoryId: "DIC_kwDOR38xZs4C6BJb", // giscus.app에서 발급받은 categoryId
  mapping: "pathname",
  lang: "ko",
} as const;
