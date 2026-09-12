# Sprint 0 Foundation Review

- 검토일: 2026-09-12
- 검토자: Codex Builder 자체 점검
- 대상 브랜치: `chore/sprint-0-foundation`
- 독립 Reviewer: 없음
- 판정: P0 정책 승인 반영 완료, 설계 산출물과 독립 리뷰 필요

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
- Camera Proof 촬영·기술 검증·자동 인정·실패·정정 상태
- Operator Console
- 서버 권위의 Score와 중복 방지
- 비공개 Proof 파일, 입력 검증과 부분 실패 복구
- 계정 및 데이터 삭제 요청
- 접근성, 관측, migration, rollback과 restore Gate
- Vertical Slice의 정상·오류·권한·동시성 검증

### P0 승인 결과

- P0는 실제 상금·결제·정산을 제외한다.
- 앱 내 Camera Capture만 허용하고 사진첩·Screenshot·파일 업로드는 차단한다.
- P0는 AI·Operator 내용 검수 없이 기술 검증과 저장 성공으로 Proof를 자동 인정한다.
- 정식 서비스 AI Monitoring은 별도 Level 3 결정과 출시 Gate로 분리한다.
- Asia/Seoul Deadline, 100점과 1.0/0.7/0.4/0 배율, 85%+Final Submission을 확정했다.
- 개인 Score는 즉시, Ranking은 일 1회 Snapshot으로 분리했다.
- Next.js PWA, Vercel과 Supabase 방향을 조건부 승인했다.

## 3. 지침 적합성 자체 점검

| 검토 항목 | 결과 | 근거 또는 남은 작업 |
| --- | --- | --- |
| 원본 자료와 공식 문서 구분 | 통과 | 원본은 참고 자료, Markdown PRD를 공식 기준 후보로 작성 |
| 제안과 PO 승인 구분 | 통과 | D-001부터 D-020은 Accepted, 후속 AI 결정과 출시 검증은 미완료로 구분 |
| Scope와 Out of Scope | 통과 | PRD 2장과 5장, Sprint 0 2장 |
| 정상·실패·경계 흐름 | 통과 | User Flow의 각 기능별 예외와 복구 |
| 서버 권위와 불변조건 | 통과 | PRD 7장과 FR-06부터 FR-11 |
| 보안·개인정보·파일 위험 | 초안 통과 | 상세 위협 모델과 보존 정책은 Sprint 0 남은 작업 |
| Reference-First | 초안 통과 | OWASP ASVS, Upload, Authentication과 WCAG 기록 |
| 기술 대안 비교 | 조건부 통과 | 방향과 대안은 결정서에 기록, 요금·지역·복구 검증 필요 |
| 데이터·API 계약 | 미완료 | Architecture, Database와 API 문서 필요 |
| 테스트와 CI | 미완료 | Test Strategy와 애플리케이션 기반 생성 후 설정 |
| Wireframe | 미완료 | User Flow 10장의 14개 화면 필요 |
| PO 정책 승인 | 통과 | D-001부터 D-020 승인일·범위·근거 기록 |
| 독립 AI 리뷰 | 미실행 | 별도 리뷰 관점 필요 |
| 사람 리뷰 | 미실행 | 협업자 초대 전이며 병합 Gate로 남음 |

## 4. 이전 차단 사항 처리 결과

### F-01 Proof와 Score의 확정 시점 — 해결

- P0는 앱 내 Camera Capture를 기술 검증하고 저장 성공 즉시 자동 `accepted`와 Score를 확정한다.
- P0는 사진 내용의 진위를 검증하지 않는다. 정식 서비스 AI Monitoring은 별도 Level 3 결정으로 분리했다.

### F-02 Reward와 실제 상금의 경계 — 해결

- P0는 Reward Eligibility까지만 구현하고 참가비, 결제, 상금 정산과 환불을 제외한다.

### F-03 Deadline과 Score 분모 — 정책 해결, 계약 검증 필요

- Asia/Seoul, 00:00 경계, 100점과 1.0/0.7/0.4/0 배율, 취소 Mission 분모 제외를 승인했다.
- API·DB 계약과 날짜 경계 자동 테스트가 아직 필요하다.

### F-04 인증·권한·파일 저장 기반 — 방향 해결, 설계 차단 유지

- Next.js PWA, Vercel, Supabase Auth/Postgres/Private Storage와 RLS 방향을 승인했다.
- Architecture, 권한 행렬, 비용·지역·복구 검증 전에는 구현 Ready가 아니다.

### F-05 개인정보 보존과 삭제 — 정책 해결, 출시 차단 유지

- Proof 원본은 `proofCloseAt` 후 30일에 삭제하기로 승인했다.
- 개인정보 처리방침, 외부 처리자, 삭제 재처리와 법적 예외 검토 전에는 실제 사용자 출시가 불가하다.

## 5. 비차단 제안

- 31개 Mission 콘텐츠는 코드와 분리된 Seed 데이터로 버전 관리한다.
- 기획안의 UI는 시각 참고로 유지하고 상태 중심 로우파이 Wireframe을 먼저 만든다.
- Markdown 문서를 공식 기준으로 하고 PPT와 DOCX는 참고 원본 또는 외부 링크로 관리한다.
- `.gitattributes`의 줄바꿈 정책은 기술 스택이 정해진 뒤 필요한 파일 유형을 추가 검토한다.

## 6. 검증 증거

- Markdown 상대 링크 유효성: 통과
- Decision Register의 D-001부터 D-020까지 20개 결정 상태: 모두 `Accepted`
- P0 정책 대조: Camera 전용, 자동 인정, 456명, 일 1회 Ranking, 85%와 Final Submission 기준 일치
- Mission Camera Proof와 Final Submission 소개 이미지의 입력 정책 구분: 완료
- 승인 상태와 조건부 검증 구분: 자체 검토 완료
- 원본 PRD와 기획안 대조: 완료
- 보안 참고 자료 확인: 완료
- 애플리케이션 타입 검사, lint, build, 테스트: 해당 없음. 코드가 없음
- 독립 Reviewer와 CI 검증: 미실행
- CI: 미설정
- 독립 Reviewer: 미실행
- 사람 Reviewer: 미실행

## 7. 최종 판정

P0 제품 정책과 기술 방향의 PO 승인은 완료됐다. 그러나 Architecture, Database, API, Security, Test Strategy와 Wireframe이 없고 독립 Reviewer·CI도 준비되지 않았으므로 Sprint 0 완료 또는 Vertical Slice Ready로 판정하지 않는다. 다음 단계는 승인된 정책을 기준으로 User Flow Wireframe과 첫 Vertical Slice 계약을 작성하는 것이다.
