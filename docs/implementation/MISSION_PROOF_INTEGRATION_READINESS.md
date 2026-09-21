# Mission → Proof → Score 연결 준비 (2026-09-21)

상태: 조사·계약 제안. 승인된 DB 설계나 실제 연동 완료가 아니다. 앱/공통 UI/DB 변경 없이 조사했다.
기준: main `44ee708`, 우리 앱 `e962dcd` 및 회귀 `3df54c8`, 팀원 #6 `d48b87c`, #7 `bd030cf`. 원격 추가 push 없음.

## 이미 승인된 정책 — 다시 결정하지 않을 사항

- 근거: `docs/decisions/2026-09-12-p0-product-policy.md`, `2026-09-12-p0-technical-foundation.md`, `2026-09-17-p0-participant-authentication.md`.
- Google 로그인, 앱 내 신규 Camera Proof, 기술 검증 후 자동 accepted. AI/사람의 사진 내용 심사는 P0에 없음.
- 매일 00:00 KST 해금, 해금 후 다시 잠기지 않음. Day 31 종료 후 72시간까지 제출.
- 기본 100점 × 당일 1.0 / 다음 날 0.7 / 2일 이상 0.4. 동일 미션 유효 제출의 점수는 한 번만 지급.
- 사용자 점수 즉시 반영. Ranking 일일 snapshot은 별도 기능으로 이번 연결에 섞지 않음.
- Private Storage, Proof 원본은 proofCloseAt 30일 후 자동 삭제. 기반 보안 문서의 '후속 확정' 문구보다 승인 결정서의 보존 기간이 구체적이다. 삭제 실행 절차는 미구현.

## 실제 코드와 표시 계약 사이의 차이

팀원 `src/lib/data.ts`는 getUser() 확인 후 challenge_overview / participant_home RPC를 호출한다. 실제 상세·보드 RPC는 없음.

- DB Mission.id UUID → 표시 id로 그대로 사용. 프리뷰 day-N으로 변환하지 않는다.
- DB purpose:string → UI description:string으로 매핑 가능.
- DB guide:string → UI steps:string[]: 배열 저장/직렬화 계약이 필요. 임의 줄바꿈 split은 피한다.
- DB completion_criteria:string → UI completionCriteria:string[]: 같은 문제.
- UI submissionItems / proofGuide: DB 필드 없음.
- UI status / availableScore / awardedScore / opensAt / proofCloseAt: 서버 조회 결과에 추가 필요.
- ScoreResult에는 verificationMode만 있고 API 초안의 policyVersion이 빠져 있음. 공개 전 응답 계약 동기화 필요.

권장안(합의 전): DB에 배열형 콘텐츠 필드를 명시적으로 추가하고, 기존 purpose/guide/completion_criteria 소비자 호환을 유지하는 추가 migration으로 이전한다. 타입만 바꾸거나 빈 배열 fallback으로 감추지 않는다. 대안은 서버의 버전 고정 콘텐츠 카탈로그와 DB mission을 매핑하는 것인데, 버전 불일치와 중복 출처 관리 부담이 있다. 핵심 schema 변경은 PO 승인 후 구현한다.

## 라우트·조회 계약 제안

- 실제 화면 `/missions/[missionId]` 및 `/missions/[missionId]/camera` 제안. 아직 생성되지 않았고 팀원 홈/보드 링크와 합의 필요.
- API 초안의 GET /api/missions/:missionId, GET /api/missions?challengeId는 아직 구현 API가 아님. 서버 페이지와 API가 같은 서버 조회 함수를 사용하도록 구현하고 프리뷰 모듈을 재사용하지 않는다.
- 입력: UUID missionId; 서버 검증 사용자. 사용자 ID/점수/현재시각은 클라이언트 입력으로 받지 않음.
- 출력: MissionDetail + 서버 시각/정책 버전. 참가·소속·해금·종료 시각을 서버에서 확인.
- 미인증/미참가/타인 데이터/없는 ID/잠금/종료/DB 장애를 구분하되 타인 데이터의 존재를 노출하지 않는다. 실패 시 fixture로 대체하지 않음.
- 보드는 해금 전 칸도 필요하지만 #6 RLS는 해금된 mission 행만 조회 허용. 잠긴 칸은 서버가 day/status 메타데이터만 반환하는 방식 등을 합의해야 함. 편의상 미래 상세 RLS를 풀지 않는다.
- #6 seed는 개발용 Day 1 한 건이며 날짜도 실행 시각에 따라 생성됨. 실제 31일 승인 콘텐츠 seed가 아님.

## DB / Proof / Score 조사

검토: #6 `supabase/migrations/20260916065824_participant_slice.sql`.

- challenges / missions / participations / score_events가 존재. 참가 고유성(user_id, challenge_id), mission 고유성(challenge_id, day), challenge를 포함한 복합 FK가 있음.
- score_events는 signed amount, source_event_id unique, UPDATE/DELETE 차단, 본인 조회 RLS. 클라이언트 INSERT 권한 없음.
- participant_home은 score_events.amount 합계를 반환하므로 지급 후 실제 합계를 다시 조회할 경로는 있음.
- source_event_id만 unique이므로 서로 다른 source UUID를 생성한 동일 미션의 중복 지급까지 막아주지는 않음. 이것은 기존 테이블의 원장 역할과 별개로 Proof 인정 경로에서 보완해야 할 불변조건.
- Proof 테이블, Storage bucket/policy, 업로드 처리, 인정·점수 원자적 생성 RPC, 정리 작업은 이 migration에 없음. DB에 실제 적용됐는지는 검증하지 않음.

다음 설계에서 확정할 사항(Level 3 승인 필요):

1. Proof/제출시도 schema와 상태, 참여자·미션별 유효 제출 고유성, idempotency key 범위와 payload 불일치 처리.
2. private 객체 경로·권한과 파일 검증(실제 JPEG 등 허용 형식, 최대 바이트/픽셀, 메타데이터 처리). MIME 라벨만 믿지 않음.
3. Storage 저장 성공 후 DB 인정·Score Event 한 트랜잭션 처리. DB 실패 시 객체 정리, 정리 실패 재처리, 응답 유실 시 같은 결과 조회.
4. 서버 판정 시각 정의와 자정/제출 마감 경계. 클라이언트 촬영 시각을 점수 근거로 신뢰하지 않음.
5. 원본 삭제 기한 구현과 실패 재시도·관측. 원장/최소 감사 메타데이터 보존은 별도 정의.

승인된 자동 인정/점수율/원본 보존기간을 변경하는 요청이 아니다. 위는 이를 안전하게 구현할 구체적인 저장·권한 계약이다. 운영 migration/Storage 변경은 수행하지 않았다.

## 다음 개발 순서와 충돌 회피

1. 팀원과 실제 UUID 링크 및 콘텐츠 필드 매핑만 먼저 합의.
2. 공유 UI와 독립적인 서버 시간·점수 계산 경계 테스트를 별도 작업으로 준비 가능. 실제 지급은 schema 승인 후 구현.
3. 팀원 통합본 기준 추가 migration + 상세/보드 조회를 작은 PR로 진행.
4. Private Proof 저장·기술 검증·원자적 점수 지급 PR. 타인 접근/동시·중복/부분 실패/시간 경계 테스트 필수.
5. 실제 화면 연결과 최종 E2E. 기존 카메라 preview URL만 넘기는 구조를 Blob 제출 경계로 연결해야 함.

## 실제 휴대폰 빠른 확인 — 아직 미실행

필요: 테스트 대상 커밋의 신뢰 가능한 HTTPS Preview URL, ENABLE_UI_PREVIEW=true, iPhone Safari 또는 Android Chrome. 현재 접근 가능한 기기와 배포 URL은 확인되지 않았다. 임의 외부 터널/배포는 하지 않았다.

`http://localhost:3000`은 휴대폰 자신의 주소다. PC의 LAN HTTP 주소도 HTTPS 카메라 검증을 대신하지 않는다. 카메라는 secure context가 필요하다: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

테스트 URL: `<검증된 HTTPS Preview>/preview/missions/day-12/camera`.

1. 개인정보 없는 종이를 준비. 시작 → 권한 허용 → 영상/후면 우선 선택 확인.
2. 촬영 → 정지 사진 표시 → 카메라 사용 표시가 꺼지는지 확인.
3. 재촬영 → 새 영상 → 다시 촬영, 사진이 교체되는지 확인.
4. 촬영 중 홈 링크/뒤로가기 → 카메라 사용 표시 종료 확인.
5. 권한 거부 → 안내 → 기기 설정에서 허용 → 재시도 확인.
6. 세로/가로 회전, 앱 전환/복귀 → 영상·버튼 가림·멈춤 여부 기록. 백그라운드 복귀는 자동 테스트가 보장하지 않는다.

기록: 기기 / OS / 브라우저 버전 / URL / 커밋 / 항목별 성공·실패 / 실패 단계. 문제 사진에 개인정보를 담지 않는다.

자동 검증은 가상 카메라 Chromium이며 Safari/실제 센서/OS 권한창 검증과 동일하지 않다.
