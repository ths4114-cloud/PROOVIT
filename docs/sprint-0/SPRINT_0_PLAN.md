# PROOVIT Sprint 0 Plan

- 문서 상태: Draft
- 최종 수정일: 2026-09-12
- 권장 Timebox: 집중 작업일 5일, 핵심 결정 미승인 시 연장
- 목표: 첫 Vertical Slice가 추측 없이 [Definition of Ready](../DEFINITION_OF_READY.md)를 통과하게 한다
- 관련 문서: [PRD](../product/PRD.md), [사용자 흐름](../product/USER_FLOWS.md), [결정 목록](DECISION_REGISTER.md)

Sprint 0는 코드를 많이 만드는 기간이 아니다. 제품 정책, 사용자 흐름, 데이터 책임과 검증 방법을 합의해 잘못된 기반 위에 기능을 쌓는 위험을 줄이는 기간이다. 종료일보다 Exit Criteria 충족을 우선한다.

## 1. Sprint 0 목표

- 원본 기획과 PRD를 하나의 공식 Markdown 기준으로 정리한다.
- 핵심 정책의 대안, 추천과 PO 승인 범위를 기록한다.
- 정상 흐름뿐 아니라 오류, 권한, 중복, 동시성, 부분 실패와 복구를 정의한다.
- Launch MVP와 이후 기능의 경계를 확정한다.
- 기술 기반을 공식 자료와 위험 분석으로 비교한다.
- 첫 Vertical Slice의 계약, 작업 단위와 검증 방법을 준비한다.
- GitHub Issue, 브랜치, PR과 CI를 이용할 최소 협업 기반을 만든다.

## 2. 이번 Sprint의 Scope

### 포함

- PRD 0.2 검토와 승인 준비
- 공식 용어와 상태 모델
- Participant와 Operator User Flow
- 핵심 화면의 로우파이 와이어프레임
- Level 3 제품 정책 결정 자료
- 인증·권한·DB·파일 저장소·배포 대안 조사
- 시스템 Context와 도메인 경계 초안
- 데이터 모델과 API 계약 초안
- 보안·개인정보·접근성·운영 위험 분석
- Vertical Slice의 Issue, Acceptance Criteria와 테스트 전략
- 저장소 구조, 개발 명령, 환경변수 템플릿과 CI 초안

### 제외

- 전체 UI 구현
- 31개 Mission의 최종 콘텐츠 제작
- 운영 DB와 실제 사용자 데이터 생성
- 결제 또는 리워드 정산
- AI Proof 판정
- Fruvi Chat과 Push 구현
- 정식 운영 배포

조사 Spike가 필요하면 운영 코드와 분리하고 폐기 또는 채택 조건을 기록한다.

## 3. 산출물과 책임 문서

| 산출물 | 목적 | 완료 조건 |
| --- | --- | --- |
| `docs/product/PRD.md` | 제품 범위와 요구사항 | 미결정과 확정이 구분되고 AC와 출시 Gate가 있음 |
| `docs/product/USER_FLOWS.md` | 정상·실패·복구 흐름 | Participant와 Operator의 핵심 상태를 포함 |
| `docs/product/GLOSSARY.md` | 팀 공통 언어 | 문서·UI·코드 용어 충돌이 없음 |
| `docs/sprint-0/DECISION_REGISTER.md` | 의사결정 추적 | 차단 결정에 대안·추천·PO 질문이 있음 |
| `docs/decisions/*.md` | 승인된 장기 결정 | Level 3 결정자·날짜·범위·근거가 있음 |
| `docs/architecture/ARCHITECTURE.md` | 시스템 책임과 경계 | UI·서버·저장소·외부 의존 책임이 구분됨 |
| `docs/architecture/DATABASE.md` | 데이터·불변조건·권한 | 키, 관계, 제약, 삭제와 migration 전략이 있음 |
| `docs/architecture/API.md` | 입력·출력·오류·권한 | Vertical Slice 계약과 idempotency가 정의됨 |
| `docs/SECURITY.md` | 위협과 검증 기준 | Proof·Auth·Operator 위험과 통제가 연결됨 |
| `docs/TEST_STRATEGY.md` | 위험 기반 검증 | 단위·통합·E2E와 CI 역할이 정의됨 |
| Wireframe | 화면 상태와 전환 검증 | 정상·로딩·빈 상태·오류·권한 상태 포함 |
| Vertical Slice Issue | 첫 구현의 Ready 증거 | Owner, Reviewer, 범위, AC, 계약, 검증이 있음 |

아직 존재하지 않는 문서는 완료된 것으로 표시하지 않는다.

## 4. 작업 순서

### Day 1 Product Baseline

- 원본 기획과 PRD의 충돌 목록 확인
- Launch MVP와 발표용 Demo 분리
- 공식 용어와 제품 상태 정의
- D-001부터 D-010까지 PO 결정 세션 준비
- PRD와 User Flow 1차 리뷰

종료 조건:

- PO가 무엇을 결정해야 하는지 쉬운 말로 이해할 수 있다.
- 승인되지 않은 정책을 구현 기준으로 표시한 곳이 없다.

### Day 2 User Flow and Wireframe

- Participant Golden Path 와이어프레임
- Proof 오류·반려·재제출 흐름
- Ranking 동점·Rival 없음 상태
- Final Submission과 Reward Eligibility 상태
- Operator 검수와 정정 흐름
- 모바일·키보드·카메라 대체 경로 검토

종료 조건:

- 화면마다 진입 조건, 사용자 행동, 서버 결과와 실패 상태가 연결된다.
- 디자인이 미정 정책을 숨기지 않는다.

### Day 3 Architecture and Data Decisions

- PWA와 Native App 비교
- Backend, Auth, DB, Storage와 Hosting 대안 비교
- Participant와 Operator 권한 모델
- Challenge, Mission, Participation, Project, Proof, Score Event 관계
- 정책 버전, idempotency와 상태 전이
- migration, Seed와 환경 분리 전략

종료 조건:

- Level 3 추천과 대안이 Engineering Decision 형식으로 준비된다.
- 핵심 판정의 서버 권위와 데이터 불변조건이 명확하다.

### Day 4 Security Quality and Operations

- Auth, 권한, Proof 파일과 Operator 위협 모델
- 개인정보 수집·보존·삭제 항목
- 단위·통합·E2E 테스트 경계
- 로깅, 오류 추적과 분석 이벤트
- Preview, Staging, Production 환경과 비밀 관리
- 배포·migration·rollback·restore 초안

종료 조건:

- 각 주요 위험에 예방, 발견, 대응 또는 수용 근거가 있다.
- 운영과 복구가 후속 메모가 아니라 요구사항에 연결된다.

### Day 5 Vertical Slice Ready Review

- 첫 Vertical Slice 범위와 Out of Scope 확정
- 화면, API, DB와 권한 계약 연결
- Acceptance Criteria와 테스트 케이스 작성
- Feature Owner와 Reviewer 후보 지정
- 작업 브랜치와 PR 분할
- Definition of Ready 점검
- 독립 문서 리뷰와 수정

종료 조건:

- 모든 적용 가능한 Ready 항목이 통과하거나 명시된 차단 상태다.
- 첫 구현 PR이 다른 기능을 추측하지 않고 시작 가능하다.

## 5. Sprint 0 Backlog

### Product and Policy

- S0-001 PRD 0.2 검토와 PO 승인 준비
- S0-002 Reward와 실제 금전 범위 결정
- S0-003 Proof 입력·검수·재제출 정책 결정
- S0-004 Deadline, Score와 Ranking 정책 결정
- S0-005 참가·이탈·Pivot 정책 결정
- S0-006 North Star와 파일럿 성공 기준 결정
- S0-007 31개 Mission 콘텐츠 제작 계획

### UX

- S0-101 Participant Golden Path 와이어프레임
- S0-102 Proof 실패와 복구 상태 와이어프레임
- S0-103 Ranking·Final Submission·Eligibility 와이어프레임
- S0-104 Operator Console 와이어프레임
- S0-105 접근성 및 카메라 대체 흐름 검토

### Architecture and Data

- S0-201 기술 기반 Reference 조사
- S0-202 System Context와 모듈 책임
- S0-203 데이터 모델, 불변조건과 삭제 규칙
- S0-204 Vertical Slice API 계약
- S0-205 AuthN, AuthZ와 Operator 권한 모델
- S0-206 파일 저장, 접근과 부분 실패 복구

### Quality and Operations

- S0-301 테스트 전략과 CI Gate
- S0-302 환경변수와 비밀 관리
- S0-303 위협 모델과 보안 요구사항
- S0-304 분석 이벤트와 로그 기준
- S0-305 배포, migration, rollback과 restore 초안
- S0-306 지원 브라우저·기기와 성능 목표

### Collaboration

- S0-401 GitHub main 보호 설정
- S0-402 Issue Template과 작업 라벨
- S0-403 PR 소유자·Reviewer·공유 영역 기록 방식 확인
- S0-404 개발 환경 설치와 검증 명령 문서화

## 6. 권장 Issue 분할

각 Issue는 하나의 검토 가능한 결과를 가진다. 문서 전체를 한 Issue로 묶지 않는다.

- `docs: approve launch scope and reward boundary`
- `docs: define proof lifecycle and verification policy`
- `docs: define score deadline and ranking policy`
- `design: create participant golden path wireframes`
- `design: create operator proof review wireframes`
- `architecture: compare application platform options`
- `architecture: define vertical slice contracts`
- `security: model proof upload and access threats`
- `quality: define test strategy and CI gates`

## 7. 첫 Vertical Slice 제안

### 사용자 행동

로그인한 Participant가 Project를 설정하고 하나의 Mission에 이미지 Proof를 제출한다. Operator가 승인하면 Score Event가 정확히 한 번 생성되고 Participant가 확정 Score를 확인한다.

### 포함

- 최소 인증 경로
- Participant와 Operator 권한
- Project 저장
- Mission 조회
- Proof 업로드와 pending_review
- Operator 승인·반려
- Score Event와 사용자 Score 표시
- 정상·오류·중복·권한 테스트

### 제외

- 31일 전체 Board
- Ranking과 Rival
- Final Submission
- Reward Eligibility
- Fruvi와 Push
- 실제 금전 처리

### 주요 Acceptance Criteria 후보

- Participant는 자신의 Project와 Proof만 조회한다.
- 허용되지 않은 파일과 크기를 서버가 거부한다.
- 업로드 또는 DB 실패 후 잘못된 승인 상태가 남지 않는다.
- Operator가 아닌 사용자는 Proof를 승인할 수 없다.
- 같은 승인 요청을 반복하거나 동시에 실행해도 Score Event가 하나만 생긴다.
- 반려된 Proof는 Score를 만들지 않으며 사용자가 사유를 확인한다.
- Score는 서버의 정책과 제출 시각으로 계산한다.

정확한 AC는 D-002부터 D-006, D-011부터 D-014 승인 후 확정한다.

## 8. Sprint 0 Exit Criteria

다음 조건이 모두 충족되어야 Sprint 0를 완료로 판정한다.

- Launch MVP P0와 Out of Scope가 PO 승인됨
- 핵심 제품 정책에 Accepted 결정 기록이 있음
- Participant와 Operator User Flow 및 핵심 Wireframe이 검토됨
- 기술 기반, 권한, 데이터와 파일 저장 결정이 승인됨
- Vertical Slice의 API, 데이터, 권한과 오류 계약이 있음
- 보안·개인정보·접근성·운영 위험과 검증 계획이 있음
- Vertical Slice Issue가 Definition of Ready를 통과함
- Feature Owner와 별도 Reviewer가 지정됨
- 브랜치, PR 분할과 공유 영역 충돌 위험이 기록됨
- 필요한 CI가 정의되고 실행 가능한 명령이 저장소에 있음
- 문서 자체 검토와 가능한 독립 리뷰의 결과가 기록됨

현재는 PO 혼자 작업 중이므로 사람 Reviewer와 협업자 지정 항목은 차단 상태로 남을 수 있다. 이 경우 Sprint 0 자료 작성은 완료할 수 있지만 `병합 가능` 또는 구현의 최종 Ready로 표시하지 않는다.

## 9. 검토 방법

### Builder 자체 점검

- 원본 기획과 PRD의 요구사항이 누락되지 않았는가
- 발표용 가정이 출시 정책으로 잘못 확정되지 않았는가
- 정상 흐름 외 오류·권한·중복·부분 실패가 포함됐는가
- 제품, 데이터, 보안과 운영 문서의 용어가 일치하는가
- 제안과 승인이 구분됐는가

### 독립 리뷰

- 다른 세션 또는 팀원이 PRD, User Flow와 Decision Register를 원본 자료와 대조한다.
- 차단 지적은 파일·위치·영향·근거와 최소 수정안을 기록한다.
- AI 자체 점검을 사람 승인으로 표시하지 않는다.

## 10. 현재 상태

- PRD 0.2: Draft 작성
- User Flow: Draft 작성
- Glossary: Draft 작성
- Decision Register: Proposed 추천 작성
- PO 승인: 미실행
- Wireframe: 미작성
- Architecture, Database, API: 미작성
- Security, Test Strategy: 미작성
- Vertical Slice Ready: 미통과
- 사람 Reviewer: 미지정
- CI: 미설정

따라서 현재 단계는 `Sprint 0 기반 문서 작성 중`이며 구현 시작 상태가 아니다.
