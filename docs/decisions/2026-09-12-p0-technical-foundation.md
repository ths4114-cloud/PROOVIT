# ED-2026-09-12 — P0 기술·보안·운영 기반

- 상태: Accepted
- 날짜: 2026-09-12
- 작성자 / Feature Owner: Codex / PO
- 결정 수준: Level 3
- 결정자 / 승인 날짜 / 승인 근거: PO / 2026-09-12 / P0 최종 권고안 승인 메시지
- 관련 Issue / PR / 공식 문서: [PRD](../product/PRD.md), [Decision Register](../sprint-0/DECISION_REGISTER.md)
- 이전 결정 / 대체 결정: 없음
- 구현 상태: 미착수

## 1. Decision — 무엇을 결정하는가

P0는 Next.js TypeScript PWA, Vercel, Supabase Postgres/Auth/Private Storage를 기술 방향으로 사용한다. Participant와 Operator를 분리하고 모든 보호 작업에서 서버 권한 검사와 Postgres RLS를 함께 적용한다. 이 문서가 정했던 Participant 이메일 OTP 기본안은 [2026-09-17 Participant 인증 개정](2026-09-17-p0-participant-authentication.md)으로 대체되었다. Operator TOTP MFA 원칙은 유지한다.

최대 456명을 가정한다. Participant는 iOS Safari와 Android Chrome 최신 2개 주요 버전, Operator는 Desktop Chrome과 Edge 최신 2개 주요 버전을 지원한다. Proof 원본은 비공개로 보관하고 `proofCloseAt` 30일 후 자동 삭제한다.

이 결정은 기술 방향 승인이다. 유료 요금제 결제, 운영 계정 생성, 개인정보 최종 문구와 실제 공개 승인은 포함하지 않는다.

## 2. Context & Reference — 사실과 근거

- 저장소에는 아직 애플리케이션 기반, Architecture, Database, API, Security와 Test Strategy가 없다.
- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)는 하나의 웹 코드베이스로 설치 가능한 PWA를 구성하는 경로를 제공한다.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)와 [Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)은 Auth와 DB·Private Storage 권한을 연결한다.
- Supabase DB 백업은 Storage 객체를 포함하지 않으므로 Proof 파일의 삭제 방지·대사·복구 한계는 별도 검증이 필요하다.

## 3. Trade-off & Variables

- 충돌하는 가치: 빠른 개발·낮은 운영 부담과 공급자 종속·복구 통제
- Risk: 잘못된 RLS, 서비스 키 노출, Storage 객체 복구 공백, 이메일 전달 실패
- Change: AI Monitoring, 알림과 규모 증가 가능성
- Scale: 456명 × 31일, 자정 전후 동시 제출 가능
- Uncertainty: 실제 이미지 크기, 동시성, 요금제, 데이터 처리 지역과 사용자 기기 분포
- Constraint: 4인 팀, 정식 제품 수준의 보안·복구 필요

## 4. Alternatives — 현실적인 대안

### Option A — 통합 관리형 Web/PWA 기반

- 접근: Next.js·Vercel·Supabase
- 장점: Preview, Auth, DB와 Storage를 적은 운영 인력으로 연결할 수 있다.
- 단점: 공급자 설정과 요금제에 의존하며 Storage 복구를 별도로 다뤄야 한다.

### Option B — Native App과 직접 Backend

- 장점: 기기 Camera와 배포를 더 직접 통제할 수 있다.
- 단점: iOS·Android·Backend의 개발·테스트·출시 표면이 크게 늘어난다.

### Option C — Web Frontend와 분리된 Auth·DB·Object Storage

- 장점: 공급자별 교체와 Storage 기능 선택 폭이 넓다.
- 단점: 권한·삭제·부분 실패·관측을 여러 서비스에 걸쳐 운영해야 한다.

## 5. Recommendation — 추천

P0는 Option A를 채택한다. 현재 규모에서 분산 시스템이나 Native 이중 개발의 비용보다 통합 관리형 서비스의 운영 단순성이 크다. 핵심 정책은 서버와 DB 제약에 두어 UI나 특정 공급자 SDK에만 묶지 않는다.

## 6. Decision & Consequences — 실제 결정

- 선택한 안: Option A
- 승인 조건: 요금·지역·약관, Google OAuth 공급자 설정, RLS, Private Storage, 백업·복구와 실제 기기 Camera 검증
- 선행 작업: Architecture, Database, API, Security, Test Strategy와 환경별 배포 설계
- 검증: 권한 통합 테스트, Camera E2E, 456명 부하 시나리오, Proof 부분 실패와 삭제 재처리, Ranking 배치 재실행, 복원 시험
- 목표: 핵심 API p95 1초, LCP p75 2.5초, DB RPO 24시간·RTO 4시간 최소선
- rollback: 배포는 이전 검증 버전으로 복귀하고 DB migration과 외부 파일 부작용은 별도 복구한다.
- 중단 조건: 권한 우회, Score 중복, Proof 공개 노출, 복구 불가 또는 승인 예산 초과

## 7. Revisit — 재검토

- 실제 금전 지급, AI Monitoring, 456명 초과, 목표 성능 미달, 공급자 비용 급증 또는 데이터 처리 요건 변경 시 재검토한다.
- 담당자: PO와 Architecture Feature Owner
