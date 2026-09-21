# Mission Camera 검증 기록

## 2026-09-21 실제 라우트 연결

- `codex/mission-proof`에서 UUID 상세→공용 카메라→사진 제출→accepted/누적 점수→보드·홈을 연결했다. 실제 경로만 제출을 활성화하며 `/preview/**`는 비활성이다.
- check/build 통과, 단위·PGlite 통합17개, preview E2E15개, participant/proof E2E13개 통과. Enter 제출 및390px 화면 스크린샷 자체 확인. 기존360/390/430px 카메라 회귀 유지.
- 인증·Storage·카메라는 E2E 대역이다. Galaxy/iPhone 실제 기기와 실제 Supabase 검증은 미실행. [상세 인계](MISSION_PROOF_IMPLEMENTATION.md) 참조.

## 자동 검증 범위

- iPhone 13 크기의 Chromium에서 미션 상세와 Camera Proof 흐름을 검증한다.
- 키보드로 카메라 시작 버튼을 실행할 수 있어야 한다.
- 촬영 뒤 미리보기와 재촬영 버튼을 제공해야 한다.
- 촬영 및 화면 이탈 시 활성 MediaStream track을 종료해야 한다.
- 권한 거부 이유와 복구 방법을 `alert`로 안내해야 한다.
- 사진첩 또는 파일 입력 요소를 제공하지 않아야 한다.
- 모바일 화면에서 가로 스크롤이 생기지 않아야 한다.
- 서버 제출과 Score 반영 전에는 제출 버튼을 활성화하지 않아야 한다.

## 2026-09-18 로컬 검증 결과

- `npm run check`: 통과
- `npm run build`: 통과
- `npm run test:e2e`: 기존 회귀 3건과 Mission Camera 4건, 총 7건의 테스트 결과가 모두 `ok`로 출력됨
- 로컬 Windows에서는 모든 결과 출력 뒤 Playwright가 web server 프로세스를 자동 종료하지 않아 세션을 수동 종료함. 테스트 실패와는 별개이며 CI와 다른 팀 환경에서 종료 동작을 다시 확인해야 한다.
- 실제 iOS Safari와 Android Chrome 기기 검증: 미실행

## 2026-09-21 통합 준비 재검증

- 기준: `e962dcd`의 앱 코드 + 이번 회귀 테스트 보강 커밋. Node 24.21.0 / npm 11.19.0 / Windows.
- 범위: 기존 콘텐츠·카메라 검증과 Draft PR 준비. 공통 UI, 인증, DB, 실제 제출·점수 구현은 제외한다.
- Feature Owner: mission-camera 브랜치 담당 개발자. 사람 Reviewer: 미지정, Draft 해제 전 지정 필요.
- 원격 fetch 결과 main `44ee708`, 팀원 #6 `d48b87c`, #7 `bd030cf`로 기존 확인값과 같았다.
- 새 테스트: 1~31일 순서·필수 항목·Camera 전용 안내·개인정보 마스킹·Day 18/Final Submission 구분, 일반 카메라 오류 이후 재시도.
- `npm run check`, `npm run build`: 통과. 앱 코드 변경 없음.
- `npm run test:e2e`: 샌드박스 안에서는 기존 7건 ok 출력 후 종료 지연을 재현하여 수동 종료(exit 1). 제한 밖에서는 보강한 전체 9건 통과, 6.3초, 정상 exit 0.
- Playwright 서버 종료 로그도 제한 밖에서는 정상 종료를 확인했다. 실행 환경 의존 문제로 판단하며 테스트 설정 변경/skip/종료코드 무시는 하지 않았다.
- 자체 점검만 수행했다. 독립 리뷰·사람 리뷰·실제 모바일 카메라·팀원 최종 통합본 검증은 미실행.
- 팀원 #7과의 기존 `src/lib/preview/data.ts` 텍스트 충돌은 유지된다. 팀원 공통 파일은 수정하지 않았으며 최종 통합 단계에서 콘텐츠 담당자가 해결한다.
- 사진 업로드·Proof 저장·점수 지급은 여전히 미구현이다. Draft PR은 이 범위를 완료로 표시하지 않는다.

## 실제 기기 출시 전 검증

### 2026-09-21 추가 수명주기 회귀

- 앱 변경 없이 테스트 3건 추가: 권한 대기 중 이탈 후 뒤늦게 받은 stream 종료, 이미지 인코딩 실패 시 stream 종료, 재촬영/이탈 시 Blob URL 해제.
- 전체 E2E: 12 passed (6.7s), exit 0, Windows 제한 밖 실행. 가상 카메라 Chromium.
- 실제 기기 미실행. 준비 조건과 빠른 확인 절차는 `MISSION_PROOF_INTEGRATION_READINESS.md` 참고.

아래 항목은 실제 기기와 HTTPS Preview 환경이 필요하므로 자동화 결과와 구분해 기록한다.

### iOS Safari 최신 2개 주요 버전

- 첫 권한 허용, 권한 거부, 설정에서 다시 허용
- 후면 카메라 우선 선택 여부
- 세로/가로 회전 뒤 영상 비율과 촬영 결과 방향
- Safari 백그라운드 전환과 복귀 뒤 카메라 상태
- 촬영, 미리보기, 재촬영과 페이지 이탈 뒤 카메라 표시등 종료

### Android Chrome 최신 2개 주요 버전

- 첫 권한 허용, 권한 거부, 설정에서 다시 허용
- 카메라가 없거나 다른 앱이 사용 중일 때 오류 안내
- 세로/가로 회전 뒤 영상 비율과 촬영 결과 방향
- Chrome 백그라운드 전환과 복귀 뒤 카메라 상태
- 촬영, 미리보기, 재촬영과 페이지 이탈 뒤 카메라 표시등 종료

## 2026-09-21 PR #9 main 통합 검증

- 입력: 우리 `4522ec0` + 승인·병합된 main `f316014` (PR #9).
- 목적/AC: 팀원 브랜드·네비·실제 참가 기능을 보존하며 프리뷰 상세/카메라 결합, 기존 제출·완료 기준 및 카메라 회귀 유지. 실제 UUID 조회·사진 제출·Score 지급·운영 변경은 제외.
- 충돌 해결: data.ts의 중복 콘텐츠 배열을 mission-content.ts 참조로 통일; foundation.spec.ts에서 최신 인증 기대값과 상세/카메라 검증을 모두 보존.
- Day 12 제목은 승인 후 main에 들어온 '더 많은 고객에게 의견을 확인해보세요' 유지. 상세 제출·완료 기준, Day 18 방향 조정, 개인정보 안내는 기존 구조화 데이터 유지.
- 팀원 공통 레이아웃·로그인·홈·DB migration은 추가 수정하지 않음. 실제 UUID 카메라 안내 화면은 아직 준비 중이며 프리뷰로 위장 연결하지 않음.
- npm ci: 성공. npm run check: 성공 (타입/lint/format/DB 단위 7건).
- npm run build: 샌드박스에서 Google 폰트 다운로드 EACCES 실패; 네트워크 허용 환경에서 성공. 설정·검사 우회 없음.
- npm run test:e2e: 15 passed (14.8s), exit 0.
- npm run test:e2e:participant: 10 passed (23.6s), exit 0. 가짜 인증 백엔드/로컬 SQL 테스트이며 운영 Google/Supabase 검증 아님.
- 추가 모바일 360/390/430px: 중앙 인증 메뉴 → day-12 camera → 촬영 → 재촬영 버튼이 nav 위에 위치함을 검증. 3건 재실행 통과, test-results/camera-integrated-{width}.png 생성.
- 자체 점검만 수행. 새 통합 커밋의 독립/사람 리뷰, 원격 CI, 실제 갤럭시/아이폰은 별도 Gate. main 병합/배포는 하지 않음.

## 미구현 범위

- 현재 사진은 브라우저 메모리에만 존재하며 새로고침하면 사라진다.
- Supabase Private Storage 업로드, 실제 파일 형식·크기 검증, Proof 저장, 자동 `accepted`, Score Event 생성은 이 변경 범위가 아니다.
- Camera 전용 UI는 촬영 대상 자체의 진위를 보장하지 않는다.
