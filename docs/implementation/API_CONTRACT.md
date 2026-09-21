# 공통 화면 계약 초안

> 2026-09-21 구현 현황: 아래 GET 목록은 초기 제안이며 HTTP endpoint로 구현하지 않았다. 실제 조회는 사용자 세션/RLS를 적용한 `mission_board(p_slug)`, `mission_detail(p_mission_id)`, `proof_result(p_mission_id)` RPC를 Server Component에서 호출한다. 타인/미참가/잠긴 상세는 null→404, 보드의 잠긴 셀은 제목/UUID를 숨긴다. 실제 라우트는 `/board`, `/missions/:uuid`, `/missions/:uuid/camera`, `/missions/:uuid/result`다. 아래 제출 항목의 최신 구체 계약은 문서 하단을 우선한다.

이 문서는 DB schema나 공개 API가 아니다. 두 개발자가 첫 기능 PR에서 같은 입력·출력 의미를 사용하기 위한 표시 계약이다.

## 조회

- `GET /api/challenges/:challengeId`: 현재 Challenge와 Participant 상태를 반환한다. 미인증은 `UNAUTHENTICATED`, 타인 Challenge 접근은 `FORBIDDEN`.
- `GET /api/missions?challengeId=:id`: 서버 시간과 Participant 권한으로 Mission 목록을 반환한다. `status`와 `availableScore`를 클라이언트가 계산하지 않는다.
- `GET /api/missions/:missionId`: Mission Detail을 반환한다. Challenge 소속·해금·`proofCloseAt`은 서버가 확인한다.

## 제출 (후속 구현)

- `POST /api/missions/:missionId/proofs`: 앱 내 새 촬영 결과와 idempotency key를 받는다. 사진첩/일반 파일 경로는 허용하지 않는다.
- 성공 응답은 `Proof accepted`와 서버 확정 `ScoreResult`를 반환한다. 동일 key 또는 동일 Mission 유효 제출 재시도는 같은 결과를 반환한다.
- 실패는 `FORBIDDEN`, `NOT_READY`, `CONFLICT`, `UNAVAILABLE` 중 하나로 매핑한다. 내부 Storage·DB 오류와 secret을 클라이언트에 노출하지 않는다.

## 공통 규칙

- 날짜는 offset이 포함된 ISO 8601 문자열이다. 정책 시간대는 KST다.
- `awardedScore: null`은 미확정이고 0점과 다르다.
- 현재 사용자 ID, 점수, 권한, 제출 가능 여부는 클라이언트 입력을 신뢰하지 않는다.
- 서버가 확정한 `verificationMode`와 `policyVersion`을 결과에 기록한다.
- 이 초안은 DB migration 전까지 변경 가능하다. 계약을 바꾸면 A·B 담당자와 PR에서 호환성과 순서를 기록한다.

## 구현된 제출 계약 (2026-09-21)

- `POST /api/missions/:missionId/proofs`: 검증된 사용자 쿠키, 정확한 APP_ORIGIN의 Origin, UUID Idempotency-Key 헤더, image/jpeg 원시 본문 최대4MiB. multipart/외부 URL은 받지 않는다.
- UI는 새 카메라 촬영만 제공한다. HTTP 바이트만으로 촬영 출처나 내용의 진위를 증명할 수는 없다.
- 성공200 `{ok:true,data:{missionId,status:'accepted',awardedScore,totalScore,verificationMode:'capture_auto_accept',policyVersion:'camera-auto-v1'}}`.
- 오류 `{ok:false,error:{code}}`: 400 INVALID_INPUT/INVALID_IMAGE,415 INVALID_IMAGE,413 IMAGE_TOO_LARGE,401 UNAUTHENTICATED,403 FORBIDDEN,409 NOT_READY/KEY_CONFLICT/PROCESSING/RETRY_REQUIRED,429 RATE_LIMIT,503 UNAVAILABLE/RETRY_REQUIRED. 내부 오류와 secret은 숨긴다. 응답은 no-store.
- 같은 사용자+key+이미지 hash는 기존 상태를 확인한다. 같은 key/다른 미션·이미지는 충돌. 이미 인정된 미션은 새 key라도 중복 적립 없이 기존 결과를 반환한다. PROCESSING은 기다린 뒤 동일 key로 확인, RETRY_REQUIRED는 새 key로 재시도 가능하다.
- DB 예약 시각(KST)에 점수를 고정한다. 시도는2분이며 전체 마감(시작일+34일 KST00:00)을 넘을 수 없다. 사용자당 진행1개/분당 생성5개 제한. 업로드 성공 후 accepted와 Score Event는 단일 DB 트랜잭션이다.
- 서비스 전용 reserve/accept/fail 함수는 브라우저 역할에 실행권한이 없다. 사진 삭제는 별도 관리 명령이며 점수는 보존한다. [구현 인계](MISSION_PROOF_IMPLEMENTATION.md) 참조.
