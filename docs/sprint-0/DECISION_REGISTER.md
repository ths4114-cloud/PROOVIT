# PROOVIT Sprint 0 Decision Register

- 문서 상태: P0 정책 Accepted
- 최종 수정일: 2026-09-17
- 결정자: PO
- 최초 정책 기록일: 2026-09-12 (`a0dd286`)
- 확인 가능한 PO 재확인일: 2026-09-17
- 승인 근거: [GitHub Issue #4 — P0 정책 승인 범위 및 Participant 인증 개정 기록](https://github.com/ths4114-cloud/PROOVIT/issues/4)
- 관련 문서: [PRD](../product/PRD.md), [User Flows](../product/USER_FLOWS.md), [Sprint 0 계획](SPRINT_0_PLAN.md)

이 문서는 구현 전에 닫아야 할 제품·기술 결정을 추적한다. P0의 제품 방향과 Level 3 선택은 PO가 승인했다. `Accepted`는 선택과 승인 조건이 기록됐다는 뜻이며 Architecture, 개인정보 또는 출시 Gate의 남은 검증까지 완료됐다는 뜻은 아니다.

## 상태 정의

- Open: 분석을 시작하지 않았거나 선택지가 부족함
- Proposed: 대안과 추천안이 준비됐으나 미승인
- Accepted: PO가 범위와 근거를 승인함
- Rejected: 채택하지 않기로 결정함
- Superseded: 후속 결정이 이전 결정을 대체함

## 승인된 결정 목록

| ID | 결정 | 수준 | 상태 | 승인 내용 | 남은 검증 또는 재검토 조건 |
| --- | --- | --- | --- | --- | --- |
| D-001 | P0와 금전 리워드 경계 | Level 3 | Accepted | Reward Eligibility까지만 구현, 결제·참가비·정산 제외 | 실제 금전 지급 전에 법률·부정행위·정산 정책 재결정 |
| D-002 | Proof 입력 방식 | Level 3 | Accepted | 앱 내 Camera Capture만 허용, 사진첩·Screenshot·파일 업로드 차단 | 기기별 Camera API와 권한 실패 E2E 검증 |
| D-003 | P0 Proof 인정 방식 | Level 3 | Accepted | AI·Operator 내용 검수 없이 기술 검증과 저장 성공 즉시 `accepted` 및 Score 확정 | 정식 서비스 AI Monitoring은 별도 Level 3 결정 |
| D-004 | Deadline과 기준 시간대 | Level 3 | Accepted | Asia/Seoul, 매일 00:00 해금, 다음 날 00:00 미만을 당일로 판정 | 장애 연장 절차와 시간 경계 테스트 |
| D-005 | baseScore와 지연 배율 | Level 3 | Accepted | 모든 Mission 100점, 당일 1.0, 다음 날 0.7, 2일 이상 0.4, 미제출 0 | `proofCloseAt` 경계 테스트 |
| D-006 | scoreRate 계산식 | Level 3 | Accepted | 유효 Score 합 ÷ 유효 Mission 최대 Score 합, 운영 취소 Mission 분모 제외 | 정책 버전과 취소 절차 계약 |
| D-007 | 중도 참가와 이탈 | Level 3 | Accepted | 시작 후 참가 불가, 미수행 자동 탈락 없음, 명시적 철회만 기록 | 철회 확인 UX와 재참가 금지 테스트 |
| D-008 | Project Pivot | Level 3 | Accepted | Day 10 종료 전 1회, 이전 이력·Score 보존, Final Submission은 최신 Project 기준 | 날짜 경계와 동시 변경 테스트 |
| D-009 | Ranking 갱신과 동점 | Level 3 | Accepted | 00:00 KST 기준 마감, 00:05 Snapshot. Score→정시 제출 수→마지막 기여 제출시각→공동 순위 | 실패 시 이전 Snapshot 유지와 idempotent 재실행 |
| D-010 | 공개 프로필 범위 | Level 3 | Accepted | 같은 코호트에 닉네임·기본 아이콘·Score·Rank만 공개 | 개인정보·권한 E2E 검증 |
| D-011 | 인증과 계정 복구 | Level 3 | Accepted · 2026-09-17 개정 | P0 Participant는 Google OAuth만 사용하고 이메일 OTP 제외. Google 계정 복구 사용. Operator TOTP MFA 원칙 유지 | [Participant 인증 개정](../decisions/2026-09-17-p0-participant-authentication.md). Google 공급자·세션 검증, Operator 인증·복구는 구현 전 별도 보안 설계 |
| D-012 | 역할과 권한 모델 | Level 3 | Accepted | Participant와 Operator 분리, 서버 검사와 Postgres RLS 이중 적용 | 역할 저장 위치와 권한 행렬 설계 |
| D-013 | Proof 보존과 삭제 | Level 3 | Accepted | Private 저장, `proofCloseAt` 후 30일에 원본 자동 삭제 | 개인정보 문구·외부 처리자·법적 예외와 삭제 재처리 검증 |
| D-014 | 기술 기반 | Level 3 | Accepted | Next.js TypeScript PWA + Vercel + Supabase Postgres/Auth/Private Storage | 요금제·데이터 처리 지역·약관·복구·교체 비용 검토 |
| D-015 | 지원 브라우저와 기기 | Level 2 | Accepted | iOS Safari·Android Chrome 최신 2개 주요 버전, Operator Desktop Chrome·Edge 최신 2개 | 실제 기기 Camera 권한·백그라운드·회전 테스트 |
| D-016 | 성능·가용성·복구 | Level 3 | Accepted | 최대 456명, API p95 1초, LCP p75 2.5초, DB RPO 24시간·RTO 4시간 최소선 | 동시 업로드·Storage 용량/비용·Proof 복구 시험 |
| D-017 | Fruvi 출시 범위 | Level 3 | Accepted | P1, P0 안정화 후 Context Guide부터 | AI 공급자와 개인정보 결정 후 Ready 재판정 |
| D-018 | 알림 출시 범위 | Level 3 | Accepted | P1, P0는 앱 내 상태만 제공 | Daily Open·Deadline 알림을 별도 Ready로 진행 |
| D-019 | 개인 성공과 측정 | Level 3 | Accepted | `scoreRate >= 0.85 AND mvpSubmitted = true`; 코호트 KPI 목표값은 첫 데이터 후 결정 | Analytics 계약의 분모·제외 사용자 확정 |
| D-020 | 31개 Mission 구조·콘텐츠 | Level 3 | Accepted | 매일 해금 후 다시 잠기지 않고 Day 31 종료+72시간까지 제출; 구조 먼저 개발, 내용은 코호트 전 잠금 | 31개 개별 콘텐츠 리뷰와 Seed 버전 검증 |

## 핵심 정책 상세

### P0 Proof와 정식 서비스 AI Monitoring

P0의 목적은 Camera Proof 제출, Score와 Ranking의 기본 제품 루프를 검증하는 것이다.

```text
앱 내 Camera Capture
→ 인증·소유권·시간·이미지 형식·크기·중복·저장 기술 검증
→ capture_auto_accept
→ Score Event 한 번 생성
```

- 사진첩, Screenshot과 일반 파일 선택 UI 또는 API를 제공하지 않는다.
- `accepted`는 촬영 경로와 기술 정책을 충족했다는 뜻이며 Mission 수행 진위의 승인이 아니다.
- P0에서는 AI와 Operator가 사진 내용을 판정하지 않는다.
- 신고나 기술 오류는 Operator가 원본 이력을 지우지 않고 보정한다.
- 정식 서비스에서는 별도 결정 후 `pending_ai_review → accepted/rejected`를 도입하고 AI 승인 뒤 Score를 만든다.
- AI 전환 전에 공급자, 입력 데이터, 보존, 오탐·미탐, 이의제기, 사람 대체와 장애 시 행동을 승인한다.

웹 Camera Capture는 W3C Media Capture and Streams의 `getUserMedia()` 계열 API를 사용한다. 이 통제는 앱에 사진첩·파일 선택 경로를 제공하지 않는다는 뜻이며 촬영 대상 자체가 조작되지 않았음을 보장하지 않는다.

### Mission, Score와 Reward Eligibility

- 각 Mission은 해당 Day의 00:00 KST에 해금되고 다시 잠기지 않는다.
- `proofCloseAt`은 Day 31 종료 후 72시간이다.
- Score는 baseScore 100에 제출 지연 배율을 적용한다.
- P0는 유효 Camera Proof 저장 직후 Score를 표시한다.
- Reward Eligibility는 Ranking과 무관하게 `scoreRate >= 0.85 AND mvpSubmitted = true`로 판정한다.
- Final Submission은 HTTPS URL 형식과 필수 입력의 저장을 확인하며 P0에서 내용이나 사업 성공 여부를 판정하지 않는다.

### Ranking Snapshot

- Participant의 누적 Score는 제출 직후 갱신한다.
- Ranking은 매일 00:00 KST까지의 확정 Score를 기준으로 00:05에 Snapshot을 만든다.
- 완전 동점에는 공동 순위를 사용한다.
- Snapshot 실패 시 이전 결과와 마지막 갱신시각을 유지하고 중복 없이 재실행한다.

### Mission 콘텐츠 분리

Mission의 id, day, phase, 공개시각, 종료시각, baseScore와 정책 버전을 구조로 먼저 구현한다. 개발 중 샘플 Mission으로 흐름을 검증할 수 있지만 실제 코호트 시작 전에는 31개 모두 제목, 목적, 가이드, 완료 기준, 예시와 예상 시간을 검수하고 버전을 잠근다.

## 승인 범위와 조건

- 재확인자: PO (@ths4114-cloud)
- 최초 정책 기록일: 2026-09-12 (`a0dd286`)
- 확인 가능한 PO 재확인일: 2026-09-17 ([Issue #4](https://github.com/ths4114-cloud/PROOVIT/issues/4))
- 재확인 범위: D-001부터 D-020의 P0 제품·기술 방향
- 명시적 변경: D-002는 Camera 전용, D-003은 P0 자동 인정, D-009는 일 1회 Ranking
- 후속 개정: D-011의 Participant 인증은 2026-09-17 PO 승인으로 Google OAuth 전용으로 변경했다. 이메일 OTP는 P0에서 제외하며 Operator TOTP MFA 원칙은 유지한다.
- 후속 의무: 정식 서비스 AI Monitoring은 이번 승인에 포함되지 않으며 별도 Level 3 결정이 필요하다.
- 조건부 항목: 기술 서비스 결제, 개인정보 최종 문구와 운영 출시 승인은 이번 승인에 포함되지 않는다.

## 참조 기록

| 자료 | 확인일 | 채택할 점 | 현재 채택하지 않을 점 |
| --- | --- | --- | --- |
| [W3C Media Capture and Streams](https://www.w3.org/TR/mediacapture-streams/) | 2026-09-12 | 앱 내 Camera 권한과 Stream Capture 기반 | Camera 경로가 사진 내용의 진위를 보장한다는 주장 |
| [OWASP ASVS 5.0.0](https://owasp.org/www-project-application-security-verification-standard/) | 2026-09-12 | 웹 보안 요구사항과 검증 기준 후보 | 모든 항목의 무차별 적용 |
| [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) | 2026-09-12 | 실제 파일 유형, 크기, 생성 파일명, 비공개 저장과 권한 | Camera 경로만으로 파일 검증 생략 |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | 2026-09-12 | Auth와 DB 권한의 이중 보호 | RLS만으로 서버 검증 대체 |
| [Supabase Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control) | 2026-09-12 | Private Storage와 객체 접근 정책 | 공개 Proof URL |
| [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps) | 2026-09-12 | 하나의 웹 코드베이스와 PWA 기반 | Native App을 함께 개발 |
| [WCAG 2.2](https://www.w3.org/TR/wcag/) | 2026-09-12 | AA 접근성 목표 후보 | 자동 검사만으로 준수 판정 |

## 구현 전 남은 문서

승인으로 제품 정책은 닫혔지만 구현은 아직 [Definition of Ready](../DEFINITION_OF_READY.md)를 통과하지 않았다. Architecture, Database, API, Security, Test Strategy, Wireframe과 Vertical Slice Issue를 작성하고 조건부 결정의 검증 방법을 연결해야 한다.
