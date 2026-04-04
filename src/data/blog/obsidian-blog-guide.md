---
title: Obsidian으로 블로그 글 쓰는 법 — suko_yasa의 실제 워크플로우
author: suko_yasa
pubDatetime: 2026-04-04T12:00:00+09:00
modDatetime:
description: "Obsidian에서 글 쓰고 Git으로 자동 배포까지 — 이 블로그의 실제 글쓰기 흐름을 처음부터 따라할 수 있게 정리했다."
category: 도구
tags:
  - obsidian
  - 블로그
  - 글쓰기
featured: false
draft: false
---

> **📌 핵심 요약**
>
> - Obsidian은 로컬 마크다운 파일을 기반으로 하는 노트 앱으로, 블로그 글쓰기에 딱 맞다
> - Templater 플러그인으로 frontmatter를 자동으로 채워서 매번 반복 입력을 줄인다
> - Obsidian Git 플러그인으로 저장하는 순간 GitHub에 푸시되고 블로그에 자동 배포된다
> - 이미지는 드래그앤드롭으로 붙여넣으면 알아서 경로가 잡힌다

## Table of contents

## 들어가며

블로그를 운영하다 보면 글쓰기 자체보다 환경을 세팅하는 데 더 많은 시간을 쓰게 된다. VS Code를 열고, 터미널에서 Git 명령어를 치고, 이미지 경로를 수동으로 넣고… 이 과정이 귀찮으면 결국 글을 안 쓰게 된다.

이 블로그(suko_yasa)는 Obsidian을 글쓰기 환경으로 쓰고 있다. Obsidian은 마크다운 기반 노트 앱인데, 플러그인 생태계가 풍부해서 블로그 워크플로우를 꽤 쾌적하게 만들 수 있다. 이 글에서는 설치부터 자동 배포까지 실제로 쓰는 방식을 그대로 정리한다.

## 1. Obsidian이 블로그 글쓰기에 맞는 이유

Obsidian의 가장 큰 특징은 **모든 데이터가 로컬 마크다운 파일**이라는 점이다. 전용 포맷이나 클라우드 서버에 데이터를 가두지 않는다. 내 컴퓨터 폴더에 `.md` 파일로 저장된다.

AstroPaper 같은 Astro 기반 블로그는 마크다운 파일을 그대로 포스트로 변환한다. 즉, Obsidian에서 글을 쓰고 저장하면 그게 바로 블로그 포스트 원본이 된다. 별도의 변환 과정이 필요 없다.

> **핵심:** Obsidian vault(보관함) 위치를 블로그 저장소 안의 `src/data/blog/` 폴더로 잡으면, Obsidian에서 쓴 글이 곧 블로그 포스트다.

## 2. 설치 및 기본 설정

### Obsidian 설치

[obsidian.md](https://obsidian.md)에서 운영체제에 맞는 버전을 내려받는다. macOS, Windows, Linux 모두 지원한다.

설치 후 "Open folder as vault"를 선택해서 블로그 저장소 전체를 vault로 열거나, `src/data/blog/` 폴더만 vault로 열면 된다.

이 블로그는 저장소 전체를 vault로 열고, 글 작성 기본 폴더를 `src/data/blog/`로 지정하는 방식을 쓴다.

**기본 폴더 설정 방법:**
설정(⚙️) → Files & Links → Default location for new notes → `src/data/blog` 입력

### 이미지 첨부 경로 설정

이미지를 드래그앤드롭으로 붙여넣을 때 저장 위치를 지정해 둬야 한다.

설정 → Files & Links → Default location for new attachments → `src/data/blog/images` (또는 원하는 경로)

이렇게 설정해 두면 이미지를 Obsidian 편집 화면에 끌어다 놓는 것만으로:

1. 이미지 파일이 지정 폴더에 자동으로 복사된다
2. 마크다운 문서에 해당 경로로 이미지 링크가 자동 삽입된다

별도로 경로를 입력하거나 파일을 복사할 필요가 없다.

## 3. Templater로 frontmatter 자동화

AstroPaper 포스트에는 매번 frontmatter를 써야 한다. `title`, `pubDatetime`, `author`, `description` 등을 매번 손으로 치는 건 번거롭다. Templater 플러그인으로 이 과정을 자동화할 수 있다.

### Templater 설치

설정 → Community Plugins → Browse → "Templater" 검색 → 설치 및 활성화

설치 후 설정에서 Templates folder location을 지정한다. 이 블로그는 `src/data/blog/templates`를 사용한다.

### 템플릿 파일 만들기

`templates` 폴더 안에 `blog-post.md` 파일을 만들고 아래 내용을 넣는다.

```markdown
---
title: <% tp.file.title %>
author: suko_yasa
pubDatetime: <% tp.date.now("YYYY-MM-DDTHH:mm:ss+09:00") %>
modDatetime:
description: ""
category:
tags:
  -
featured: false
draft: true
---

> **📌 핵심 요약**
>
> -
> -
> -

## Table of contents

## 들어가며

## 마치며
```

`tp.file.title`은 파일 이름을, `tp.date.now(...)`는 현재 시각을 자동으로 채워준다.

### 템플릿 적용하기

새 포스트를 만들 때:

1. Obsidian에서 새 파일 생성 (파일명은 영어 소문자 + 하이픈, 예: `my-new-post.md`)
2. 명령 팔레트(Cmd+P) → "Templater: Insert Template" 실행
3. `blog-post` 선택

frontmatter가 현재 시각과 파일명으로 자동 채워진 상태로 시작할 수 있다.

> **핵심:** Templater의 "Trigger Templater on new file creation" 옵션을 켜면, 새 파일을 만들 때 자동으로 템플릿을 적용할 수도 있다.

## 4. 이미지 첨부 실전

글 작성 중 이미지를 넣고 싶을 때는 아래 방법 중 하나를 쓴다.

**방법 1 — 파인더에서 드래그앤드롭**
파인더(또는 탐색기)에서 이미지 파일을 Obsidian 편집 화면 위로 끌어다 놓는다.

**방법 2 — 클립보드 붙여넣기**
스크린샷을 찍은 후 Cmd+V로 붙여넣는다. Obsidian이 자동으로 파일을 저장하고 링크를 삽입한다.

두 방법 모두 앞서 설정한 `Default location for new attachments` 폴더에 파일이 저장되고, 마크다운에 링크가 자동으로 들어간다.

**주의할 점:** AstroPaper에서 이미지 경로를 올바르게 인식하려면 마크다운 링크 형식이 `![]()` 여야 한다. Obsidian 기본값은 Wiki 링크(`![[파일명]]`) 형식이므로 설정에서 변경해야 한다.

설정 → Files & Links → Use [[Wikilinks]] → 비활성화

이렇게 하면 `![이미지 설명](경로/파일.png)` 형식으로 삽입된다.

## 5. Obsidian Git으로 자동 배포

글을 쓰고 나서 터미널을 열어 `git add`, `git commit`, `git push`를 치는 과정도 자동화할 수 있다. Obsidian Git 플러그인이 이 역할을 한다.

### Obsidian Git 설치

설정 → Community Plugins → Browse → "Obsidian Git" 검색 → 설치 및 활성화

설치 전에 블로그 저장소가 Git 저장소로 초기화되어 있고, GitHub 등 원격 저장소와 연결되어 있어야 한다.

### 자동 커밋·푸시 설정

Obsidian Git 설정에서 주요 옵션을 조정한다.

| 설정 항목 | 권장값 | 설명 |
|---|---|---|
| Vault backup interval (minutes) | 10 | 10분마다 자동 커밋·푸시 |
| Auto pull interval (minutes) | 10 | 10분마다 자동 풀 |
| Commit message | `vault backup: {{date}}` | 커밋 메시지 형식 |
| Pull updates on startup | 활성화 | Obsidian 실행 시 최신 상태로 동기화 |

이 설정이 완료되면 Obsidian에서 글을 쓰고 저장하기만 해도 10분 안에 GitHub에 올라가고, Vercel이나 Netlify에 연결된 블로그는 자동으로 재빌드된다.

### 수동 커밋이 필요할 때

자동 커밋을 기다리지 않고 즉시 배포하고 싶을 때는 명령 팔레트(Cmd+P)에서 "Obsidian Git: Commit and push all changes"를 실행한다.

> **핵심:** 초안 상태(`draft: true`)인 포스트는 Git에 올라가도 블로그에 표시되지 않는다. 완성된 포스트는 `draft: false`로 바꾼 뒤 커밋하면 된다.

## 6. 전체 워크플로우 요약

실제로 이 블로그에서 글 하나를 쓰는 전체 흐름은 이렇다.

1. **Obsidian에서 새 파일 생성** — 파일명은 `영어-소문자-하이픈.md`
2. **Templater로 frontmatter 자동 입력** — 제목, 날짜, 기본 구조 채워짐
3. **글 작성** — 마크다운으로 본문 작성, 이미지는 드래그앤드롭
4. **frontmatter 마무리** — `description`, `tags`, `category` 채우기
5. **`draft: false`로 변경** — 발행 준비 완료
6. **자동 커밋·푸시** — Obsidian Git이 알아서 GitHub에 올림
7. **블로그 자동 배포** — Vercel/Netlify가 변경 감지 후 재빌드

중간에 터미널을 한 번도 열지 않아도 된다. Obsidian 안에서 글쓰기부터 배포까지 완결된다.

## 마치며

Obsidian은 단순한 노트 앱이 아니다. 플러그인을 조합하면 마크다운 블로그를 위한 꽤 쓸 만한 CMS로 만들 수 있다. 특히 Templater와 Obsidian Git의 조합은 반복 작업을 줄이고 글쓰기 자체에 집중할 수 있게 해준다.

처음 세팅에 30분쯤 투자하면, 이후에는 Obsidian을 열고 쓰고 닫는 것만으로 블로그가 업데이트된다. 시도해 볼 만한 워크플로우다.
