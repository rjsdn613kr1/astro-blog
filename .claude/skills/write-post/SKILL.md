---
name: write-post
description: "AstroPaper 블로그 포스트 작성 완전 가이드. 새 글 쓰기, 기존 글 편집, frontmatter 설정, 핵심 요약 박스, 목차, SEO 최적화 등 포스트 작성에 관한 모든 작업 시 반드시 이 스킬을 사용할 것."
---

## 포스트 파일 위치

- **디렉토리:** `src/data/blog/`
- **파일명:** 영어 소문자 + 하이픈 (URL에 그대로 사용됨)
  - ✅ `2026-tokyo-trip.md`, `ai-tools-review.md`
  - ❌ `도쿄여행.md`, `AI 도구 리뷰.md`

---

## frontmatter 체크리스트

```yaml
---
title: 제목 (한국어 가능, 클릭을 유도하는 문구)
author: suko_yasa
pubDatetime: 2026-04-04T10:00:00+09:00   # ISO 8601, 반드시 +09:00
modDatetime:                               # 수정 시 hook이 자동 갱신 — 비워둬도 됨
description: "한 줄 요약 50~160자"         # SEO에 직결 — 반드시 채울 것
category: 에세이                           # 선택, 단일값
tags:
  - 태그1
  - 태그2                                  # 2~5개 권장
featured: false                            # true = 홈 상단 Featured 섹션에 고정
ogImage: ./images/썸네일.jpg               # 선택, SNS 공유 미리보기 (1200×630px 권장)
draft: false                               # true = 비공개
---
```

**필수:** `title`, `pubDatetime`
**반드시 채울 것:** `description` (비우면 SEO 손실)
**적극 권장:** `tags`, `category`, `ogImage`

---

## 포스트 구조 템플릿

### 기본 골격

```markdown
> **📌 핵심 요약**
>
> - 이 글에서 얻어갈 것 1
> - 이 글에서 얻어갈 것 2
> - 이 글에서 얻어갈 것 3

## Table of contents

## 들어가며

...

## 1. 첫 번째 주제

...

## 2. 두 번째 주제

...

## 마치며

...
```

### 구조 원칙

| 요소 | 방법 | 이유 |
|------|------|------|
| **핵심 요약 박스** | `>` 인용구 문법 | 독자가 3줄로 핵심 파악, 클릭 후 이탈 방지 |
| **목차** | `## Table of contents` 제목 | 자동 생성 + 접이식 박스로 표시 |
| **섹션 번호** | `## 1. 제목` | 2000자 이상 긴 글에서 가독성 향상 |
| **강조 인용구** | `> **핵심:**` | 핵심 문장을 시각적으로 분리 |

---

## 이미지 처리

```markdown
# 본문 이미지
![이미지 설명](./images/파일명.jpg)

# frontmatter ogImage (SNS 썸네일)
ogImage: ./images/썸네일.jpg
```

- 이미지 파일은 `src/data/blog/images/` 에 저장
- ogImage 권장 크기: **1200×630px**
- 형식: PNG 또는 JPG

---

## SEO 체크리스트

작성 후 아래를 확인한다:

- [ ] `description`이 50~160자인가?
- [ ] `title`이 독자의 호기심을 자극하는가?
- [ ] `tags`가 2~5개인가?
- [ ] `ogImage`가 있는가? (없으면 자동 생성 이미지 사용)
- [ ] 핵심 요약 박스가 본문 맨 위에 있는가?

---

## 자주 쓰는 마크다운 패턴

```markdown
# 핵심 요약 박스
> **📌 핵심 요약**
>
> - 요점 1
> - 요점 2

# 중요 문장 강조
> **핵심:** 도구를 아는 것과 도구를 활용하는 것은 다르다.

# FAQ 섹션
**Q. 질문 내용은?**
답변 내용...

# 참고 자료
## 참고 자료
1. [제목](https://링크) — 출처
```
