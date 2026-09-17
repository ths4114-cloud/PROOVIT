# 로컬 검증 결과 — 2026-09-16

대상 구현: `feat/participant-challenge-auth-home`의 Pull Request 제출 전 작업 트리.
검증자: Codex 자체 점검. 별도 사람 Reviewer/독립 보안 리뷰 없음.
환경: macOS arm64, Node 24.21.0, npm 11.19.0, Next.js 16.3.5, Supabase CLI 2.117.0. 패키지 정확한 버전은 package-lock.json.

## 실행 결과

| 검증 | 결과 | 근거/범위 |
| --- | --- | --- |
| `npm run typecheck` | 통과 | Next route types + TypeScript |
| `npm run lint` | 통과 | ESLint, 오류/경고 0 |
| `npm test` | 7/7 통과 | 실제 migration을 PGlite PostgreSQL에 적용, auth 역할/사용자만 대역 |
| `npm run build` | 통과 | Webpack production build, `/`, `/login`, `/home`, manifest 및 proxy 생성 |
| `npm run test:e2e` | 3/3 통과 | 기존 앱 기반의 미션 화면과 인증 callback 회귀 검사 |
| `npm run test:e2e:participant` | 8/8 통과 | Chromium 153, production Next 서버 + 실제 SQL, Auth/HTTP API 대역 |
| `npm run test:concurrency` | 2개 시나리오 통과 | PostgreSQL 17.10, 20개 독립 연결의 동시 참가 / rollback 후 재시도 |
| Prettier check | 통과 | 새 소스·테스트·설정의 형식 검사 |
| `git diff --check` | 통과 | whitespace 점검 |
| 모바일/데스크톱 자체 검수 | 수행 | 360/390/1280px 가로 넘침 없음, 실제 화면 캡처 확인, 미션 가이드 키보드 접근 |
| npm 설치 audit | 알려진 취약점 0 보고 | 마지막 설치 당시 399개 패키지, 독립 보안 감사를 뜻하지 않음 |

브라우저 테스트 11개가 통과했다. 시나리오 내 잘못된 OTP, DB 중단, 참가 마감 오류 로그는 의도된 실패 주입의 결과다.

## 확인한 내용

- Challenge 소개 → 규칙 확인 → OTP → 참가 저장 → Home.
- 새로고침 후 세션·참가 상태, 확정 이벤트 100점 추가 후 홈 갱신.
- 기존 참가자에게 홈으로 이동 안내, 로그아웃 후 보호된 홈 접근 차단.
- 잘못된 OTP 후 올바른 코드로 복구. 인증 도중 참가 마감 시 로그인은 유지하고 참가 생성은 하지 않음.
- 시작 전, 오늘 미션 없음, 기간 종료, DB 실패 후 다시 불러오기.
- 한국 자정, 윤년, 미국 DST, Day 31과 종료 이후 경계.
- 익명 조회 제한, 타인 참가/점수 미노출, 미래 미션 제한, 일반 사용자의 직접 insert/update/delete 제한.
- 확정 점수 이력의 수정·삭제 금지, 동일 원인 이벤트 중복 거부, 보정 이벤트 합산.
- 20개 독립 DB 연결이 모두 같은 Participation ID를 반환, DB에는 한 행. rollback 후 행이 남지 않고 재시도 성공.
- manifest standalone·아이콘 3개, service worker 캐시에 `/offline.html`만 저장.
- 오프라인 진입·온라인 복구, 모바일 가로 넘침, 가이드 키보드 펼치기.

## 발견 후 수정

1. 초기 `pageshow`마다 새 조회를 유발해 로딩 화면이 다시 나타남 → BFCache 복귀일 때만 갱신.
2. 서버 오류 화면에서 React reset만 호출해 서버 재조회가 안 됨 → 사용자의 재시도 클릭으로 실제 페이지 재조회.
3. 브라우저 테스트 선택자가 Next route announcer와 중복됨 → 사용자 오류 요소로 범위를 명확히 지정.
4. 종료된 fixture의 마감일 변경이 DB 불변조건을 위반함 → fixture 변경도 종료 시각 이내로 제한.
5. 로컬 Turbopack이 CSS 처리 중 포트 생성 제한으로 실패 → `next build --webpack`으로 정상 빌드. 오류를 통과로 숨기지 않고 명령을 명시.

## 미검증 / 남은 Gate

- 실제 Supabase GoTrue/PostgREST/SMTP에서 메일 발송과 로그인.
- 실제 공급자 세션 만료/refresh token 회전·철회 경계. 브라우저 새로고침 지속성만 대역으로 확인.
- Supabase advisor 결과, Docker 로컬 전체 스택, Vercel Preview/배포.
- iOS Safari/Android 실기기 설치·홈 화면 재진입. Chromium headless의 manifest/worker는 확인.
- 전체 WCAG 준수 감사, 성능 목표, 개인정보 동의·삭제/보존 운영 정책.
- 팀 PO 결정 승인, 다른 팀원의 계약 합의, 사람 리뷰, GitHub CI 실제 실행/브랜치 보호.

상태: **로컬 코드·검증 산출물 준비, 실제 서비스 연결과 팀 Gate 남음. 병합·출시 미진행.** 테스트 대역은 실제 인증/이메일 전달 검증을 대체하지 않는다.

## 재현

`npm run check`, `npm run build`, `npm run test:e2e`, `npm run test:e2e:participant`는 실행 안내에 따라 재현할 수 있다. 동시성 검증은 새로운 PostgreSQL 17 폐기용 DB에 `TEST_DATABASE_URL`을 지정한다. 이 작업에서는 Docker 대신 작업 폴더에만 설치한 embedded-postgres 17.10.0-beta.17로 임시 클러스터를 만들고 검증 후 종료·삭제했다. 이 임시 도구는 앱 의존성이 아니다. CI에는 postgres:17 서비스가 같은 테스트를 실행하도록 정의되어 있다.

## 사용자 지적에 따른 네비게이션 검수 정정

기존 ‘모바일/데스크톱 자체 검수 수행’은 충분하지 않았다. 하단 고정 메뉴가 긴 전체 페이지 미리보기 중간에 겹쳐 나온 것을 놓쳤다. 현재 브랜치에서 메뉴 전용 행과 내부 본문 스크롤로 수정하고, 좌표 기반 회귀 검증을 추가했다. 상세 내용은 [네비게이션 수정 기록](NAVIGATION_FIX.md)을 참고한다.
