---
title: 실제 데이터로 비교한 30년 포트폴리오 백테스트 대시보드
author: suko_yasa
pubDatetime: 2026-04-23T19:30:00+09:00
modDatetime:
description: "영구 포트폴리오, 올웨더, S&P500, 예금, 적금을 실제 데이터 프록시로 비교한 30년 백테스트 대시보드."
tags:
  - 포트폴리오
  - 백테스트
  - 자산배분
  - 투자
featured: true
draft: false
---

영구 포트폴리오, 올웨더 포트폴리오, S&P500, 예금(1년 반복), 적금을 한 화면에서 비교할 수 있게 대시보드로 정리했다.

- 비교 구간: 1995년 1월부터 2024년 12월까지
- 리밸런싱: 없음, 연 1회, 분기 1회, 2.5% 초과
- 시나리오: 일시금 투자, 월 적립 투자

주의할 점도 있다.

- ETF 기준으로는 GLD, DBC, IEF/TLT가 30년 전 존재하지 않았다.
- 그래서 이번 비교는 ETF 자체가 아니라 더 긴 실제 프록시 시계열을 사용했다.
- NH농협은행의 30년치 월별 평균 예금·적금 금리 공개 시계열은 안정적으로 확보하기 어려워서, 예금·적금은 한국의 공공 예금금리 시계열 프록시를 사용했다.

## 인터랙티브 대시보드

<div style="margin: 1.5rem 0; border: 1px solid rgba(120,120,120,0.2); border-radius: 18px; overflow: hidden; background: rgba(255,255,255,0.7);">
  <iframe
    src="/astro-blog/portfolio/"
    title="30년 포트폴리오 백테스트 대시보드"
    loading="lazy"
    style="width: 100%; min-height: 1800px; border: 0; display: block;"
  ></iframe>
</div>

iframe 안에서 잘 보이지 않거나 모바일에서 더 크게 보고 싶다면 아래 링크로 열면 된다.

[대시보드만 크게 보기](/astro-blog/portfolio/)
