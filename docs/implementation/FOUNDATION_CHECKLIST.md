# 공통 기반 마무리 체크리스트

기준일: 2026-09-15  
대상 브랜치: `codex/app-foundation`

## 이번 커밋에 포함할 항목

- [x] Next.js App Router + TypeScript 실행 환경
- [x] Tailwind CSS와 기획안 기준의 검정·핑크 UI 토큰
- [x] Responsive Web/PWA manifest와 임시 아이콘
- [x] 공통 AppShell, Card, Button, Badge, Field, 상태 안내
- [x] Challenge / Login / Home / Mission Board / Mission Detail / Camera Preview / Score Result 화면 골격
- [x] 화면 간 동일 Mission ID·상태 계약
- [x] `/preview` fixture와 실제 `/home` 보호 경로 분리
- [x] Supabase SSR client, PKCE callback, Google OAuth 시작 코드
- [x] 환경변수 예시와 비밀값 차단 기준
- [x] CI, 타입 검사, lint, format, build, 모바일 E2E smoke 테스트
- [x] 개발·브랜치·역할 인계 문서
- [ ] Git 커밋·push: 로컬 Git 메타데이터 권한 문제로 다음 턴에 수행

## 커밋 전 확인할 결정

- [확정] 기술 스택: Next.js App Router/TypeScript, Tailwind, Next.js Server Actions/Route Handlers, Supabase Postgres/Auth/Private Storage/RLS, Vercel, Responsive Web/PWA.
- [확정] 첫 로그인: Google OAuth. 기존 이메일 OTP 기본안보다 이번 PO 요청을 우선한다. 다른 제공자·Operator MFA 변경은 별도 결정.
- [확정] UI 방향: 제공된 `proovit_기획안_f.pptx`의 모바일 화면을 참고한 검정·핑크·둥근 카드·캐릭터 스타일.
- [확정] 미리보기: 저장하지 않는 `/preview`에서만 fixture를 사용하고 기본 환경에서는 404.
- [미정] 실제 Supabase 프로젝트 생성·Google Cloud OAuth client·Supabase Provider 설정·redirect allow-list.
- [미정] 참가 과정에서 Project 설정을 포함할지 여부.
- [미정] 실제 31개 Mission 콘텐츠와 Challenge 기간.
- [후속] Participant/Challenge/Mission/Proof/Score Event schema, RLS, private storage lifecycle, idempotency와 score atomicity.
- [후속] 실제 카메라 권한·capture·재촬영·파일 기술 검증.
- [후속] Ranking Snapshot, Final Submission, Reward Eligibility.
- [확인 필요] 제공된 PPTX 캐릭터의 출시 사용 권한.

## 검증 결과

실행 환경: Node 24.21.0, npm 11.19.0, Windows workspace.

- `npm run check`: 통과 (typecheck, ESLint, Prettier)
- `npm run build`: 통과 (Next.js production compilation/typecheck)
- `git diff --check`: 통과
- `npm run test:e2e`: 1차 실행에서 Next.js not-found 응답의 상태 코드와 route announcer의 중복 role을 확인해 테스트를 보완했다. 최종 실행 결과는 커밋 전 다시 기록한다.
- 실제 Google 로그인: Supabase/Google 외부 설정 전이므로 미검증.
- 실제 DB/RLS/Storage/Camera/Score: 구현 범위 밖이며 미검증.

## 사람 리뷰 인계

사람 Reviewer는 다음을 확인한 뒤 PR을 승인한다.

1. `npm ci` 후 `ENABLE_UI_PREVIEW=true`로 `/preview/home`의 전체 이동 흐름을 확인한다.
2. `src/lib/contracts.ts`와 `src/lib/routes.ts` 변경이 A·B 작업의 공통 약속과 맞는지 확인한다.
3. 실제 데이터·점수·사진 저장으로 오인할 문구가 없는지 확인한다.
4. `/home` 인증 보호와 OAuth callback의 고정 origin 이동을 확인한다.
5. 기획안의 AI·상금·실시간 랭킹을 P0 기능으로 끌어오지 않았는지 확인한다.
6. 수정이 필요한 경우 파일과 줄, 사용자 영향, 최소 수정안을 PR에 기록한다.

이 체크리스트의 통과는 사람 리뷰·CI·`main` 병합을 대신하지 않는다.
