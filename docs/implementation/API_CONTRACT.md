# 공통 화면 계약 초안

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
