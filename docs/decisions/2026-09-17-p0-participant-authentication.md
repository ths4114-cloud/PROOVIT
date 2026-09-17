# ED-2026-09-17 — P0 Participant 인증 방식 개정

- 상태: Accepted
- 결정 수준: Level 3
- 결정자 / 승인일: PO / 2026-09-17
- 승인 근거: 현재 Codex 작업의 PO 메시지 “P0 일반 참가자는 Google 로그인만 사용하고 이메일 OTP는 이번 MVP에서 제외”에 대한 “맞아. 구글로그인만으로 변경해줘” 확인. 팀이 확인할 수 있는 GitHub 승인 기록은 PR 병합 전에 연결한다.
- 대체하는 결정: [2026-09-12 P0 기술 기반](2026-09-12-p0-technical-foundation.md)의 Participant 이메일 OTP 기본안과 [Decision Register](../sprint-0/DECISION_REGISTER.md)의 기존 D-011
- 관련 구현: `src/app/login/actions.ts`, `src/app/auth/callback/route.ts`, `src/lib/supabase/server.ts`

## 결정

P0 일반 Participant는 Supabase Auth의 Google OAuth만 사용한다. 이메일 OTP와 다른 소셜 로그인 제공자는 P0에서 제공하지 않는다. Google에서는 기본 프로필, 이메일과 OpenID Connect 인증 범위만 요청하며 다른 Google API 권한은 요구하지 않는다.

Participant가 Google 계정에 접근하지 못하는 경우 Google의 계정 복구 절차를 사용한다. PROOVIT은 Participant 비밀번호를 보관하지 않고 별도 비밀번호 재설정 또는 이메일 OTP 복구 기능을 제공하지 않는다. 로그인 이후 Challenge 참가 등록은 인증과 분리한다.

Operator 인증은 Participant 인증과 분리한다. 기존의 Operator TOTP MFA 요구는 유지하지만 Operator 로그인, 초기 등록, 권한 부여와 계정 복구는 이번 Foundation 구현 범위가 아니다. Operator 기능 구현 전에 별도의 위협 분석, 복구 절차, 감사 기록과 권한 검증을 설계하고 검토한다.

## 영향과 후속 검증

- Participant 이메일 OTP용 SMTP 구축과 전달률 검증은 P0 범위에서 제외한다.
- Supabase와 Google Cloud의 OAuth 제공자 설정, 허용된 callback URL과 환경별 origin을 검증한다.
- 로그인 성공·취소·공급자 오류·세션 만료·새로고침·로그아웃을 실제 개발 프로젝트에서 확인한다.
- Google 계정 이메일 변경, 계정 접근 상실과 탈퇴 시 PROOVIT 사용자 데이터 처리 절차는 출시 전에 개인정보·운영 문서로 확정한다.
- Google 로그인을 사용할 수 없는 사용자를 지원해야 한다는 제품 요구가 확인되면, 이메일 OTP 또는 다른 제공자 추가를 별도 Level 3 결정으로 재검토한다.
