# Sprint 0 Foundation Review

- 검토일: 2026-09-12
- 검토자: Codex Builder 자체 점검
- 대상 브랜치: `chore/sprint-0-foundation`
- 독립 Reviewer: 없음
- 판정: 문서 초안 검토 완료, PO 승인 및 독립 리뷰 필요

## 1. 검토 범위

- 원본 기획안과 PRD 초안의 제품 정의, 기능, 정책과 미결정 사항 대조
- 정식 출시 제품에 필요한 운영, 보안, 개인정보, 접근성, 복구 요구사항 확인
- PRD, User Flow, Glossary, Sprint 0 Plan과 Decision Register의 용어와 책임 확인
- AGENTS, Definition of Ready, 개발 흐름, 협업, 의사결정, 아키텍처, 테스트, 보안, 운영, Review와 Done 지침 대조

## 2. 원본과의 추적 결과

### 유지한 핵심

- 솔로프리너 대상 31일 Launch Challenge
- Goal, Mission, Proof, Score, Ranking과 Reward Eligibility의 제품 루프
- 당일, 1일 지연, 2일 이상 지연과 미완료 배율 제안
- 총점 85% 이상과 Final Submission의 자격 조건 제안
- DEFINE, DISCOVER, VALIDATE, DESIGN, BUILD와 LAUNCH Phase
- Fruvi의 Mission Guide와 실행 독려 방향

### 출시 기준으로 보강한 핵심

- Account와 Session
- Participant와 Operator 권한 분리
- Proof 처리·검수·반려·재제출·정정 상태
- Operator Console
- 서버 권위의 Score와 중복 방지
- 비공개 Proof 파일, 입력 검증과 부분 실패 복구
- 계정 및 데이터 삭제 요청
- 접근성, 관측, migration, rollback과 restore Gate
- Vertical Slice의 정상·오류·권한·동시성 검증

### 승인 전 제안 상태로 되돌린 내용

- 실제 상금과 정산
- AI Monitoring과 AI Proof 판정
- 앱 내부 카메라만 허용하는 정책
- 고정 Deadline과 Score 계산 세부값
- 중도 참가, 탈락과 Project Pivot
- Ranking 동점과 공개 프로필
- 특정 기술 스택과 SaaS

## 3. 지침 적합성 자체 점검

| 검토 항목 | 결과 | 근거 또는 남은 작업 |
| --- | --- | --- |
| 원본 자료와 공식 문서 구분 | 통과 | 원본은 참고 자료, Markdown PRD를 공식 기준 후보로 작성 |
| 제안과 PO 승인 구분 | 통과 | Level 3 결정은 Proposed 또는 Open으로 유지 |
| Scope와 Out of Scope | 통과 | PRD 2장과 5장, Sprint 0 2장 |
| 정상·실패·경계 흐름 | 통과 | User Flow의 각 기능별 예외와 복구 |
| 서버 권위와 불변조건 | 통과 | PRD 7장과 FR-06부터 FR-11 |
| 보안·개인정보·파일 위험 | 초안 통과 | 상세 위협 모델과 보존 정책은 Sprint 0 남은 작업 |
| Reference-First | 초안 통과 | OWASP ASVS, Upload, Authentication과 WCAG 기록 |
| 기술 대안 비교 | 미완료 | D-011부터 D-016 조사 및 Engineering Decision 필요 |
| 데이터·API 계약 | 미완료 | Architecture, Database와 API 문서 필요 |
| 테스트와 CI | 미완료 | Test Strategy와 애플리케이션 기반 생성 후 설정 |
| Wireframe | 미완료 | User Flow 10장의 14개 화면 필요 |
| PO 정책 승인 | 미완료 | Decision Register의 Open/Proposed 항목 검토 필요 |
| 독립 AI 리뷰 | 미실행 | 별도 리뷰 관점 필요 |
| 사람 리뷰 | 미실행 | 협업자 초대 전이며 병합 Gate로 남음 |

## 4. 발견한 차단 사항

### F-01 Proof와 Score의 확정 시점

- 심각도: 차단
- 영향: Proof 승인, Score, Ranking과 Reward Eligibility
- 내용: 원본은 제출 직후 Score 반영처럼 보이지만 AI 또는 사람 검수 정책이 미정이다.
- 최소 해결: D-003에서 검수 방식과 승인 전 Score 표시를 PO가 결정한다.

### F-02 Reward와 실제 상금의 경계

- 심각도: 차단
- 영향: 사용자 안내, 결제, 정산, 환불, 법률과 운영
- 내용: 기획안에는 상금 분배가 있으나 PRD에서는 구현 여부가 열려 있다.
- 최소 해결: D-001을 승인하고 PRD와 UI에서 Eligibility와 지급을 명확히 구분한다.

### F-03 Deadline과 Score 분모

- 심각도: 차단
- 영향: Score의 재현성, Ranking과 자격 판정
- 내용: 시간대, 날짜 경계, 취소 Mission과 재제출 처리 기준이 없다.
- 최소 해결: D-004부터 D-006을 승인하고 경계 테스트를 AC로 확정한다.

### F-04 인증·권한·파일 저장 기반

- 심각도: 차단
- 영향: 전체 데이터 보호와 Vertical Slice 구조
- 내용: 관리형 서비스 또는 자체 구성 대안과 권한 표현이 정해지지 않았다.
- 최소 해결: D-011부터 D-014의 Reference 조사와 Level 3 승인을 마친다.

### F-05 개인정보 보존과 삭제

- 심각도: 출시 차단
- 영향: Proof 이미지, 계정 삭제, 비용과 법적 위험
- 내용: 어떤 데이터를 얼마나 보존하고 어떻게 삭제할지 없다.
- 최소 해결: 개인정보 항목표와 데이터 수명주기를 작성해 D-013을 승인한다.

## 5. 비차단 제안

- 31개 Mission 콘텐츠는 코드와 분리된 Seed 데이터로 버전 관리한다.
- 기획안의 UI는 시각 참고로 유지하고 상태 중심 로우파이 Wireframe을 먼저 만든다.
- Markdown 문서를 공식 기준으로 하고 PPT와 DOCX는 참고 원본 또는 외부 링크로 관리한다.
- `.gitattributes`의 줄바꿈 정책은 기술 스택이 정해진 뒤 필요한 파일 유형을 추가 검토한다.

## 6. 검증 증거

- Markdown 상대 링크 유효성: 통과
- 문서 내 미결정 표시: 자체 검토 완료
- 원본 PRD와 기획안 대조: 완료
- 보안 참고 자료 확인: 완료
- 애플리케이션 타입 검사, lint, build, 테스트: 해당 없음. 코드가 없음
- CI: 미설정
- 독립 Reviewer: 미실행
- 사람 Reviewer: 미실행

## 7. 최종 판정

이번 변경은 Sprint 0를 시작하기 위한 문서 기반으로 리뷰 가능한 상태다. 아직 정책 승인, Architecture, Database, API, Security, Test Strategy와 Wireframe이 없으므로 Sprint 0 완료 또는 Vertical Slice Ready로 판정하지 않는다.
