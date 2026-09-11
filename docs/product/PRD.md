# PROOVIT Launch MVP Product Requirements Document

- 문서 상태: Draft
- 버전: 0.2
- 최종 수정일: 2026-09-12
- 제품 책임자: PO
- 공식 승인 상태: 미승인
- 관련 문서: [사용자 흐름](USER_FLOWS.md), [용어집](GLOSSARY.md), [Sprint 0 계획](../sprint-0/SPRINT_0_PLAN.md), [결정 목록](../sprint-0/DECISION_REGISTER.md)

이 문서는 PROOVIT의 첫 정식 출시 범위를 정의한다. 여기서 Launch MVP는 발표용 데모가 아니라, 제한된 사용자에게 실제로 제공하고 운영할 수 있는 최소 제품을 뜻한다. 보안, 개인정보, 오류 복구, 운영자 기능과 검증을 제품 범위에 포함한다.

`제안됨`으로 표시된 정책은 구현 기준이 아니다. [결정 목록](../sprint-0/DECISION_REGISTER.md)에서 PO 승인 후 `확정` 상태로 바뀌어야 한다.

## 1. 제품 정의

PROOVIT은 사용자의 Goal을 검증 가능한 일일 Mission으로 전환하고, 사용자가 제출한 Proof를 확인해 Score와 Ranking에 반영함으로써 실행을 지속시키는 Goal Competition 서비스다.

첫 출시 범위는 솔로프리너가 31일 안에 공개 가능한 제품 또는 서비스를 완성하는 Launch Challenge다. 사용자가 계획을 세우거나 완료 버튼만 누르는 행위는 성과로 인정하지 않는다. 확인 가능한 실행 결과가 있는 경우에만 Score를 확정한다.

핵심 제품 루프는 다음과 같다.

```text
Goal → Mission → Execution → Proof → Verification → Score → Ranking → Reward Eligibility
```

## 2. 출시 목표와 제외 목표

### 2.1 출시 목표

- 참가자가 챌린지의 기간, 규칙과 완료 조건을 이해하고 참여할 수 있다.
- 참가자가 매일 해야 할 핵심 행동과 완료 기준을 이해할 수 있다.
- 참가자가 실제 결과물을 Proof로 제출하고 처리 상태를 확인할 수 있다.
- 시스템이 승인된 Proof와 제출 시각을 기준으로 Score를 일관되게 계산한다.
- 참가자가 자신의 진행 상태와 경쟁 상태를 확인할 수 있다.
- 참가자가 최종 공개 URL을 제출하고 Reward Eligibility 결과를 확인할 수 있다.
- 운영자가 Mission, 참가자, Proof와 예외 상황을 안전하게 운영할 수 있다.
- 운영 중 실패를 발견하고 진단하며 필요한 경우 복구할 수 있다.

### 2.2 이번 출시에서 검증할 제품 가설

- 구체적인 일일 Mission은 사용자가 다음 행동을 결정하는 부담을 줄인다.
- Proof 제출은 단순 자가 체크보다 실제 실행을 더 정확하게 기록한다.
- 제출 시점에 따른 Score와 Ranking은 정시 실행을 촉진한다.
- 31일 구조와 최종 공개 URL 제출은 실제 출시 결과를 늘린다.

가설은 사실로 확정하지 않는다. 분석 이벤트와 사용자 조사를 통해 검증한다.

### 2.3 제외 목표

- 모든 종류의 개인 Goal을 지원하는 범용 목표 관리 서비스
- 팀 프로젝트 관리, Kanban, Sprint 또는 협업 문서
- Social Feed, 댓글, DM
- GitHub, GPS, Wearable, Calendar 등 외부 Proof 자동 연동
- AI가 사업 방향이나 성공 가능성을 확정하는 기능
- AI 단독 Proof 판정
- 참가비 결제, 상금 정산과 환불
- 여러 Challenge를 사용자가 자유롭게 생성하는 기능

## 3. 대상 사용자

### 3.1 Primary User

아이디어를 공개 가능한 MVP로 만들고 싶지만 외부 마감과 실행 리듬이 부족한 솔로프리너다.

대표 상황은 다음과 같다.

- 제품 또는 서비스 아이디어가 있으나 다음 행동을 정하는 데 시간이 걸린다.
- 시장조사, 고객 인터뷰, 설계, 제작과 출시를 혼자 수행한다.
- 외부 마감이나 동료가 없으면 실행을 미룬다.
- 한 달 안에 확인 가능한 결과물을 만들고 싶다.

### 3.2 User Entry Conditions

- Challenge 시작일 전에 참가할 수 있다.
- 하나의 Challenge에서 실행할 프로젝트를 하나 등록한다.
- Mission 수행 결과를 제출하는 데 동의한다.
- 공개 URL을 제출할 수 있는 프로젝트를 목표로 한다.

중도 참가, 프로젝트 변경과 탈락 정책은 Sprint 0에서 확정한다.

## 4. 사용자와 운영 역할

### Participant

- Challenge 규칙을 확인하고 참가한다.
- Project를 설정한다.
- Mission을 확인하고 Proof를 제출한다.
- 자신의 Score, Ranking과 Reward Eligibility를 확인한다.
- 자신의 Final Submission을 제출한다.
- 자신의 계정과 개인정보 권리를 행사한다.

### Operator

- Challenge와 Mission 내용을 관리한다.
- 참가자와 Proof 상태를 조회한다.
- Proof를 승인하거나 반려하고 사유를 기록한다.
- 잘못된 판정을 정정하되 이력을 보존한다.
- 신고, 문의와 운영 예외를 처리한다.

### System

- 서버 시간을 기준으로 Mission과 제출 기한을 관리한다.
- 권한과 데이터 소유권을 확인한다.
- Proof 상태 전이, Score와 Reward Eligibility를 판정한다.
- Ranking을 계산하고 사용자에게 허용된 정보만 공개한다.
- 주요 사건과 실패를 관측 가능한 형태로 기록한다.

## 5. Launch MVP 범위

### P0 Product Loop

- Account 등록, 로그인, 로그아웃과 세션 관리
- Challenge 소개, 규칙 확인, 참가와 참가 상태
- Project 생성과 허용된 범위의 수정
- 31일 Mission Board와 Phase 표시
- Daily Mission, 목적, 수행 가이드, 완료 기준과 Proof 예시
- Proof 촬영 또는 허용된 이미지 업로드
- Proof 제출, 처리 상태, 반려 사유와 재제출
- 운영자 Proof 검수
- 서버의 Score 계산과 Score Event 이력
- My Ranking, 허용된 범위의 Leaderboard와 Rival
- Final Submission과 공개 URL 검증
- Reward Eligibility 판정
- 계정 정보 조회와 데이터 삭제 요청 경로

### P0 Operations and Quality

- Operator 권한과 감사 가능한 관리 행위
- Mission Seed 및 변경 절차
- 입력 검증, 오류 상태와 재시도
- Proof 파일 접근 제어와 보존·삭제 정책
- 핵심 분석 이벤트
- 구조화 로그, 오류 추적과 운영 확인 절차
- DB migration, 백업·복구와 배포 절차
- 지원 브라우저·기기 범위와 접근성 기준

### P1 Product Differentiation

- Project와 Current Mission Context를 이용하는 Fruvi Guide
- 제한된 질문 범위의 Fruvi Chat
- Daily Mission과 Deadline 알림
- Rank Change 피드백
- 사용자 설정에 따른 알림 수신 거부

P1은 P0 운영 안정성과 데이터 보호가 확인된 뒤 별도 Ready 판정을 거친다.

## 6. Challenge 구조

Challenge는 31개의 Mission으로 구성한다. 실제 시작일과 종료일은 Challenge 데이터로 관리하며 문서에 특정 연도의 날짜를 고정하지 않는다.

초기 Phase 구성안은 다음과 같다.

| Phase | Day | 사용자 결과 예시 |
| --- | --- | --- |
| DEFINE | 1-5 | 프로젝트와 해결할 문제 정의 |
| DISCOVER | 6-10 | 시장 및 경쟁 대안 조사 |
| VALIDATE | 11-18 | 잠재 고객 검증 |
| DESIGN | 19-23 | 핵심 기능과 사용자 흐름 설계 |
| BUILD | 24-29 | 공개 가능한 핵심 흐름 구현 |
| LAUNCH | 30-31 | 공개 URL 준비와 제출 |

31개 Mission의 제목, 목적, 가이드, 완료 기준, 허용 Proof 유형과 예시는 콘텐츠 검수 후 별도 Seed 데이터로 버전 관리한다.

## 7. 핵심 정책과 불변조건

다음 조건은 제품의 데이터 무결성을 보호한다. 미결정 정책의 구체값은 Sprint 0 결정 후 반영한다.

- 보호된 작업은 로그인뿐 아니라 자원 소유권과 역할을 서버에서 확인한다.
- 클라이언트가 보낸 userId, Score, Rank, Reward Eligibility와 권한을 신뢰하지 않는다.
- 동일 Participant와 Mission에 확정 상태의 유효 Proof는 하나만 존재한다.
- 동일 Proof 승인으로 Score가 두 번 지급되지 않는다.
- Score는 승인된 Proof, 서버가 기록한 제출 시각과 승인된 정책 버전으로 계산한다.
- Ranking은 확정된 Score만 사용한다.
- Reward Eligibility는 서버에서 계산하며 Ranking 자체는 자격 조건이 아니다.
- Proof 파일은 기본적으로 비공개이며 권한이 있는 Participant와 Operator만 접근한다.
- Proof와 Score의 상태 변경은 원인, 행위자와 시각을 추적할 수 있어야 한다.
- 외부 파일 저장소와 DB 사이의 부분 실패는 고립된 파일이나 잘못된 상태를 복구할 수 있어야 한다.
- 정책 변경은 이미 확정된 과거 Score를 조용히 다시 계산하지 않는다. 재계산이 필요하면 범위와 이력을 명시한다.

## 8. 기능 요구사항

### FR-01 Account and Session

목적은 Participant와 Operator를 식별하고 각자 허용된 데이터에만 접근하게 하는 것이다.

Acceptance Criteria:

- 사용자는 지원되는 인증 방식으로 가입하고 로그인할 수 있다.
- 인증 오류는 계정 존재 여부와 내부 정보를 불필요하게 노출하지 않는다.
- 로그아웃 또는 세션 만료 후 보호된 화면과 파일에 접근할 수 없다.
- Participant는 다른 Participant의 Project, 비공개 Proof와 Final Submission 원본에 접근할 수 없다.
- Operator 기능은 서버가 Operator 역할을 확인한 경우에만 실행된다.

인증 공급자와 계정 복구 방식은 Level 3 기술 결정이다.

### FR-02 Challenge Entry

Acceptance Criteria:

- 사용자는 Challenge 이름, 목적, 기간, 참가 가능 상태와 시간대를 확인할 수 있다.
- Mission, Proof, Score, Ranking과 Reward Eligibility 규칙을 참가 전에 확인할 수 있다.
- 실제 금전 지급이 없는 경우 이를 명확히 표시한다.
- 참가가 닫혔거나 이미 참가한 경우 적절한 상태와 다음 행동을 보여준다.
- 참가 요청을 반복하거나 동시에 보내도 Participant가 중복 생성되지 않는다.

### FR-03 Project Setup

입력 후보는 Project Name, Target Customer, Current Stage, Available Time per Day와 Project Icon이다.

Acceptance Criteria:

- 필수 입력이 누락되거나 허용 길이를 넘으면 저장하지 않고 수정할 위치를 알려준다.
- 저장 성공 후 Mission Board로 이동하고 저장된 내용을 다시 확인할 수 있다.
- 저장 실패 시 입력을 잃지 않고 재시도할 수 있다.
- Project 수정 가능 기간과 횟수는 승인된 정책을 따른다.
- Project 변경 이력을 필요한 기간 동안 추적한다.

### FR-04 Mission Board

Acceptance Criteria:

- Day 1부터 Day 31과 Phase를 표시한다.
- 완료, 진행 중, 승인 대기, 반려, 미완료, 잠금 상태를 시각과 텍스트로 구분한다.
- 현재 사용자가 수행할 수 있는 Mission에 바로 접근할 수 있다.
- 미래 Mission은 승인된 공개 정책에 따라 내용을 숨기거나 읽기 전용으로 표시한다.
- Board 데이터를 불러오지 못하면 오류와 재시도 방법을 보여준다.

### FR-05 Daily Mission

Mission은 최소한 id, day, phase, title, purpose, guide, completionCriteria, proofExamples, allowedProofTypes, baseScore와 policyVersion을 가진다.

Acceptance Criteria:

- 사용자는 해야 할 행동, 완료 기준, 허용 Proof와 제출 기한을 구분해 이해할 수 있다.
- Project Context에 따른 Guide가 있더라도 공통 완료 기준과 Score 정책은 바뀌지 않는다.
- 잠긴 Mission이나 참가하지 않은 Challenge에 대한 제출을 서버가 거부한다.

### FR-06 Proof Submission

Acceptance Criteria:

- 사용자는 허용된 방식으로 Proof를 촬영하거나 업로드하고 제출 전 미리 볼 수 있다.
- 서버는 확장자뿐 아니라 실제 파일 유형, 크기와 이미지 처리 가능 여부를 검증한다.
- 저장 파일명과 접근 경로는 사용자가 제어할 수 없다.
- 업로드 성공과 DB 저장 사이에 부분 실패가 발생하면 재시도 또는 정리할 수 있다.
- 동일 제출의 재시도와 동시 요청으로 Proof가 중복 생성되지 않는다.
- 제출 결과는 `processing`, `pending_review`, `approved`, `rejected` 또는 복구 가능한 오류 상태로 표시한다.
- 반려된 Proof는 사유와 재제출 가능 여부를 보여준다.

허용 파일 유형, 크기, 촬영 강제 여부와 보존 기간은 Sprint 0에서 결정한다.

### FR-07 Proof Verification

Acceptance Criteria:

- Operator는 검수 대기 목록과 Mission의 완료 기준을 함께 확인할 수 있다.
- 승인 또는 반려에는 Operator, 처리 시각과 사유가 기록된다.
- 이미 처리된 Proof에 대한 중복 요청은 Score를 중복 생성하지 않는다.
- 권한 없는 사용자는 검수 기능과 다른 사용자의 Proof 파일에 접근할 수 없다.
- 정정은 과거 기록을 삭제하지 않고 별도 이력으로 남긴다.

Launch MVP의 검수 방식은 관리자 수동 판정을 추천하며 PO 승인이 필요하다.

### FR-08 Score Calculation

제안된 기본 배율은 당일 1.0, 1일 지연 0.7, 2일 이상 지연 0.4, 미완료 0이다.

Acceptance Criteria:

- 서버는 Mission Deadline과 최초 유효 제출 시각을 같은 기준 시간대로 비교한다.
- Score Event는 Participant, Mission, Proof, baseScore, multiplier, finalScore, policyVersion과 발생 시각을 기록한다.
- 동일 Proof 승인에 대응하는 Score Event의 유일성을 DB와 서버 로직으로 보호한다.
- 승인 취소 또는 정정 시 원본 이력을 보존하는 보정 Event를 생성한다.
- 날짜 경계, 지연 구간, 윤년·일광절약시간 적용 여부와 서버 시간 오차를 테스트한다.
- UI는 서버가 반환한 Score를 표시하며 독자적으로 다시 계산하지 않는다.

시간대, 하루 Deadline, baseScore와 지연 기준은 PO 승인 전까지 확정되지 않는다.

### FR-09 Ranking and Rival

Acceptance Criteria:

- 사용자는 My Rank, My Score와 최근 Rank Change를 확인할 수 있다.
- Leaderboard는 승인된 공개 이름과 점수만 표시한다.
- 참여자가 충분한 경우 Nearest Upper Rival과 Nearest Lower Rival을 표시한다.
- 동점, 첫 참가자, 마지막 참가자와 참가자 부족 상태를 처리한다.
- Ranking 계산은 확정 Score만 사용하며 권한 없는 개인정보를 노출하지 않는다.

동점 규칙과 공개 프로필 범위는 PO 승인이 필요하다.

### FR-10 Final Submission

입력 후보는 Project Name, Public URL, One-line Description, Target Customer와 Launch Screenshot이다.

Acceptance Criteria:

- 사용자는 마감 전 허용된 기간에 제출하고 제출 내용을 다시 확인할 수 있다.
- URL은 형식과 허용 프로토콜을 검증하며 서버가 임의로 내부망 주소를 조회하지 않는다.
- 저장 실패 시 사용자가 입력한 내용을 보존하고 재시도할 수 있다.
- 제출 수정 가능 기간과 최종 확정 기준을 명확히 표시한다.
- 제출 성공만으로 Score 조건을 충족했다고 표시하지 않는다.

### FR-11 Reward Eligibility

제안된 규칙은 `scoreRate >= 0.85 AND mvpSubmitted = true`다. `mvpSubmitted`는 서버의 입력 검증을 통과해 Final Submission이 저장된 상태를 뜻한다.

Acceptance Criteria:

- scoreRate의 분모와 분자는 승인된 정책 버전으로 계산한다.
- Reward Eligibility는 서버가 계산하고 판정 근거를 사용자에게 설명한다.
- Ranking은 Reward Eligibility에 영향을 주지 않는다.
- Score 또는 Final Submission 정정 시 자격 결과도 일관되게 갱신하고 이력을 남긴다.
- 실제 상금 지급 기능이 없는 출시에서는 자격 판정과 금전 지급을 혼동하지 않게 표시한다.

### FR-12 Operator Console

Acceptance Criteria:

- Operator는 Challenge, Mission, Participant와 Proof를 허용된 범위에서 조회할 수 있다.
- 고위험 변경은 확인 단계와 감사 이력을 가진다.
- Mission 콘텐츠 변경이 진행 중 Challenge에 미치는 영향을 확인할 수 있다.
- Score와 Reward Eligibility를 임의 숫자로 직접 덮어쓰지 않는다.
- 운영 오류를 수정할 때 원인과 보정 이력이 보존된다.

### FR-13 Account and Data Rights

Acceptance Criteria:

- 사용자는 수집되는 정보와 이용 목적을 확인할 수 있다.
- 계정 삭제 또는 데이터 삭제 요청 경로가 제공된다.
- 법적·운영상 보존이 필요한 데이터는 범위와 기간을 구분한다.
- 삭제 요청 후 파일 저장소와 DB의 부분 실패를 확인하고 재처리할 수 있다.
- 로그와 분석 데이터에 불필요한 Proof 원문이나 개인정보를 남기지 않는다.

구체적인 보존 기간과 삭제 방식은 개인정보 검토 후 승인한다.

### FR-14 Fruvi Guide and Chat

P1 요구사항이다.

- Fruvi는 Project, Current Mission과 허용된 진행 Context만 사용한다.
- Fruvi는 Mission 안내와 수행 방법 설명을 지원한다.
- Fruvi는 사업 결정을 대신 확정하거나 성공을 보장하지 않는다.
- 응답 실패, 지연, 안전 제한과 Context 누락 상태를 사용자에게 알린다.
- 민감한 입력의 저장, 모델 제공자 전송과 보존 정책을 사용자에게 알린다.

### FR-15 Notification

P1 요구사항이다.

- 사용자는 알림 동의와 수신 상태를 확인하고 철회할 수 있다.
- 같은 사건으로 중복 알림을 보내지 않는다.
- 발송 실패의 재시도 횟수와 중단 조건을 가진다.
- Daily Mission Open과 Deadline Approaching부터 작은 범위로 시작한다.

## 9. 상태 모델

### Participation

```text
eligible → joined → active → completed
                    ↘ withdrawn
                    ↘ disqualified
```

`disqualified` 사용 여부와 조건은 미정이다. 정책 승인 전 구현하지 않는다.

### Proof

```text
draft → uploading → processing → pending_review → approved
                     ↘ failed         ↘ rejected → resubmitted
```

상태 전이 권한, 재시도와 보정 방식은 [사용자 흐름](USER_FLOWS.md)과 이후 API 계약에서 구체화한다.

## 10. 데이터 개념 모델

아래는 제품 개념이며 실제 DB 스키마 확정이 아니다.

- User: 계정의 안정적인 식별자와 상태
- Profile: 공개 이름, 아이콘과 사용자 설정
- Challenge: 기간, 시간대, 상태와 정책 버전
- Mission: Day, Phase, 내용, 완료 기준과 허용 Proof
- Participation: User와 Challenge의 참가 관계 및 진행 상태
- Project: Participation이 수행할 프로젝트 Context
- Proof: Mission 수행 결과, 제출 시각, 파일 참조와 검수 상태
- ProofReview: 검수 결과, Operator, 사유와 시각
- ScoreEvent: 점수 발생·보정의 변경 불가능한 이력
- FinalSubmission: 공개 URL과 최종 제출 상태
- RewardEligibility: 판정 결과, 근거와 정책 버전
- AuditEvent: 고위험 운영 행위의 추적 정보
- NotificationEvent: 알림 의도, 발송 상태와 중복 방지 키

스키마, 삭제 규칙과 권한 모델은 Level 3 결정 및 별도 검토를 거친다.

## 11. 비기능 요구사항

### Security

- 웹 보안 요구사항은 OWASP ASVS 5.0.0을 Sprint 0의 검증 기준 후보로 사용한다.
- 인증, 권한, 입력 검증, 파일 업로드, 세션과 감사 로그의 적용 수준을 위협 모델에 따라 선택한다.
- 비밀은 저장소에 넣지 않고 환경별 안전한 설정으로 관리한다.
- Proof 파일은 허용 목록, 실제 유형 확인, 크기 제한, 생성된 파일명과 비공개 접근을 기본으로 한다.
- 보안 요구사항과 실제 테스트의 연결을 추적한다.

### Privacy

- 필요한 개인정보만 수집한다.
- 수집 목적, 제3자 제공 또는 외부 처리, 보존 기간과 삭제 방법을 출시 전에 공개한다.
- Proof에 타인의 개인정보가 포함될 위험과 신고·삭제 절차를 검토한다.
- 개인정보 관련 최종 문구와 의무는 관할 법률 전문가 또는 적절한 공식 지침 검토를 거친다.

### Accessibility

- WCAG 2.2 AA를 웹 접근성 목표로 제안한다.
- 핵심 흐름은 키보드, 명확한 레이블, 오류 안내, 포커스 표시와 충분한 대비를 검증한다.
- 카메라를 사용할 수 없는 사용자를 위한 허용 가능한 대체 Proof 경로를 정책과 함께 검토한다.

### Reliability and Recovery

- 네트워크, DB와 파일 저장소 실패를 독립적으로 처리한다.
- 중복·재시도·동시 요청으로 Score와 Participation이 중복되지 않아야 한다.
- 배포와 migration에는 중단 조건과 실제 가능한 rollback 또는 forward-fix 계획이 있어야 한다.
- 데이터 백업, 복원 목표와 복원 검증 방법은 기술 기반 결정 후 확정한다.

### Observability

- 각 핵심 흐름은 요청 또는 작업 상관 식별자를 가진다.
- 인증 실패, Proof 처리 실패, 검수 지연, Score 생성 실패와 Final Submission 실패를 확인할 수 있다.
- 로그에는 토큰, 비밀, Proof 원문과 불필요한 개인정보를 기록하지 않는다.
- 운영 지표의 임계값과 담당자는 파일럿 규모가 정해진 후 승인한다.

### Performance and Compatibility

- 지원 브라우저, 최소 기기와 네트워크 조건을 Sprint 0에서 확정한다.
- 핵심 화면의 측정 가능한 응답성과 이미지 업로드 목표를 실제 파일럿 조건으로 정의한다.
- 성능 목표를 정하기 전에 대표 이미지 크기와 예상 동시 사용자를 가정으로 기록한다.

## 12. 분석 이벤트와 성공 지표

이벤트 이름과 속성은 구현 전에 Analytics 계약으로 확정한다. 최소 후보는 다음과 같다.

- challenge_viewed
- participation_joined
- project_setup_completed
- mission_viewed
- proof_upload_started
- proof_submitted
- proof_approved
- proof_rejected
- score_confirmed
- ranking_viewed
- final_submission_completed
- reward_eligibility_confirmed

Primary Outcome 후보는 Final Submission Rate다. Leading Indicator 후보는 Same-day Approved Mission Rate다. 분모, 제외 사용자, 관측 기간과 목표값은 파일럿 계획과 함께 PO가 승인한다.

## 13. 출시 Gate

Launch MVP는 다음 조건을 충족해야 실제 사용자에게 공개할 수 있다.

- P0 요구사항과 주요 실패 경로가 승인된 Acceptance Criteria를 충족한다.
- 핵심 정책과 Level 3 기술 결정에 PO 승인 기록이 있다.
- 인증·권한·Proof 파일 접근과 Score 중복 방지를 독립적으로 검토했다.
- 필수 자동 테스트와 CI가 최신 커밋에서 통과했다.
- 개인정보 처리방침, 이용자 안내와 삭제 요청 절차가 준비됐다.
- 운영자 검수, 문의와 장애 대응 담당자가 정해졌다.
- 스테이징에서 정상·실패·복구 흐름을 확인했다.
- 배포, migration, 관측, rollback과 데이터 복구 계획이 있다.

## 14. 미결정 사항

구현을 차단하거나 범위를 바꾸는 미결정 사항은 [Sprint 0 결정 목록](../sprint-0/DECISION_REGISTER.md)에서 관리한다. 주요 항목은 다음과 같다.

- 실제 금전 리워드와 Reward Eligibility의 경계
- Proof 입력 방식, 검수, 반려와 재제출 정책
- Challenge 시간대, Deadline과 지연 Score
- Mission baseScore와 scoreRate 계산식
- 중도 참가, 중도 이탈과 Project Pivot
- Ranking 동점 및 공개 프로필
- 인증·권한·DB·파일 저장소·배포 기반
- 개인정보 수집, 보존과 삭제
- 지원 기기·브라우저, 성능·가용성·복구 목표
- Fruvi와 알림의 출시 시점

## 15. 원본 기획과의 차이

- 원본의 17시간 30분 계획은 발표용 데모 계획으로 분류하고 정식 출시 계획에서 제외했다.
- 원본의 AI Monitoring은 승인되지 않은 기능으로 분류했다. Launch MVP는 사람 검수를 추천한다.
- 실제 상금 분배는 결제·정산·환불·법률 검토가 필요한 별도 제품 범위로 분리했다.
- Participant 화면만 있던 범위에 Operator, 보안, 개인정보, 복구와 관측 요구사항을 추가했다.
- 앱 내부 카메라만 강제하던 정책을 미결정으로 되돌리고, 미션별 허용 Proof와 접근성 영향을 검토하도록 했다.
