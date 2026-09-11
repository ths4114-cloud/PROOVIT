# PROOVIT Sprint 0 Decision Register

- 문서 상태: Draft
- 최종 수정일: 2026-09-12
- 결정자: PO
- 관련 문서: [PRD](../product/PRD.md), [Sprint 0 계획](SPRINT_0_PLAN.md)

이 문서는 구현 전에 닫아야 할 제품·기술 결정을 추적한다. `추천`은 분석 결과이며 승인된 결정이 아니다. Level 3 항목은 PO 승인 기록과 Engineering Decision 문서가 생기기 전까지 구현 기준으로 사용할 수 없다.

## 상태 정의

- Open: 분석을 시작하지 않았거나 선택지가 부족함
- Proposed: 대안과 추천안이 준비됐으나 미승인
- Accepted: PO가 범위와 근거를 승인하고 기록함
- Rejected: 채택하지 않기로 결정함
- Superseded: 후속 결정이 이전 결정을 대체함

## 우선 결정 목록

| ID | 결정 | 수준 | 상태 | 추천안 | 차단 범위 |
| --- | --- | --- | --- | --- | --- |
| D-001 | Launch MVP와 금전 리워드 경계 | Level 3 | Proposed | Eligibility까지만 구현, 결제·정산 제외 | Challenge 안내, Reward UI, 법률 범위 |
| D-002 | Proof 입력 방식 | Level 3 | Proposed | 미션별 카메라 또는 이미지 업로드 허용 | UX, 접근성, 파일 보안 |
| D-003 | Proof 검수 방식 | Level 3 | Proposed | Operator 수동 검수, AI 단독 판정 제외 | Proof 상태, Score 확정, 운영 인력 |
| D-004 | Deadline과 기준 시간대 | Level 3 | Proposed | Challenge 시간대의 매일 23:59 | Score, 알림, 날짜 경계 테스트 |
| D-005 | baseScore와 지연 배율 | Level 3 | Proposed | 모든 Mission 100점, 1.0/0.7/0.4/0 | Score와 Reward Eligibility |
| D-006 | scoreRate 계산식 | Level 3 | Proposed | 승인 Score 합 ÷ 전체 Mission 최대 Score | Reward Eligibility, 지표 |
| D-007 | 중도 참가와 이탈 | Level 3 | Proposed | 첫 코호트는 시작 후 참가 불가, 자발적 이탈만 기록 | Participation 상태와 UX |
| D-008 | Project Pivot | Level 3 | Proposed | VALIDATE 시작 전 1회, 변경 이력 보존 | Project, Mission Context, 분석 |
| D-009 | Ranking 동점 | Level 3 | Proposed | Score, 정시 승인 Mission 수, 마지막 점수 달성 시각 순 | Ranking과 Rival |
| D-010 | 공개 프로필 범위 | Level 3 | Open | 닉네임, 아이콘, Score와 Rank만 공개 검토 | 개인정보, Leaderboard |
| D-011 | 인증과 계정 복구 | Level 3 | Open | 관리형 Auth 우선 검토 | Account, 권한, SaaS |
| D-012 | 역할과 권한 모델 | Level 3 | Proposed | Participant와 Operator 분리, 서버 권한 검사 | 전체 보호 자원과 운영 기능 |
| D-013 | Proof 보존과 삭제 | Level 3 | Open | 최소 보존, 사용자 삭제 요청과 운영 예외 분리 | 개인정보, 저장 비용, 복구 |
| D-014 | 기술 기반 | Level 3 | Open | PWA 우선 검토, 대안 비교 후 확정 | 전체 아키텍처와 배포 |
| D-015 | 지원 브라우저와 기기 | Level 2 | Open | 실제 파일럿 사용 환경 조사 후 확정 | UI, 카메라, 테스트 범위 |
| D-016 | 성능·가용성·복구 목표 | Level 3 | Open | 파일럿 규모와 실패 비용을 먼저 가정 | NFR, 인프라, 운영 비용 |
| D-017 | Fruvi 출시 범위 | Level 3 | Proposed | P1, P0 안정화 이후 Context Guide부터 | AI 공급자, 개인정보, 비용 |
| D-018 | 알림 출시 범위 | Level 3 | Proposed | P1, Daily Open과 Deadline부터 | 권한, 중복, 재시도, 비용 |
| D-019 | North Star와 파일럿 목표값 | Level 3 | Proposed | Final Submission Rate + Same-day Approved Mission Rate | 분석 계약, 출시 판정 |
| D-020 | 31개 Mission 콘텐츠 | Level 3 | Open | 공통 Mission과 명확한 검수 기준을 콘텐츠 리뷰 | 제품 품질과 공정성 |

## D-001 Launch MVP와 금전 리워드 경계

### 무엇인지

Reward Eligibility는 조건 충족 여부를 계산하는 기능이고 Reward Settlement는 실제 돈이나 보상을 지급하는 기능이다.

### 제품 영향

실제 상금을 포함하면 결제, 환불, 본인 확인, 부정 참가, 세무·법률 검토, 정산 오류와 분쟁 대응이 제품 P0가 된다.

### 대안

- A: Launch MVP에서 참가비와 상금 정산까지 구현
- B: Reward Eligibility까지만 구현하고 정산은 하지 않음
- C: Eligibility는 제품이 계산하고, 별도 운영 절차로 제한된 보상을 수동 지급

### 추천

B를 추천한다. 핵심 행동 루프와 데이터 신뢰성을 먼저 검증하고 실제 금전 범위는 별도 결정으로 분리한다. 금전 압력의 효과를 검증하지 못하는 단점은 감수한다.

### PO가 결정할 내용

- 첫 출시가 실제 돈을 받거나 지급하는가
- 안내 문구에서 Reward를 어떤 의미로 사용할 것인가
- 수동 보상이 있다면 앱 범위와 분리할 것인가

## D-002 Proof 입력 방식

### 대안

- A: 앱 내부 카메라 촬영만 허용
- B: 카메라와 이미지 업로드를 Mission별로 허용
- C: 이미지 외 문서, URL과 외부 연동까지 허용

### 추천

B를 추천한다. 솔로프리너의 결과물이 코드, 와이어프레임과 문서인 점을 반영하면서 C의 보안·처리 복잡성을 피한다. 촬영만 강제해 조작을 줄이는 이점은 일부 포기한다.

### PO가 결정할 내용

- 스크린샷을 Proof로 인정하는가
- Mission마다 허용 형식을 다르게 할 것인가
- 한 Mission에 허용할 이미지 수와 크기

## D-003 Proof 검수 방식

### 대안

- A: 제출 즉시 승인
- B: Operator 수동 승인
- C: AI 보조 후 Operator 승인
- D: AI 단독 승인

### 추천

B를 추천한다. 초기에는 학습된 판정 자료가 없고 Score와 Reward Eligibility가 Proof 정확성에 의존한다. 운영 부담을 감수하되 검수 시간과 인력 한도를 파일럿 규모에 맞춘다. C는 충분한 실제 사례와 정답 데이터가 쌓이면 재검토한다.

### PO가 결정할 내용

- 수동 검수를 운영할 담당자와 처리 목표
- 승인 전 Score와 Ranking을 사용자에게 어떻게 표시할지
- 반려 사유와 재제출 횟수

## D-004 Deadline과 기준 시간대

### 대안

- A: Challenge 하나의 기준 시간대와 매일 23:59
- B: Participant별 시간대와 마감
- C: Mission 공개 후 24시간

### 추천

A를 추천한다. 같은 Challenge의 공정성과 운영 단순성을 우선한다. 해외 사용자를 지원할 때 B 또는 C를 재검토한다.

### PO가 결정할 내용

- 첫 Challenge 기준 시간대
- 23:59의 초·밀리초 경계
- 장애가 발생했을 때 마감 연장 권한과 공지 방식

## D-005와 D-006 Score 정책

### 대안

- A: 모든 Mission 100점, 시간 배율 적용
- B: Mission 난이도별 점수, 시간 배율 적용
- C: 완료 횟수만 계산

### 추천

A를 추천한다. 사용자 설명, 콘텐츠 운영과 Ranking 검증이 단순하다. 난이도 차이를 표현하는 이점은 포기하며 Mission 설계로 부담을 조정한다.

추천 scoreRate는 다음과 같다.

```text
승인된 finalScore 합계 ÷ Challenge 전체 Mission의 baseScore 합계
```

### PO가 결정할 내용

- 미공개 또는 운영 취소 Mission을 분모에서 제외하는가
- 반려 후 재제출 시 최초 제출 시각과 승인 제출 시각 중 무엇을 사용하는가
- 운영 장애로 기한을 연장할 때 이미 계산된 Score를 어떻게 다룰 것인가

## D-007과 D-008 참가와 Pivot

### 추천

- 첫 코호트는 Challenge 시작 후 신규 참가를 받지 않는다.
- 미수행만으로 자동 탈락시키지 않고 active 상태를 유지한다.
- 사용자는 자발적으로 withdrawn 상태로 전환할 수 있다.
- Project Pivot은 VALIDATE 시작 전 1회 허용하고 이전 값을 보존한다.

위 정책은 운영과 분석을 단순하게 하지만 늦게 알게 된 사용자를 받지 못한다. 다음 코호트 대기 등록으로 보완할 수 있다.

## D-011부터 D-016 기술과 운영 기반

### 현재 확인된 사실

- 저장소에는 애플리케이션 코드와 확정된 기술 스택이 없다.
- 인증, DB, 파일 저장소와 배포 SaaS는 핵심 의존성으로 Level 3다.
- Proof는 사용자 생성 파일이므로 권한, 파일 검증, 보존, 삭제와 부분 실패가 핵심 위험이다.

### Sprint 0에서 비교할 대안

- Web PWA와 Native App
- 관리형 Backend 서비스와 직접 구성한 Backend
- 관리형 Auth와 자체 Auth
- 하나의 통합 공급자와 분리된 DB·Auth·Storage 공급자

### 평가 기준

- 4인 팀의 학습과 운영 부담
- 보안 기본값과 권한 표현력
- DB migration과 로컬·스테이징 검증 가능성
- 파일 접근 제어와 삭제·복구
- 공급자 장애와 교체 비용
- 예상 사용자 규모, 비용과 관측 가능성
- CI, Preview와 운영 배포의 재현성

승인 전에는 특정 SaaS 계정이나 운영 스키마를 만들지 않는다.

## 참조 기록

| 자료 | 확인일 | 채택할 점 | 현재 채택하지 않을 점 |
| --- | --- | --- | --- |
| [OWASP ASVS 5.0.0](https://owasp.org/www-project-application-security-verification-standard/) | 2026-09-12 | 웹 보안 요구사항과 검증 항목의 기준 후보 | 모든 항목을 위험 분석 없이 동일 적용하지 않음 |
| [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) | 2026-09-12 | 허용 목록, 실제 유형, 크기, 생성 파일명, 비공개 저장과 권한 | 초기부터 모든 고비용 스캔 도구를 도입하지 않음 |
| [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | 2026-09-12 | 안전한 인증 오류, 세션, 계정 복구와 모니터링 검토 | 인증을 직접 구현하라는 근거로 사용하지 않음 |
| [WCAG 2.2](https://www.w3.org/TR/wcag/) | 2026-09-12 | AA를 접근성 목표 후보로 사용 | 자동 검사만으로 준수했다고 판정하지 않음 |

## 승인 기록

현재 승인된 Level 3 결정은 없다. PO가 항목을 승인하면 다음을 수행한다.

1. `docs/decisions/YYYY-MM-DD-결정명.md`에 Engineering Decision을 작성한다.
2. 결정자, 날짜, 범위와 근거를 기록한다.
3. PRD, User Flow와 Acceptance Criteria를 갱신한다.
4. 관련 Issue가 [Definition of Ready](../DEFINITION_OF_READY.md)를 통과하는지 확인한다.
