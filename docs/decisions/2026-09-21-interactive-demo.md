# ED-2026-09-21 — 격리된 발표용 데모 MVP

- 상태: Accepted, 구현·로컬 자동 검증 완료. 독립 리뷰/병합/출시 대기. 출시 MVP 또는 운영 연결 완료를 뜻하지 않는다.
- 결정 수준: Level 3 (발표 범위·가상 인증/점수·사진 비저장 경계).
- 결정자: PO(현재 작업 사용자), 승인일: 2026-09-21.
- 승인 근거: Codex 작업 [01a0b3ca-25a2-7472-9115-3e1b929e8953](codex://threads/01a0b3ca-25a2-7472-9115-3e1b929e8953)의 사용자 요청: “좋아. 데모 범위를 확정하고, 별도 브랜치에서 데모 흐름을 연결해줘”. 직전 제안의 가상 입장·실제 촬영·가상 제출/점수·브라우저 진행 저장·사진 비저장에 대한 승인이다.
- Feature Owner/Builder: PO의 mission-camera 작업 / Codex. 독립 Reviewer: 아직 미배정, PR Gate 전에 별도 검토 필요.
- 브랜치: `codex/interactive-demo`, 기준 main `cef9718`. 이번 요청은 구현이며 병합·배포 승인은 아니다.
- 별도 Issue 미생성: 이 문서를 작업/Ready 기록으로 사용한다.

## 결정과 경계

발표 일정에 맞춰 `/demo`에서만 Supabase 없이 작동하는 대화형 데모를 만든다. 서버 환경변수 `ENABLE_DEMO=true`일 때만 열리며 기본값은 비활성/not-found 화면이다(Next streaming 응답은 HTTP 200일 수 있음). 기존 `/preview`, 실제 사용자 경로·API·DB·Google OAuth·권한 모델은 변경하지 않는다. 기존 [인증 결정](2026-09-17-p0-participant-authentication.md)과 [실제 Proof 설계](2026-09-21-mission-proof-integration-proposed.md)는 폐기/대체하지 않고 실제 운영 연결만 보류한다.

- 실제 기능: 승인된 31일 콘텐츠 재사용, 미션 제출 항목/완료 기준, 카메라 권한·촬영·미리보기·재촬영·스트림 정리.
- 가상 기능: `데모로 시작`, 샘플 참가자, 참가 중인 챌린지, 완료/점수. 실제 Google 로그인 성공처럼 표시하지 않는다.
- 시나리오: 기존 프리뷰와 같이 Day 12로 고정. Day 1–11 완료 샘플/1,100점, Day 12 최초 제출 후 1,200점, Day 13–31 잠금. 이후 일차로 시간 진행시키는 기능은 제외.
- 점수는 완료 여부에서 도출하고 반복 제출/결과 조회로 증가하지 않는다. 실제 점수 정책을 클라이언트로 옮기는 것이 아니라 별도 fixture 계산이다. 실제 서버는 이 상태를 읽지 않는다.
- 사진은 공유 CameraCapture 안에서 메모리 Blob/object URL로만 다루며 제출 callback에는 전달하지 않는다. 업로드/API/Storage/사진 내용 검수 없이 완료 상태만 기록한다. 제출·재촬영·화면 이탈 시 기존 정리 코드를 사용한다.
- 브라우저 저장에는 version, entered, completedToday만 쓴다. 이메일·토큰·사진·점수를 저장하지 않는다. 다른 기기와 공유되지 않으며 사용자가 조작할 수 있는 가상 데이터다.
- 저장 차단/손상은 안내하고 메모리 상태로 시연 가능하게 한다. 초기화는 데모 키만 바꾸며 실제 인증 쿠키나 다른 저장 키를 지우지 않는다.
- 모든 화면에 DEMO/가상 데이터·사진 비저장 안내. 실제 개인정보를 촬영하지 않도록 설명.

## 대안과 선택 이유

1. 실제 Supabase와 OAuth 연결: 실제 다중 사용자 검증이 가능하지만 계정·설정·DB 적용·실기기 검증 시간이 필요하다. 운영 전 필수 후속 작업.
2. 정적 프리뷰 유지: 변경이 가장 적지만 촬영 후 홈/보드 점수가 연결되지 않아 사용자 시나리오를 보여주기 어렵다.
3. 선택: 별도 데모 경로와 브라우저 상태. 기존 디자인 토큰·카메라·콘텐츠를 재사용하며 백엔드 의존 없이 전체 경험을 보여준다. 신규 의존성 없음. 별도 데모 UI 유지보수와 데이터 신뢰성/동기화 부재를 감수한다.

## Ready / 계약 / 검증

- 범위: `src/app/demo`, `src/components/demo`, `src/lib/demo`, 공유 CameraCapture의 선택적 데모 callback, 설정·테스트·문서.
- 제외: 운영 라우트/점수 정책/DB/인증 변경, 테스트용 backend 공개, 랜딩 ZIP 통합, Vercel 배포, 실제 사용자 가입/사진 저장/리워드.
- 원격 main 확인 완료. 타 팀 미공개 로컬 작업은 알 수 없음. 공유 수정은 CameraCapture의 선택적 prop에 제한하며 기존 호출 형태와 테스트를 보존한다.
- 모듈: 상태 파서(버전·타입 검증/불필요 필드 제거), fixture 점수 계산, 브라우저 저장/오류 안내, 데모 화면. 서버 측 flag와 라우트 허용 목록으로 공개 범위를 제한한다.
- AC: 시작 전 카메라 진입 불가, 미제출 결과의 점수 생성 불가, 잠긴 미션 촬영 불가, 제출 후 홈/보드/결과 1,200점 일치, 재제출 중복 없음, 새로고침 유지, 초기화 시 1,100점 시나리오로 복원, 사진 POST/영구 저장 없음.
- 검증: 단위 상태 검증·중복, 모바일 Chromium E2E(모의 카메라), 기존 preview/participant 회귀, check/build. 실제 Galaxy/iPhone 검증과 배포는 별도 미실행 항목.
- 복구: `ENABLE_DEMO=false` 또는 해당 PR revert. DB 변경 없음. 데모 초기화는 가상 기록만 버린다.

## 레퍼런스 (2026-09-21 확인)

- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage): 브라우저 origin별 지속 저장, 정책에 따른 SecurityError. 최소 비민감 상태만 저장하고 실패 안내 채택. 인증/권한 저장소로 사용하지 않는다.
- [MDN getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia): 권한과 secure context 필요. 기존 카메라 재사용, 휴대폰에는 HTTPS 배포 필요.

## 후속 책임과 재검토

PO/Feature Owner가 실제 사용자 모집 전에 Supabase/OAuth·서버 업로드·보존/삭제·권한·실기기 검증을 재개한다. 출시 MVP로 소개하거나 실제 보상을 운영하기 전에 반드시 재검토한다. 독립 리뷰·CI·PO 병합 승인과 배포를 별도로 기록한다.
