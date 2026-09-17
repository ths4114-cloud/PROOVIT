# ED-2026-09-15 — 두 개발자의 공통 시작점

- 상태: 기술 스택과 Google 로그인 구현 승인, Participant 인증 정책은 2026-09-17 확정
- 결정자: PO / 날짜: 2026-09-15
- 근거: 현재 작업의 사용자 요청 “기술스택은 이걸로 고정… 코딩과 깃 커밋”, “구글 등으로 로그인기능까지 연결”, “전반적인 UI는 이 기획안 이미지를 참고”. Participant 인증의 최종 승인 범위는 [GitHub Issue #4](https://github.com/ths4114-cloud/PROOVIT/issues/4)에 기록한다.
- 선행 결정: [P0 기술 기반](2026-09-12-p0-technical-foundation.md). 이 문서는 첫 로그인 제공자와 개발 기반 선택을 구체화한다.

## 승인 범위

Next.js App Router + TypeScript, Tailwind CSS, Next.js Server Actions/Route Handlers, Supabase Postgres/Auth/Storage/RLS, Vercel, 모바일 Responsive Web/PWA를 사용한다. Supabase Cron/pg_cron은 예약 작업이 필요할 때 사용한다. Native/Expo는 MVP 검증 이후 별도 결정한다.

Google OAuth를 P0 일반 Participant의 유일한 로그인 방식으로 사용한다. 이메일 OTP와 다른 소셜 로그인 제공자는 P0에서 제외한다. Participant의 Google 계정 접근 복구는 Google의 계정 복구 절차를 사용하며 PROOVIT은 별도 비밀번호 또는 이메일 OTP 복구 기능을 제공하지 않는다. Operator TOTP MFA 원칙은 유지하지만 Operator 인증·복구 구현은 이번 Foundation 범위에서 제외한다. 자세한 승인 범위는 [2026-09-17 Participant 인증 개정](2026-09-17-p0-participant-authentication.md)을 따른다.

Google에서는 기본 프로필·이메일·openid 범위만 사용하고 추가 API 권한을 요구하지 않는다. 실제 OAuth 제공자 설정·프로젝트 생성·사용자 데이터 처리 검증은 별도 진행 상태로 기록한다.

UI는 사용자 제공 `proovit_기획안_f.pptx`의 10–12번 슬라이드를 중심으로 검정 배경, 핑크 강조, 카드와 캐릭터 배치를 참고한다. 이 자료의 상금·AI 검수·실시간 랭킹·하루 여러 미션 등의 예시를 P0 정책으로 가져오지 않는다. 캐릭터는 해당 PPTX의 `ppt/media/image5.png`에서 추출했다. 출시 전 자산 사용 권한은 PO 확인 대상이다.

## 일반 기술 선택과 대안

- 하나의 Next.js 앱에서 화면과 서버 작업을 함께 개발한다. 지금 Edge Function까지 분산하는 대안보다 실행·검증 환경을 단순하게 유지할 수 있다. 긴 작업이나 별도 실행 요구가 확인되면 Edge Function을 검토한다.
- 전역 상태 관리 라이브러리는 추가하지 않는다. 서버에서 읽은 상태와 제한된 폼 상태로 시작한다. 실제 참가/인증 통합 시 서버 결과를 다시 조회한다.
- `/preview` 아래에만 표시용 fixture를 둔다. `ENABLE_UI_PREVIEW=true`일 때만 접근 가능하며 기본은 404다. 실제 로그인과 보호 경로는 `/login`, `/auth/callback`, `/home`이다. 시연용 인증 토큰·DB·가짜 로그인은 만들지 않는다.
- UI 계약은 TypeScript로 정리하지만 DB 스키마를 확정하지 않는다. 참가/Proof/Score migration은 후속 승인된 설계로 작업한다.
- Node 24.21.0, npm 11.19.0 및 패키지 잠금 파일을 공유한다. 버전은 `package.json`/`package-lock.json`이 권위 있는 기준이다.
- ESLint 10은 Next.js 내 import/react/accessibility 플러그인의 peer 범위 밖이다. 호환 가능한 9.39.5를 사용한다. npm의 지원 종료 경고를 기록하며, 담당은 공통 기반 Owner, 재검토 시점은 첫 기능 통합 전 또는 해당 플러그인들의 ESLint 10 지원 시점이다. runtime 의존성은 아니다.
- PWA manifest와 아이콘을 구성한다. Service Worker·푸시·오프라인 제출은 이번 범위에 없다. 설치와 실제 기기 동작은 HTTPS 환경에서 후속 검증한다.

## 위험과 검증

OAuth PKCE cookie와 서버 사용자 검증을 사용한다. callback은 신뢰된 `APP_ORIGIN`의 고정 `/home`으로 이동한다. 요청의 Host/next 값을 인증 후 이동 주소로 신뢰하지 않는다. 응답에 인증 코드나 공급자 오류 전문을 노출하지 않는다. 세션 응답은 공유 캐시하지 않는다.

이 기반의 테스트는 환경 미설정 실패, 보호 경로, callback 오류, 잘못된 미션, 화면 이동과 모바일 폭을 검증한다. 실제 Google 로그인 성공·취소·새로고침·로그아웃은 외부 설정 뒤 검증해야 한다. DB/RLS·사진 저장·점수 중복 방지는 구현되지 않았으며 통과로 간주하지 않는다.
