---
title: "이 블로그 사용법 완전 가이드 — Obsidian으로 쓰고 자동 배포까지"
author: suko_yasa
pubDatetime: 2026-04-14T12:00:00+09:00
modDatetime: 2026-04-14T18:30:22+09:00
description: "Obsidian에서 글을 쓰고 GitHub Actions로 자동 배포되는 블로그 워크플로우 전체 정리"
category: 블로그
tags:
  - 블로그
  - Obsidian
  - 사용법
  - 가이드
featured: true
draft: false
---

> **핵심 요약**
>
> - Obsidian에서 글 쓰면 5분마다 GitHub에 자동 업로드, 최대 8분 안에 블로그에 반영된다
> - 파일명은 영어 소문자 + 하이픈, frontmatter는 Templater가 자동으로 채워준다
> - 급할 땐 `Cmd+P` → `commit-and-sync`로 즉시 배포할 수 있다

## Table of contents

## 처음 설정 — 딱 한 번만 하면 된다

새 Obsidian 볼트(astro-blog)를 열었다면 플러그인 두 개를 먼저 설치해야 한다. 이 설정이 끝나면 이후 모든 작업이 자동화된다.

### 1단계: Obsidian Git 설치 (자동 업로드)

Obsidian Git은 글을 저장할 때마다 일정 간격으로 GitHub에 자동 커밋·푸시해주는 플러그인이다.

1. Obsidian 설정(⚙️) → **커뮤니티 플러그인**
2. **제한 모드 끄기** 클릭
3. 탐색 버튼 → `Obsidian Git` 검색 → 설치 → 활성화
4. 설정 → Obsidian Git → **Auto commit-and-sync interval**: `5` 입력

설정 후에는 5분마다 자동으로 GitHub에 업로드된다.

### 2단계: Templater 설치 (frontmatter 자동 입력)

Templater는 새 파일을 만들 때 frontmatter 양식을 자동으로 채워주는 플러그인이다.

1. 탐색 버튼 → `Templater` 검색 → 설치 → 활성화
2. 설정 → Templater
3. **Template folder location** 항목에 `templates` 입력
4. **Trigger Templater on new file creation** → 켜기
5. 아래로 스크롤 → **Folder Templates** → `+` 버튼
   - Folder: `src/data/blog`
   - Template: `templates/새글`

이제 `src/data/blog` 안에 새 파일을 만들면 frontmatter가 자동으로 채워진다.

---

## 글 쓰는 전체 흐름

설정이 끝났다면 이후 글쓰기 흐름은 다음과 같다.

```
① src/data/blog/ 안에 새 파일 생성
② frontmatter 자동 채워짐 → title, description, category, tags 수정
③ 본문 작성 → Cmd+S 저장
④ 최대 8분 후 블로그 반영
   (즉시 올리려면: Cmd+P → commit-and-sync)
```

> **핵심:** 글을 쓰고 저장만 하면 나머지는 자동이다. 배포를 위해 터미널을 열 필요가 없다.

블로그 주소: https://rjsdn613kr1.github.io/astro-blog/
배포 상태 확인: https://github.com/rjsdn613kr1/astro-blog/actions

---

## 글 파일 만들기

Obsidian 왼쪽 파일 목록에서 `src` → `data` → `blog` 폴더에 우클릭 → **새 노트**

### 파일명 규칙

파일명은 URL에 그대로 사용되기 때문에 규칙을 지켜야 한다.

| 구분 | 예시 |
|------|------|
| 좋은 예 | `tokyo-trip.md`, `2026-book-review.md` |
| 나쁜 예 | `도쿄 여행.md`, `독서감상문.md` |

- 영어 소문자로 쓸 것 (한글은 URL에서 깨질 수 있음)
- 띄어쓰기 대신 `-` 사용

---

## frontmatter 작성법

파일을 만들면 아래가 자동으로 채워진다 (Templater 설정 후):

```yaml
---
title: tokyo-trip          # 파일명이 자동으로 들어감
author: suko_yasa
pubDatetime: 2026-04-14T12:00:00+09:00   # 현재 시각 자동
modDatetime: 2026-04-14T18:30:22+09:00
description: ""
tags: []
draft: false
---
```

자동 입력된 값 중 아래 항목을 직접 수정한다.

| 항목 | 설명 |
|------|------|
| `title` | 블로그에 표시되는 제목 (예: 도쿄 여행 3박 4일) |
| `description` | 글 목록에 나오는 한 줄 요약 (50~160자 권장) |
| `category` | 큰 분류, 하나만 입력 |
| `tags` | 세부 태그, 여러 개 가능 |
| `draft` | `false` = 공개, `true` = 비공개 |
| `featured` | `true` = 홈 상단 Featured 섹션에 고정 |
| `ogImage` | 카드 썸네일 + SNS 공유 이미지 |

### 완성 예시

```yaml
---
title: 도쿄 여행 3박 4일
author: suko_yasa
pubDatetime: 2026-04-02T14:30:00+09:00
modDatetime: 2026-04-14T18:30:22+09:00
description: 처음 가본 도쿄, 먹고 걷고 사진 찍은 기록
category: 에세이
tags:
  - 여행
  - 일본
featured: false
draft: false
---
```

### tags 작성법

```yaml
# 태그가 없을 때
tags: []

# 태그가 하나일 때
tags:
  - 여행

# 태그가 여러 개일 때
tags:
  - 여행
  - 일본
  - 2026
```

### Featured 글 설정

frontmatter에 `featured: true`를 추가하면 홈페이지 최상단 "Featured" 섹션에 표시된다.

- Featured 글이 1개 이상 있으면 홈에 "Featured" 섹션이 생긴다
- 여러 개를 `featured: true`로 설정 가능
- `featured: false` 또는 항목 삭제 시 일반 "Recent Posts"로 이동

### 최종 수정일 표시 (modDatetime)

글을 수정하면 블로그에 "Updated: 날짜"가 표시된다.

- **Claude Code로 수정할 경우:** `modDatetime`이 자동으로 현재 시각으로 갱신된다. 따로 입력하지 않아도 된다.
- **Obsidian에서 직접 수정할 경우:** frontmatter에 수정 시각을 직접 입력한다.

> **주의:** `modDatetime`이 `pubDatetime`보다 나중 날짜여야 "Updated:" 표시가 나타난다.

### 썸네일 설정 (ogImage)

ogImage는 두 가지 역할을 한다.

1. 메인 페이지 카드 썸네일
2. SNS·메신저 공유 시 미리보기 (카카오톡, Discord, Twitter 등)

ogImage를 설정하지 않으면 자동 생성된 흑백 텍스트 이미지가 사용된다.

**방법 1: 외부 URL 사용 (빠르고 간편)**

```yaml
ogImage: "https://images.unsplash.com/photo-xxxxx?w=1200"
```

**방법 2: 로컬 이미지 사용**

1. 이미지를 Obsidian 글 편집 화면에 드래그 앤 드롭 → `src/data/blog/images/`에 자동 저장
2. frontmatter에 경로 입력

```yaml
ogImage: ./images/tokyo-thumbnail.jpg
```

권장 크기: **1200×630px**, PNG 또는 JPG

---

## 본문 꾸미는 법 (마크다운)

### 기본 문법

```markdown
# 제목 (H1)
## 소제목 (H2)
### 소소제목 (H3)

**굵게**  *기울임*  ~~취소선~~  `코드 글씨`

- 항목 1
- 항목 2

1. 번호 목록
2. 번호 목록

> 인용구

---  (구분선)

[링크 텍스트](https://주소)

| 열1 | 열2 |
|-----|-----|
| 값1 | 값2 |
```

### 코드 블록

백틱 3개 + 언어명으로 문법 강조가 적용된다.

````markdown
```python
print("Hello, World!")
```

```bash
git commit -m "새 글 추가"
```
````

### 핵심 요약 박스

글 맨 위에 다음 형식의 요약 박스를 배치하면 독자가 핵심을 빠르게 파악할 수 있다.

```markdown
> **핵심 요약**
>
> - 요점 1
> - 요점 2
> - 요점 3
```

### 목차 자동 생성

글 안에 `## Table of contents` 제목을 쓰면 자동으로 접이식 목차 박스가 생성된다.

```markdown
## Table of contents
```

---

## 이미지 첨부하는 법

**방법 1: 드래그 앤 드롭 (추천)**

Finder에서 사진 파일을 Obsidian 글 편집 화면으로 끌어다 놓으면 `src/data/blog/images/`에 자동 저장된다.

**방법 2: 복사 붙여넣기**

스크린샷(`Cmd+Shift+4`) 후 `Cmd+V`

**이미지 크기 조절**

```markdown
![[사진.jpg|500]]   # 가로 500px로 표시
```

---

## 카테고리와 태그

- **카테고리:** 글 하나당 하나만, 홈페이지에서 카테고리별로 묶여서 표시
- **태그:** 여러 개 가능, 상단 Tags 메뉴에서 확인

폴더로 카테고리를 구분해서 정리할 수도 있다.

```
blog/
  에세이/
  스터디/
  images/   ← 이미지는 여기에 자동 저장
```

---

## 비공개 글 처리

| 방법 | 설명 |
|------|------|
| 임시저장 | `draft: true` 설정 |
| 영구 비공개 | `src/data/blog/private/` 폴더 안에 파일 이동 |

---

## 글 수정 및 삭제

- **수정:** 파일 열고 수정 → `Cmd+S` → 자동 배포
- **삭제:** 파일 우클릭 → 삭제 → 자동 배포

---

## 즉시 배포하기

5분 자동 배포를 기다리지 않고 즉시 올리고 싶을 때:

```
Cmd+P → commit-and-sync → 엔터
```

배포 후 상태 확인: https://github.com/rjsdn613kr1/astro-blog/actions

| 표시 | 의미 |
|------|------|
| 초록색 체크 | 배포 완료 |
| 노란색 원 | 진행 중 (2~3분 대기) |
| 빨간색 X | 오류 발생 |

---

## 블로그 설정 변경

`src/config.ts` 파일을 VSCode로 열어서 수정한다.

```typescript
title: "블로그 제목",
author: "작성자 이름",
desc: "블로그 설명",
postPerIndex: 4,   // 홈에 표시할 글 수
```

소개 페이지는 `src/pages/about.md` 파일을 Obsidian에서 열어서 수정한다. 맨 위 `---` 부분(frontmatter)은 건드리지 않는다.

---

## 문제 해결

| 증상 | 해결법 |
|------|--------|
| 새 파일 만들어도 frontmatter 안 나옴 | Templater 설치 과정 다시 확인 |
| 글이 8분 지나도 안 보임 | `draft: false`인지 확인 |
| 자동 업로드 안 됨 | Obsidian Git 설치 확인, 또는 `Cmd+P` → `commit-and-sync` 수동 실행 |
| 이미지가 블로그에서 안 보임 | 드래그 앤 드롭으로 다시 첨부 |
| 배포 실패 메일 옴 | actions 페이지에서 오류 내용 확인 |
| 블로그 링크 404 뜸 | 2~3분 기다린 후 새로고침 |
| 카드 썸네일이 안 보임 | frontmatter에 `ogImage` 설정 |
| "Updated:"가 안 나옴 | `modDatetime`이 `pubDatetime`보다 나중인지 확인 |
