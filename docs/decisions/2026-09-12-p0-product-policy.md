# ED-2026-09-12 — P0 Mission·Proof·Score·Ranking 정책

- 상태: Accepted
- 날짜: 2026-09-12
- 작성자 / Feature Owner: Codex / PO
- 결정 수준: Level 3
- 결정자 / 승인 날짜 / 승인 근거: PO / 2026-09-12 / 현재 Codex 작업의 Camera 전용·P0 자동 점수·일 1회 Ranking 승인 메시지
- 관련 Issue / PR / 공식 문서: [PRD](../product/PRD.md), [User Flows](../product/USER_FLOWS.md), [Decision Register](../sprint-0/DECISION_REGISTER.md)
- 이전 결정 / 대체 결정: 기존 Proposed 수동 검수안을 대체
- 구현 상태: 미착수

## 1. Decision — 무엇을 결정하는가

P0는 앱 내 Camera Capture로 새로 촬영한 Proof만 받는다. 사진첩, Screenshot과 일반 파일 업로드는 제공하지 않는다. 인증·권한·Mission 상태·서버시각·실제 이미지 형식·크기·중복과 저장을 기술 검증하고, 성공하면 사진 내용의 AI 또는 Operator 판정 없이 `accepted`로 전이해 Score Event를 한 번 생성한다.

Mission은 매일 00:00 KST에 하나씩 해금되고 다시 잠기지 않으며 Day 31 종료 후 72시간까지 제출할 수 있다. 모든 Mission은 100점이고 당일 1.0, 다음 날 0.7, 2일 이상 0.4, 미제출 0 배율을 사용한다. Participant Score는 즉시 갱신하고 Ranking은 00:00 KST 기준의 일 1회 Snapshot을 00:05에 생성한다. 개인 성공은 `scoreRate >= 0.85 AND mvpSubmitted = true`다.

금전 지급, AI Proof Monitoring, Fruvi와 외부 알림은 P0 범위가 아니다.

## 2. Context & Reference — 사실과 근거

- P0 목적은 456명까지 Camera Proof→Score→Ranking 제품 루프를 검증하는 것이다.
- 사람 검수는 매일 최대 456건의 운영 병목이 되고 AI 판정은 공급자·비용·개인정보·오탐 대응 결정이 필요하다.
- [W3C Media Capture and Streams](https://www.w3.org/TR/mediacapture-streams/)는 웹에서 카메라 권한과 Stream을 요청하는 API를 정의한다.
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)는 입력 경로와 별개로 실제 유형, 크기, 생성 파일명과 비공개 저장 검증이 필요함을 뒷받침한다.
- Camera 경로 강제는 사진첩·파일 선택 UI를 막지만 촬영 대상 자체의 조작 여부를 보장하지 않는다.

## 3. Trade-off & Variables

- 충돌하는 가치: 빠른 루프 검증과 Proof 진위 신뢰성
- Risk: 조작된 장면을 촬영해도 P0가 내용 진위를 판정하지 못함
- Change: 정식 서비스에서 AI Review 상태를 추가해야 함
- Scale: 최대 456명, 31일, 최소 14,136건의 Proof 가정
- Constraint: 4인 팀, 개발 실무 경험이 적은 PO, P0에서 핵심 기능 우선
- 보호책: 금전 지급 제외, `verificationMode`와 정책 버전 기록, Score 중복 방지, 비공개 저장, 정정 이력

## 4. Alternatives — 현실적인 대안

### Option A — 제출 즉시 자동 인정

- 장점: 구현과 운영이 단순하고 Score·Ranking을 빠르게 검증할 수 있다.
- 단점: 사진 내용과 Mission 수행 진위를 보장하지 못한다.
- 비용: Camera, 파일 기술 검증, 저장, Score 원자성 구현이 필요하다.

### Option B — Operator 수동 검수

- 장점: 기준을 해석하고 명백한 불일치를 걸러낼 수 있다.
- 단점: 456건/일의 반복 운영과 처리 지연이 생긴다.
- 비용: 검수 큐, 승인·반려·재제출과 인력 운영이 필요하다.

### Option C — AI 검수

- 장점: 정식 서비스에서 규모와 내용 판정을 함께 다룰 수 있다.
- 단점: 오탐·미탐, 개인정보 전송, 비용, 장애와 이의제기 복잡성이 크다.
- 비용: 공급자, 평가 데이터, 판정 기준, 재시도와 사람 대체 절차가 필요하다.

## 5. Recommendation — 추천

P0는 Option A를 사용한다. 제품 루프를 먼저 검증하되 `accepted`를 수행 진위 승인으로 홍보하지 않는다. 데이터 모델은 `verificationMode=capture_auto_accept`와 정책 버전을 기록하고 미래 `ai_review` 전환을 수용한다.

## 6. Decision & Consequences — 실제 결정

- 선택한 안: P0 Camera 전용 자동 인정, 정식 서비스 AI Monitoring 후속
- 승인 범위: D-001부터 D-010, D-017부터 D-020의 제품 정책
- 변경 문서: PRD, User Flows, Glossary, Sprint 0 Plan과 Review
- 검증: Camera 권한, 파일 우회 차단, 실제 유형·크기, 중복·동시 요청, 부분 실패, 시간 경계, Ranking 배치 재실행
- 관측: Camera 권한 거부, Proof 처리 실패, Score 생성 실패, Ranking Snapshot 실패
- rollback: P0 공개를 중단하거나 Score 생성을 비활성화한다. AI 기능을 준비되지 않은 대체 경로로 켜지 않는다.
- 비가역 영향: 없음. 이미 생성된 Score는 정책 버전과 보정 Event로 추적한다.

## 7. Revisit — 재검토

- 실제 금전 지급, 정식 서비스 공개 또는 AI Monitoring 도입 전에 재검토한다.
- 부정 제출이 제품 가설 검증을 왜곡하거나 Camera 미지원률이 수용 범위를 넘으면 입력·판정 정책을 다시 결정한다.
- 담당자: PO와 해당 Feature Owner
