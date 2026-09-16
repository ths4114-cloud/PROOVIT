# PROOVIT

PROOVIT은 사용자의 목표를 일일 Mission으로 전환하고, 앱 내 Camera Proof 제출을 Score와 Ranking에 반영하는 Goal Competition 서비스입니다.

첫 번째 제품 범위는 솔로프리너를 위한 31일 MVP 런칭 챌린지입니다.

## 현재 단계

- 저장소 및 4인 협업 환경 구성
- P0 MVP PRD와 제품 정책 PO 승인 완료
- 정식 서비스 AI Proof Monitoring은 후속 결정으로 분리
- 승인 정책 기준의 User Flow 작성
- 로우파이 와이어프레임 설계 예정

## 참가자 화면 실행

챌린지 소개, 이메일 OTP 로그인, 참가 상태, 오늘의 미션과 누적 점수를 표시하는 모바일 PWA가 구현되어 있습니다.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

`.env.local`에 Supabase의 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`와 표시할 `PROOVIT_CHALLENGE_SLUG`를 입력합니다. DB 구조와 개발용 데이터는 `supabase/migrations` 및 `supabase/seed.sql`에 있습니다. 자세한 설정과 검증 순서는 `docs/handoff/RUNBOOK.md`를 따릅니다.

Mac에서 데이터 연결 없이 화면만 확인하려면 `PROOVIT 화면보기.command`를 더블클릭합니다. 이 실행기는 로컬 테스트 데이터만 사용합니다.

## 협업 방식

- 구현 전 `AGENTS.md`와 `docs/DEFINITION_OF_READY.md`를 확인합니다.
- 기능과 문서 변경은 목적별 브랜치와 Pull Request로 진행합니다.
- `main`에 기능 코드를 직접 push하지 않습니다.
- 중요한 제품·기술 결정은 저장소의 결정 문서에 기록합니다.

## 문서

- AI 코딩 및 협업 지침: `AGENTS.md`
- 제품 요구사항: `docs/product/PRD.md`
- 사용자 흐름: `docs/product/USER_FLOWS.md`
- 공식 용어: `docs/product/GLOSSARY.md`
- Sprint 0 계획: `docs/sprint-0/SPRINT_0_PLAN.md`
- Sprint 0 결정 목록: `docs/sprint-0/DECISION_REGISTER.md`
- P0 제품 정책 결정: `docs/decisions/2026-09-12-p0-product-policy.md`
- P0 기술 기반 결정: `docs/decisions/2026-09-12-p0-technical-foundation.md`
- 구현 시작 조건: `docs/DEFINITION_OF_READY.md`
- 구현 완료 조건: `docs/DEFINITION_OF_DONE.md`
- 코드 리뷰 기준: `docs/CODE_REVIEW_CHECKLIST.md`
- 엔지니어링 가이드: `docs/ENGINEERING_GUIDE.md`
- 공통 기반 개발 안내: `docs/DEVELOPMENT.md`
- 공통 기반 체크리스트: `docs/implementation/FOUNDATION_CHECKLIST.md`
- 화면 계약 초안: `docs/implementation/API_CONTRACT.md`
