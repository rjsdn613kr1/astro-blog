---
name: blog
description: "AstroPaper 블로그 작업의 메인 오케스트레이터. 블로그 글 쓰기, 편집, 발행 전 검토, 블로그 설정/레이아웃 변경 등 블로그 관련 모든 요청의 진입점. '블로그 글 써줘', '이 글 검토해줘', '포스트 수정', '블로그 설정' 등 요청 시 이 스킬을 사용할 것."
---

## 실행 모드: 서브 에이전트 (general-purpose 타입)

**핵심:** 커스텀 에이전트(`.claude/agents/`)는 `subagent_type`으로 직접 호출 불가.
올바른 패턴 — Agent 호출 전에 정의 파일을 Read하고, 내용을 프롬프트에 임베드한다.

```
① Read /Users/ggoungwoo/Desktop/astro-blog/.claude/agents/blog-writer.md   ← 에이전트 정의
② Read /Users/ggoungwoo/Desktop/astro-blog/.claude/skills/write-post/SKILL.md ← 스킬 가이드
③ Agent(subagent_type: "general-purpose", model: "sonnet",
        prompt: "[①의 내용]\n\n[②의 내용]\n\n[실제 작업 지시]")
```

---

## 요청 유형별 워크플로우

### A. 새 글 작성 + 검토

**트리거:** "~에 대한 글 써줘", "새 포스트 만들어줘"

```
Phase 1 — 컨텍스트 로드 (병렬):
  Read .claude/agents/blog-writer.md
  Read .claude/skills/write-post/SKILL.md

Phase 2 — 작성:
  Agent(subagent_type: "general-purpose", model: "sonnet",
        prompt: """
          [blog-writer.md 전체 내용]
          ---
          [write-post/SKILL.md 전체 내용]
          ---
          위 역할과 스킬 기준으로 다음 포스트를 작성한다:
          주제: {주제}
          출력 경로: /Users/ggoungwoo/Desktop/astro-blog/src/data/blog/{파일명}.md
        """)

Phase 3 — 검토 컨텍스트 로드 (병렬):
  Read .claude/agents/blog-reviewer.md
  Read .claude/skills/review-post/SKILL.md

Phase 4 — 검토:
  Agent(subagent_type: "Explore", model: "sonnet",
        prompt: """
          [blog-reviewer.md 전체 내용]
          ---
          [review-post/SKILL.md 전체 내용]
          ---
          위 역할과 스킬 기준으로 다음 파일을 검토한다:
          /Users/ggoungwoo/Desktop/astro-blog/src/data/blog/{파일명}.md
        """)

Phase 5 — 🚨 이슈 있으면 blog-writer로 수정 후 재검토
Phase 6 — 사용자에게 완성 파일 경로 + 검토 결과 보고
```

### B. 기존 글 편집

**트리거:** "이 글 수정해줘", 파일 경로 + 수정 지시

```
Phase 1 — 컨텍스트 로드 (병렬):
  Read .claude/agents/blog-writer.md
  Read .claude/skills/write-post/SKILL.md
  Read {대상 파일}

Phase 2 — 수정:
  Agent(subagent_type: "general-purpose", model: "sonnet",
        prompt: "[blog-writer.md]\n---\n[write-post/SKILL.md]\n---\n수정 지시: {지시}")
```

> 한두 줄 수정은 Agent 없이 직접 Edit 사용

### C. 발행 전 품질 검토

**트리거:** "이 글 검토해줘", "발행해도 될까"

```
Phase 1 — 컨텍스트 로드 (병렬):
  Read .claude/agents/blog-reviewer.md
  Read .claude/skills/review-post/SKILL.md

Phase 2 — 검토:
  Agent(subagent_type: "Explore", model: "sonnet",
        prompt: "[blog-reviewer.md]\n---\n[review-post/SKILL.md]\n---\n검토 대상: {파일경로}")
```

### D. 블로그 코드/설정 변경

관련 파일을 Read 후 직접 Edit. Agent 불필요.

---

## 에러 핸들링

| 상황 | 처리 |
|------|------|
| 파일 경로 불명확 | Glob(`src/data/blog/**/*.md`)으로 후보 제시 |
| 🚨 블로커 이슈 발생 | 사용자 확인 후 수정 진행 |

---

## 테스트 시나리오

**정상:** "일본 여행기 글 써줘"
→ blog-writer(general-purpose+write-post 스킬 임베드) 작성
→ blog-reviewer(Explore+review-post 스킬 임베드) 검토
→ 이슈 없으면 완료 보고

**에러:** 파일 경로 없이 "이 글 검토해줘"
→ `src/data/blog/` 최근 파일 5개 목록 제시 → 선택 후 진행
