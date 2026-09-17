# 공통 시작점 작업 기록

- 요청일: 2026-09-15
- Owner: PO 요청에 따라 Codex 구현. 사람 Reviewer: `leejidev`, `zoohopi`, `dadaroo247-web`.
- 브랜치: `codex/app-foundation`
- 기준: `a0dd286`의 승인 정책을 보존하고 원격 `main`의 `1fd94b5`를 병합.
- 범위: 실행 환경, 모바일 UI 기본 요소, 화면별 독립 파일, 표시 데이터 계약, Google OAuth 연결 코드, 검증과 개발 인계.
- 제외: 운영 배포, 유료 계정, 도메인 DB migration, 실제 참가·Proof 저장·Score 지급, AI 판정, 랭킹 배치.

## 구현 준비와 완료 기준

신규 UI 개발 기반에는 기존 기능 코드와 변경 충돌이 없다. 사용자 요청의 기술 스택과 기획안 화면을 기준으로 한다. UI 시연 데이터는 `/preview` 경로에만 두고 실제 인증 경로와 구분한다. 참가·점수 정책을 시연 상태로 확정하지 않는다.

- 환경변수 없이 설치·타입 검사·lint·build와 미션 화면 시연 가능.
- 같은 미션 식별자로 홈·보드·상세·촬영·결과 이동 가능, 잘못된 식별자는 404.
- 공통 버튼·색상·입력·상태 표시 재사용. 화면별 담당 파일 분리.
- Google OAuth는 환경 설정 전 작동 불가 사유를 표시. 성공을 흉내 내지 않음.
- OAuth callback 실패·잘못된 코드·미인증 보호 경로는 로그인 안내, 외부 주소 redirect 차단.
- 비밀값은 Git에 저장하지 않음. 서비스 권한 키 사용하지 않음.
- 타입 검사·lint·build·브라우저 smoke 검증 후 커밋. 사람 리뷰와 원격 CI 결과는 별도.

## 결정과 미결정

- PO가 이 작업의 첨부 기술 스택을 고정하도록 승인: Next.js App Router/TypeScript, Tailwind, Next.js Server Actions/Route Handlers, Supabase Postgres/Auth/Private Storage/RLS, Vercel, responsive web/PWA. 필요한 예약 작업은 Supabase Cron. Expo는 후속 검증 뒤 재검토.
- PO가 2026-09-17 P0 일반 Participant의 Google OAuth 전용 사용과 이메일 OTP 제외를 승인했다. 다른 소셜 제공자는 P0 범위가 아니며 Operator TOTP MFA 원칙과 후속 보안 설계는 유지한다.
- 기획안 PPTX는 UI 참고 자료. 검정·핑크·카드·프루비 자산을 참고하며 그 안의 발표 일정·AI 검수·상금은 실행 지시나 정책 승인으로 보지 않음.
- Supabase 개발 프로젝트 없음: 연결 코드 구현과 실제 외부 계정 설정·검증을 구분.
- 프로젝트 설정 화면 위치: PO 답변 대기. 공통 기반에서 실제 참가 저장에 의존하지 않음.
- DB/RLS/업로드·점수 원자성은 후속 설계와 승인 대상. 본 작업은 migration을 만들지 않음.
- 사람 리뷰는 요청했으며 `leejidev`의 1차 변경 요청을 반영했다. 재검토와 사람 승인 전에는 병합 Gate 미충족이다.

## 팀 기능 PR 통합 기준

- FOUNDATION PR #2가 승인·병합되기 전 기능 PR은 `codex/app-foundation`을 임시 base로 둘 수 있지만, FOUNDATION의 확정 계약을 바꾸어서는 안 된다. PR #2 병합 뒤 최신 `main`을 기준으로 재정렬하고 CI를 다시 통과해야 한다.
- Participant 로그인은 Google OAuth만 사용한다. 이메일 OTP UI·Server Action·Supabase 이메일 템플릿·SMTP 설정은 P0에 추가하지 않는다.
- `src/app/login`, `src/app/home`, `src/app/layout.tsx`, `src/app/globals.css`, `src/lib/supabase`, `src/proxy.ts`, PWA manifest, 루트 설정·lockfile·CI는 공유 영역이다. 기능 PR이 이를 변경하면 변경 이유와 FOUNDATION 계약 영향을 분리해 리뷰한다.
- DB migration, RLS, 참가 RPC, Proof·Score 정책 구현은 FOUNDATION 범위가 아니다. 별도 Issue의 Ready 조건, Architecture/API/Security 계약과 PO 승인 범위를 연결한 독립 PR로 진행한다.

## 참조

2026-09-15 확인: [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation), [Tailwind Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google), [PWA](https://nextjs.org/docs/app/guides/progressive-web-apps).

기본 App Router와 Tailwind PostCSS를 채택한다. 서버 작업은 우선 Next.js에 두어 두 개발자가 같은 실행 환경에서 작업한다. Edge Function은 구체적인 실행 요구가 있을 때 도입한다. 인증은 공식 SSR cookie/PKCE 경로를 사용하며 직접 토큰 저장 구조는 만들지 않는다. PWA manifest와 아이콘을 마련하고 인증·사진 응답의 오프라인 캐시는 도입하지 않는다.
