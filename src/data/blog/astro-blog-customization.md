---
title: AstroPaper 블로그 커스터마이징 — flowkater.io를 레퍼런스로
author: suko_yasa
pubDatetime: 2026-04-09T10:00:00+09:00
modDatetime: 2026-04-09T20:02:27+09:00
description: "flowkater.io를 레퍼런스로 AstroPaper 블로그에 적용한 7가지 커스터마이징: 카드 크기, 탭 타이틀, 파비콘, OG 이미지, 한글 폰트, 댓글, 다크모드 설정 방법 정리"
category: 개발
tags:
  - AstroPaper
  - Astro
  - 블로그
  - 커스터마이징
featured: false
draft: false
---

> **📌 핵심 요약**
>
> - AstroPaper v5 기본 설정은 실사용에 아쉬운 부분이 있다 — 썸네일 크기, 파비콘 경로, 한글 폰트 등
> - flowkater.io의 커스터마이징 방식을 참고해 7가지 항목을 직접 수정했다
> - 각 수정사항의 파일 경로와 코드 변경 내용을 그대로 따라할 수 있도록 정리했다

## Table of contents

## 들어가며

AstroPaper는 깔끔한 디자인과 좋은 기본기로 인기 있는 Astro 블로그 테마다. 하지만 그대로 쓰기엔 작은 불편함들이 있다. 썸네일이 너무 작거나, 프로덕션에서 파비콘이 안 보이거나, OG 이미지에 정보가 부족하거나.

[flowkater.io](https://flowkater.io)를 둘러보다가 비슷한 고민을 해결한 흔적을 발견했다. 그 방식을 참고해 이 블로그에도 7가지 커스터마이징을 적용했다. 아래에 각 항목을 파일 경로와 코드 변경 내용 중심으로 정리한다.

---

## 1. 카드 이미지 크기 확대

**파일:** `src/components/Card.astro`

기본 AstroPaper의 게시글 카드 썸네일은 꽤 작다. 특히 가로폭이 넓은 화면에서 이미지가 우표처럼 보인다. Tailwind 클래스를 수정해 더 넓고 높게 키운다.

```astro
<!-- 변경 전 -->
<img class="w-36 h-[76px] sm:w-44 sm:h-24" ... />

<!-- 변경 후 -->
<img class="w-40 h-[90px] sm:w-56 sm:h-[126px]" ... />
```

모바일과 데스크탑 모두 썸네일이 더 크고 선명하게 표시된다. 이미지가 없는 포스트에는 영향 없다.

---

## 2. 브라우저 탭 타이틀 형식 변경

**파일:** `src/layouts/Layout.astro`

기본 설정은 모든 페이지에서 단순히 `SITE.title`만 보여준다. 홈과 포스트 페이지를 구분하고, 포스트에서는 글 제목이 탭에 보이도록 변경한다.

`Layout.astro`의 frontmatter 아래에 `pageTitle` 변수를 추가한다.

```astro
---
// ... 기존 import 및 props 코드 ...

const pageTitle =
  title !== SITE.title
    ? `${title} | ${SITE.title}`
    : `${SITE.title} | ${SITE.desc}`;
---
```

그다음 `<title>` 태그와 `<meta name="title">` 두 곳에 기존 값 대신 `{pageTitle}`을 사용한다.

```astro
<title>{pageTitle}</title>
<meta name="title" content={pageTitle} />
```

결과는 다음과 같다.

- **홈 페이지:** `suko_yasa | 생각과 경험을 기록하는 공간`
- **포스트 페이지:** `포스트 제목 | suko_yasa`

`SITE.desc`는 `src/config.ts`의 `desc` 필드 값이다. 블로그 설명을 잘 써두면 홈 탭 타이틀에 그대로 나온다.

---

## 3. 파비콘 경로 수정 및 다중 형식 지원

**파일:** `src/layouts/Layout.astro`

GitHub Pages나 하위 경로 배포 환경에서 AstroPaper 기본 파비콘 경로(`/favicon.svg`)는 `base` URL이 적용되지 않아 프로덕션에서 파비콘이 표시되지 않는 문제가 있다. `import.meta.env.BASE_URL`을 이용해 경로를 동적으로 만든다.

```html
<!-- 변경 전 -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

<!-- 변경 후 -->
<link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />
<link rel="shortcut icon" href={`${import.meta.env.BASE_URL}favicon.svg`} />
<link rel="apple-touch-icon" href={`${import.meta.env.BASE_URL}apple-touch-icon.png`} />
```

아이콘을 바꾸려면 다음 두 파일을 교체하면 된다.

- `public/favicon.svg` — 원하는 SVG 파일로 교체
- `public/apple-touch-icon.png` — 180×180px PNG 파일 추가 (iOS 홈 화면 아이콘)

---

## 4. OG 이미지 개선 — 설명·작성자·URL 추가

**파일:** `src/utils/og-templates/post.js`

SNS에 포스트를 공유하면 OG 이미지가 미리보기로 표시된다. AstroPaper 기본 OG 이미지는 제목만 크게 보여주는데, 여기에 포스트 설명(`description`), 작성자 이름, 사이트 URL을 추가하면 훨씬 풍부한 미리보기가 만들어진다.

`post.js`에서 `post.data`를 구조분해할 때 `description`과 `author`를 꺼내고, satori 트리에 요소를 추가한다.

```javascript
export default async post => {
  const { title, description, author } = post.data;
  const postAuthor = author || SITE.author;
  const postDesc = description || "";
  const siteHostname = new URL(SITE.website).hostname;

  return satori(
    {
      type: "div",
      props: {
        // ... 외부 컨테이너 ...
        children: [
          // 제목
          {
            type: "p",
            props: {
              style: { fontSize: 64, fontWeight: "bold", marginBottom: "16px" },
              children: title,
            },
          },
          // 설명 (있을 경우에만 렌더링)
          ...(postDesc
            ? [
                {
                  type: "p",
                  props: {
                    style: { fontSize: 28, color: "#666", lineHeight: 1.5 },
                    children: postDesc,
                  },
                },
              ]
            : []),
          // 하단: 작성자(좌) + URL(우)
          {
            type: "div",
            props: {
              style: { display: "flex", justifyContent: "space-between" },
              children: [
                { type: "span", props: { children: postAuthor } },
                { type: "span", props: { children: siteHostname } },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: await loadGoogleFonts(title + postDesc + postAuthor + SITE.title),
    }
  );
};
```

`description`이 있는 포스트와 없는 포스트 모두 자연스럽게 처리된다.

---

## 5. 한글 제목 썸네일 깨짐 수정 — Noto Sans KR 추가

**파일:** `src/utils/loadGoogleFont.ts`

OG 이미지 생성에 기본으로 쓰이는 IBM Plex Mono 폰트는 한글을 지원하지 않는다. 한글 제목 포스트의 OG 이미지를 보면 글자가 전부 네모박스(□□□)로 나온다.

해결책은 텍스트에 한글이 포함돼 있을 때만 Noto Sans KR 폰트를 동적으로 추가 로드하는 것이다.

`loadGoogleFont.ts`에 한글 감지 함수를 추가한다.

```typescript
function hasKorean(text: string): boolean {
  return /[\u3131-\u3163\uac00-\ud7a3]/.test(text);
}
```

그다음 `loadGoogleFonts` 함수 내에서 한글이 감지되면 `Noto+Sans+KR` 폰트를 추가로 요청한다.

```typescript
export default async function loadGoogleFonts(text: string) {
  const fonts = [];

  // 기본 폰트 (IBM Plex Mono)
  const ibmFontData = await fetchFont("IBM+Plex+Mono", text);
  if (ibmFontData) {
    fonts.push({
      name: "IBM Plex Mono",
      data: ibmFontData,
      style: "normal",
    });
  }

  // 한글이 있으면 Noto Sans KR 추가
  if (hasKorean(text)) {
    const koreanFontData = await fetchFont("Noto+Sans+KR", text);
    if (koreanFontData) {
      fonts.push({
        name: "Noto Sans KR",
        data: koreanFontData,
        style: "normal",
      });
    }
  }

  return fonts;
}
```

에러 처리도 함께 강화해두면 폰트 로드 실패 시 빌드가 중단되지 않는다. Google Fonts API 요청 시 `woff2` 대신 `truetype` 형식을 요청하면 satori와의 호환성이 더 좋다.

---

## 6. Giscus 댓글 활성화

**파일:** `src/config.ts`

AstroPaper v5는 Giscus 연동을 기본 지원한다. 설정 파일에서 `enabled: true`만 바꾸면 되지만, 그 전에 준비할 것이 있다.

**사전 준비:**

1. GitHub 레포 Settings → Features → **Discussions 체크박스 활성화**
2. [giscus.app](https://giscus.app)에 접속해 레포를 연동하면 `repoId`와 `categoryId`를 발급받는다
3. 발급받은 값을 `src/config.ts`의 `GISCUS` 객체에 입력

```typescript
// src/config.ts
export const GISCUS: GiscusProps = {
  repo: "username/repo-name",
  repoId: "R_xxxxxxxx",           // giscus.app에서 발급
  category: "Announcements",
  categoryId: "DIC_xxxxxxxx",      // giscus.app에서 발급
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "ko",
  theme: "preferred_color_scheme",
  enabled: true,                   // false → true 로 변경
};
```

`enabled: false`에서 `true`로 바꾸면 포스트 하단에 댓글 창이 표시된다. Discussions가 활성화되지 않은 상태에서 `true`로 바꾸면 댓글 창이 오류를 표시하니 순서대로 진행할 것.

---

## 7. 모바일 다크모드 기본값 설정

**파일:** `src/layouts/Layout.astro`

AstroPaper는 사용자의 OS 테마 설정을 따라가도록 되어 있다. 문제는 `initialColorScheme` 변수가 빈 문자열로 초기화되어 있어, OS가 라이트 모드인 모바일 사용자는 흰 배경의 블로그를 보게 된다는 것이다.

처음 방문하는 모든 사용자가 다크모드로 시작하게 하려면 이 기본값을 `"dark"`로 바꾼다.

```astro
<!-- 변경 전 -->
const initialColorScheme = "";

<!-- 변경 후 -->
const initialColorScheme = "dark";
```

이렇게 하면 최초 방문 시 다크모드가 적용된다. 사용자가 수동으로 라이트 모드로 전환하면 그 설정이 `localStorage`에 저장돼 이후 방문에서도 유지된다.

---

## 마치며

7가지 수정 중 가장 효과가 컸던 건 한글 폰트 수정과 파비콘 경로 수정이다. 두 가지 모두 "왜 안 되지?" 하고 시간을 쓰다 원인을 찾아 해결한 케이스라 기억에 남는다.

OG 이미지 개선은 직접적인 UX 차이는 작지만, SNS나 메신저로 글을 공유했을 때 미리보기가 풍부하게 나오는 게 만족스럽다.

레퍼런스가 된 [flowkater.io](https://flowkater.io)에 감사를 표한다. 코드를 직접 보여주는 블로그 덕분에 빠르게 방향을 잡을 수 있었다.
