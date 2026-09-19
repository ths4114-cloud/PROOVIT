# 화면 1–3 작업 계약 / Ready 기록

Owner: 민(사용자 제공 담당 범위). 사람 Reviewer: 팀 지정 필요. 인증 정책 근거: GitHub Issue #4와 `docs/decisions/2026-09-17-p0-participant-authentication.md`.
기준 브랜치: `origin/codex/app-foundation`의 `31071d4`. 기존 Foundation의 Google OAuth·공통 Preview 화면을 유지한다.

## 작업 단위 / PR 순서

1. `feat/participant-screens-v2`: DB migration·RLS, Google OAuth 참가 의도 복원, 챌린지·홈 UI, PWA와 검증을 하나의 리뷰 가능한 사용자 흐름으로 제공한다.

공유 영역: package.json, 인증, DB schema, globals.css. 팀원 작업과 합칠 때 위 순서로 PR을 분리하고 선행 PR을 base로 지정한다. 원격 PR 생성·push·병합은 수행하지 않는다.
수정 제외: Proof, Camera, Project, Board, Ranking, Reward, Operator 기능.

## 책임

Server Component → 요청별 Supabase client → RPC / RLS. UI에는 DB가 반환한 day와 score를 그대로 표시. Auth는 Supabase가 관리하며 서버는 getUser로 검증. 사용자 ID를 폼에서 받지 않는다.

## DB 및 API 계약

- challenges: slug unique, title/description, start_date, duration_days=31, IANA timezone, enrollment 기간, published, rules/rules_version. 민감 정보 없음.
- missions: (challenge_id, day) unique, phase/title/purpose/guide/completion_criteria. 참가자가 공개된 현재/과거 일차만 조회.
- participations: (user_id, challenge_id) unique, joined_at, rules_version. 본인 조회만 허용. join_challenge RPC 이외 직접 쓰기 금지.
- score_events: participation/challenge/mission 관계 FK, unique source_event_id, signed amount, policy_version, created_at. 본인 조회만 허용. 인증된 사용자의 직접 쓰기 금지. 보정은 새로운 원인 ID와 음수 이력으로 처리하는 계약이며 지급 엔진은 별도 작업.
- challenge_overview(slug): 공개 Challenge·서버 day·참가 가능 상태 반환. 읽기 전용. 없으면 null.
- join_challenge(challenge_id, rules_version): auth.uid 필수. 기존 참가가 있으면 동일 ID 반환. 없으면 공개/신청 기간/규칙 버전 검증 후 원자적 insert-on-conflict. 마감 이후 재요청도 기존 참가 반환. 인증/기간/규칙 오류에는 생성 없음.
- participant_home(slug): 인증 필수, RLS 본인 참가 확인; 없으면 null. Challenge, Participation, current_day, today_mission|null, total_score 반환. 한 SQL statement의 snapshot으로 일관된 조회.
- privileged insert helper는 비공개 schema에 두고 search_path를 비우며 PUBLIC 실행 권한 제거. 공개 RPC는 security invoker. 서버·DB 모두 소유권 확인.

## Acceptance Criteria

1. 소개 화면에 이름·목표·기간·시간대·규칙·참가 상태가 표시된다.
2. 참가 → 미인증 Google 로그인 → OAuth callback → 참가 의도 복원 → 중복 없는 참가 → 홈.
3. 새로고침 시 세션·참가 상태 유지. 로그아웃 후 홈 접근은 로그인 이동.
4. 홈에 챌린지명, 일차, 오늘 미션, 실제 확정 누적 점수. 시작 전/종료 후/미션 없음 별도 안내.
5. 동일·동시 참가 1개, 타인 데이터 읽기 불가, 점수 위조·참가 직접 쓰기 불가.
6. 시간대 자정·DST·윤년, 마감 exclusive 경계 검증. 브라우저 시계는 판정 근거가 아니다.
7. DB·인증 오류, 로딩, 없음, 재시도 제공. 오프라인에서는 저장 성공을 가장하지 않는다.
8. 360px 모바일 및 데스크톱, 키보드, 레이블·대비 확인. manifest·아이콘·service worker 제공.

## Ready 상태

요청 범위·AC·계약·검증 계획과 Google OAuth 정책 승인은 기록됐다. DB migration과 공유 영역은 사람 Reviewer가 확인해야 하므로 구현 완료 후에도 병합 가능·출시 완료로 표시하지 않는다.

## 확인한 공식 레퍼런스

2026-09-17에 Supabase changelog, Google Login 공식 가이드, SSR client 가이드를 확인했다. 서버 `signInWithOAuth`가 반환한 URL로 이동하고 고정된 `/auth/callback`에서 PKCE code를 session으로 교환하는 패턴을 채택했다. Google 기본 프로필·이메일 외 추가 scope와 provider token 저장은 필요하지 않아 제외했다. 2026년 신규 프로젝트의 Data API 자동 노출 변경에 대비해 migration의 명시적 GRANT와 모든 public table RLS를 유지한다.
