# PROOVIT 화면 1–3 실행·인계 안내

## 클릭 한 번으로 로컬 미리보기

Mac에서는 Finder에서 `PROOVIT 화면보기.command`를 더블클릭하면 됩니다. 의존성이 없으면 자동 설치하고, 로컬 테스트 DB와 앱을 실행한 뒤 `/preview`를 열어 홈까지 자동 진입합니다. 실제 Google·Supabase 계정은 사용하지 않습니다. 종료는 열린 터미널에서 Enter입니다.

`/preview` 자동 로그인은 `PROOVIT_LOCAL_PREVIEW=true`일 때만 동작합니다. 일반 개발·Preview·Production에서는 `/`로 돌아가므로 배포 인증을 우회하지 않습니다. 이 로컬 실행기는 검토용이며 운영 데이터 연결 검증을 대체하지 않습니다.

## 무엇이 구현되어 있나요?

Next.js + TypeScript + Tailwind 기반 모바일 웹앱/PWA입니다.

- `/`: DB의 챌린지 소개·기간·시간대·규칙, 신청 가능/마감/이미 참가 상태.
- `/login`: Google OAuth 로그인, 취소·callback 실패 안내.
- `/home`: 참가한 챌린지명, 서버 기준 일차, 오늘 미션, 확정 누적 점수.
- 참가 버튼 → 로그인 → 참가 저장 → 홈을 연결합니다. DB unique 제약·트랜잭션 잠금으로 반복/동시 요청을 막습니다.
- 세션 쿠키 유지·갱신, 로그아웃, RLS에 의한 본인 데이터 조회, 점수 직접 쓰기 차단.
- 앱 아이콘·manifest·홈 화면 추가 안내·공개 오프라인 페이지. 개인 페이지와 점수는 서비스 워커 캐시에 저장하지 않습니다.

실제 Supabase에 연결하는 코드입니다. 접속 설정이 없으면 준비 안내를 표시하며 가짜 참가·로그인을 제공하지 않습니다. 브라우저 테스트용 인증 대역은 `tests/e2e`에만 있고 앱에서 import하지 않습니다.

## 가장 먼저 할 일

Node.js 24와 npm을 설치하고 이 프로젝트 폴더를 터미널에서 엽니다.

```sh
npm ci
cp .env.example .env.local
```

`.env.local`의 다음 네 항목을 채우세요.

| 변수 | 값 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_`로 시작하는 Supabase publishable key |
| `APP_ORIGIN` | 현재 앱의 정확한 origin. 로컬은 `http://localhost:3000` |
| `PROOVIT_CHALLENGE_SLUG` | 표시할 챌린지 slug. 개발 seed는 `launch-31` |

**service_role / secret key를 입력하지 마세요.** 앱은 사용자 세션과 RLS를 사용하며 관리자 키가 필요하지 않습니다. `.env.local`은 Git에서 제외됩니다.

## Supabase 연결: 새 개발 프로젝트 권장

1. 사용자 본인의 Supabase 개발 프로젝트를 준비합니다. 이번 작업에서는 클라우드 프로젝트를 만들거나 수정하지 않았습니다.
2. 새 프로젝트의 SQL Editor에서 `supabase/migrations/20260916065824_participant_slice.sql`을 실행합니다. 기존 팀 DB라면 먼저 테이블 이름·migration 충돌을 리뷰하세요. SQL은 트랜잭션으로 묶여 있고 처음 적용하는 migration입니다.
3. **개발 프로젝트에서만** `supabase/seed.sql`을 실행합니다. 시작일이 내일인 챌린지와 Day 1 검증용 미션을 만듭니다. 31개 최종 콘텐츠나 실제 정책 승인을 뜻하지 않습니다.
4. Supabase Auth에서 Google Provider를 활성화하고 Google Cloud OAuth Client ID와 Secret을 연결합니다. Email과 익명 로그인은 P0에서 사용하지 않습니다.
5. Google Cloud의 승인된 redirect URI에 Supabase Dashboard가 안내하는 callback URL을 정확히 등록합니다.
6. Supabase Site URL은 로컬 개발에서 `http://localhost:3000`, 배포 후에는 실제 HTTPS 주소로 설정합니다. Redirect URLs에는 각 환경의 `/auth/callback`을 등록합니다.
7. 앱의 `APP_ORIGIN`도 같은 origin으로 설정합니다. 요청 query나 forwarded host를 callback 목적지로 사용하지 않습니다.
8. Data API에서 `public` schema와 RPC 접근이 활성화되어 있는지 확인합니다. 2026년 신규 프로젝트는 SQL로 만든 테이블이 자동 노출되지 않을 수 있으므로 migration의 명시적 GRANT를 유지합니다. `private` schema는 노출하지 않습니다.

```sh
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 설정 변경 후에는 개발 서버를 다시 시작하세요.

## 로컬 Supabase 대안 (Docker 필요)

이 작업 환경에는 Docker가 없어 전체 Supabase 컨테이너 실행은 미검증입니다. CLI 2.117.0의 아래 명령 도움말은 확인했습니다.

```sh
npx supabase start
npx supabase status
```

표시된 로컬 API URL과 publishable/anon key를 `.env.local`에 넣습니다. 기존 로컬 데이터가 없는 테스트 프로젝트에서 migration·seed를 재적용하려면 다음 명령을 사용합니다. **이 명령은 로컬 테스트 DB를 초기화합니다. 운영 URL이나 `--linked`를 추가하지 마세요.**

```sh
npx supabase db reset --local
```

Google OAuth는 로컬 Supabase만 실행한다고 자동 구성되지 않습니다. 실제 Google provider 확인은 개발 프로젝트에서 수행하세요. CLI의 사용자 홈 쓰기가 제한되는 환경에서는 `SUPABASE_HOME="$PWD/work/supabase-cli"`를 명령 앞에 붙일 수 있습니다.

## 실제 데이터로 확인할 순서

1. 챌린지에서 규칙 확인 후 참가 → Google 로그인 → callback 완료.
2. 홈에서 ‘시작 전’, 누적 0점 확인. 새로고침해도 참가 상태가 유지되는지 확인.
3. **개발 DB에서만**, 참가 후 아래 SQL로 시작일을 오늘로 옮깁니다. 최초 참가가 마감 이후에도 그대로 조회되는지 확인할 수 있습니다.

```sql
update public.challenges
set start_date = (now() at time zone timezone)::date,
    enrollment_closes_at = now()
where slug = 'launch-31';
```

4. 홈을 새로고침하면 Day 1과 실제 `missions` 내용이 표시됩니다. 이후 날짜의 미션이 미등록이면 준비 중 안내를 표시합니다.
5. 점수의 기본값 0은 확정 이벤트가 없다는 의미입니다. Proof 승인/점수 지급은 다른 담당자 범위이므로 앱에서 버튼으로 점수를 만들지 않습니다. 연결 담당자는 `score_events` 계약을 검토하고 신뢰된 서버에서 확정 이벤트를 추가해야 합니다. 점수 보정은 기존 이력 수정 대신 새 음수 이벤트로 추가합니다.
6. 로그아웃 → `/home` 직접 접속 시 로그인으로 돌아가는지 확인. 다른 계정으로는 기존 사용자의 참가·점수가 보이지 않아야 합니다.
7. 실제 iPhone Safari / Android Chrome에서 설치, 재실행, 화면 회전, Google 앱·브라우저 왕복, 세션 갱신을 확인하세요.

## 테스트와 빌드

```sh
npm run check
npx playwright install chromium
npm run test:e2e
npm run test:e2e:participant
```

- `check`: 타입 검사 → lint → 형식 검사 → PostgreSQL/PGlite DB 테스트. 프로덕션 빌드는 `npm run build`로 확인합니다.
- E2E: 앱은 실제 프로덕션 서버로 실행합니다. Google OAuth와 HTTP Data API만 테스트 대역이며 실제 migration을 PostgreSQL 엔진에서 실행합니다.
- E2E는 3000과 54329 포트를 사용합니다. 다른 개발 서버가 있다면 먼저 종료하세요.
- 테스트 브라우저를 작업 폴더에 설치하려면 설치와 실행 양쪽에 `PLAYWRIGHT_BROWSERS_PATH="$PWD/work/browsers"`를 붙입니다.
- 20개 독립 PostgreSQL 연결 동시성 검증은 `TEST_DATABASE_URL`에 **새 폐기용 DB**를 지정한 뒤 `npm run test:concurrency`로 실행합니다. 이 테스트는 빈 DB에만 동작하며 auth 대역·테이블을 생성합니다. 운영/기존 Supabase DB를 지정하지 마세요.
- `.github/workflows/ci.yml`은 PostgreSQL 17 서비스, 검사/빌드, 동시성, Chromium E2E를 정의합니다. GitHub에서 실제 CI는 아직 실행하지 않았습니다.

빌드는 이 작업 환경의 Turbopack 포트 생성 제한 때문에 공식 Webpack 빌드 옵션을 사용합니다. 같은 코드를 `npm run build`, `npm run start`로 실행할 수 있습니다. 개발 모드에서는 서비스 워커를 등록하지 않습니다.

## Vercel Preview 배포 순서

기능 브랜치는 GitHub에 올리고 Pull Request로 검토합니다. 병합과 Vercel 배포는 리뷰와 CI 통과 후 진행합니다.

1. 팀의 원격 저장소에서 최신 앱 기반 브랜치와 다른 담당자의 변경을 확인합니다.
2. `feat/participant-screens-v2` Pull Request에서 사람 리뷰와 필수 CI를 받습니다.
3. Vercel에 Next.js 프로젝트로 연결하고 **Preview 전용 Supabase 프로젝트**의 환경변수 네 개를 설정합니다. Build Command는 `npm run build`입니다.
4. 해당 개발/스테이징 DB에 migration, 승인된 챌린지·미션 데이터를 준비하고 Google Provider와 callback URL을 설정합니다.
5. Preview HTTPS 주소에서 실제 Google 로그인·참가·조회·로그아웃·PWA 설치 검증을 수행합니다.
6. D-004/007/011/012/014와 콘텐츠·개인정보 문구·지원/삭제 절차, 사람 리뷰·필수 CI가 준비된 뒤 운영 배포를 결정합니다.

Vercel/Next.js 웹앱만으로 실기기의 모든 설치·푸시 동작을 보장하지 않습니다. 이번 범위는 설치와 온라인 핵심 흐름, 오프라인 안내이며 Push는 포함하지 않습니다.

## PR와 담당 경계

이번 변경은 최신 `codex/app-foundation`을 base로 한 `feat/participant-screens-v2` 브랜치에 모았습니다. 범위는 참가자용 챌린지 소개, Google OAuth 로그인, 중복 없는 참가, 홈 데이터, PWA와 해당 DB·브라우저 테스트입니다. 기존 미션 상세·촬영·결과 미리보기는 그대로 유지합니다. Feature Owner와 Reviewer는 팀에서 지정합니다.

후속 담당자와 맞출 공유 부분은 인증, `public` DB 계약, 디자인 CSS, manifest, 환경변수입니다. Project 설정, 미션 상세/촬영, 31일 보드, Proof 승인, 점수 지급, 랭킹은 이번 앱의 구현 범위 밖입니다.

## 운영 신호와 복구

- 실패 시 서버 로그의 `operation`, 임의 `reference`, 일반 오류 코드를 확인합니다. 이메일·OAuth code·토큰·키는 로그에 기록하지 않습니다.
- DB 실패를 0점/참가 성공으로 바꾸지 않고 오류와 재시도를 표시합니다.
- 앱 문제는 이전 Vercel 배포로 복귀할 수 있습니다. DB와 OAuth 공급자 상태는 앱 rollback으로 되돌아가지 않습니다.
- 운영 migration은 승인·백업 후 적용합니다. 운영 데이터가 생긴 뒤 테이블을 DROP하지 말고 전진 migration으로 고칩니다.
- 개인 정보 삭제·보존 정책과 운영자 기능은 출시 전 별도 작업입니다. `auth.users`/참가/점수의 FK는 임의 삭제를 막도록 기본 제한을 사용합니다.

## 남아 있는 확인

실제 Supabase Auth/PostgREST와 Google Provider, 장기 세션 만료·갱신, Vercel Preview, iOS/Android 실기기 설치, Supabase advisors와 사람 리뷰는 미실행입니다. Google OAuth 전용 정책은 PO 승인됐지만 소스 구현과 로컬 검증이 끝나도 저장소 Done 기준의 병합 가능/출시 완료는 아닙니다.

## 네비게이션 수정

하단 메뉴는 화면 중간에 겹치지 않도록 앱 셸의 전용 하단 행에 배치했습니다. [변경과 검증](NAVIGATION_FIX.md)을 참고하세요.
