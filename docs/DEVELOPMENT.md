# 개발 시작 안내

## 처음 실행하기

1. 초대를 수락하고 저장소를 각자 컴퓨터에 clone한다.
2. 현재 공통 기반 브랜치는 `codex/app-foundation`이다. 리뷰·병합 전에는 이 브랜치를 확인한다. 병합 후에는 최신 main에서 작업한다.
3. Node 24.21.0과 npm 11.19.0을 사용한다.
4. `npm ci`로 잠금 파일 기준 의존성을 설치한다.
5. `.env.example`을 `.env.local`로 복사한다. 화면 개발은 `ENABLE_UI_PREVIEW=true`로 설정한다. 나머지 빈 Supabase 값은 실제 프로젝트 연결 때 채운다.
6. `npm run dev`를 실행하고 `http://localhost:3000`을 연다. 미리보기는 `/preview/home`이다.

PowerShell 예시:

```powershell
npm ci
Copy-Item .env.example .env.local
# .env.local의 ENABLE_UI_PREVIEW를 true로 바꾼다.
npm run dev
```

환경변수를 바꾼 뒤에는 서버를 다시 시작한다. 공개 환경에는 preview를 켜지 않는다. 시연 화면은 데이터 저장 없이 화면 연결만 확인하는 용도다.

## 검사와 커밋

```powershell
npm run format
npm run check
npm run build
npx playwright install chromium
npm run test:e2e
git diff --check
```

E2E는 빌드한 앱을 3000 포트로 직접 실행한다. 검사 전에 다른 로컬 개발 서버를 종료한다. 임의의 원격 Supabase 자격증명을 사용하지 않고 환경이 없는 상태로 검증한다. GitHub Actions는 Linux에서 같은 검사를 실행한다. CI 파일 존재와 원격 CI 통과는 별개이며 브랜치 보호도 별도 설정이다.

## 내일의 역할 분담

- A: `src/app/preview/challenge`, `src/app/login`, `src/app/preview/home`, `src/app/preview/board`. 첫 작업은 실제 로그인/참가 결과를 오늘의 미션 조회와 연결하는 작은 PR로 나눈다.
- B: `src/app/preview/missions/[missionId]`. 첫 작업은 미션 상세와 실제 카메라 촬영/재촬영을 연결한다. 사진 제출과 Score는 승인된 서버/DB 계약 뒤 별도 PR로 연결한다.
- 공통: `src/components`, `src/lib/contracts.ts`, `src/lib/routes.ts`, `src/lib/supabase`, `src/proxy.ts`, 루트 설정·lockfile. 변경 전에 상대 담당자에게 수정 범위와 계약 변경을 알린다.
- 실제 데이터 화면을 만들 때 `/preview` fixture를 보호 경로에서 import하지 않는다. UI가 필요하면 기능 컴포넌트로 분리해 서버 조회 결과를 props로 전달한다.
- 각자 작업별 브랜치를 만들고 상대방을 Reviewer로 지정한다. 실제 이름 배정은 PO가 팀원과 정한다. main으로 직접 기능 코드를 push하지 않는다.

추천 첫 브랜치: A `codex/challenge-entry`, B `codex/mission-camera`. 동시 DB migration 변경은 담당자를 한 명 정한 뒤 진행한다. 공통 기반은 미션/점수 정책을 계산하지 않는다.

## 화면과 데이터 약속

`src/lib/contracts.ts`는 화면 표시 데이터의 시작점이다. `MissionSummary`와 `MissionDetail`의 `id`를 모든 이동에 동일하게 사용한다. 날짜는 offset이 있는 ISO 8601 문자열, 화면은 KST 기준이다. `awardedScore: null`은 점수 미확정이며 0점과 다르다. `availableScore`/`status`는 서버 판정을 전달할 자리다.

샘플은 2026-10-12의 DAY 12를 고정해 사용한다. 예시 누적 1,100점·결과 1,200점은 사용자 데이터가 아니며 저장되지 않는다. 나머지 30개 미션 제목은 최종 콘텐츠가 아니다. 실제 챌린지 기간·미션 콘텐츠는 별도로 입력해야 한다.

시연 상태: `locked`, `available`, `processing`, `accepted`, `failed`, `missed`. 구현 시 loading/empty/error/retry를 함께 다룬다. 핵심 정책은 [P0 정책](decisions/2026-09-12-p0-product-policy.md)을 따른다.

## Google 로그인 연결

1. Supabase 개발 프로젝트를 준비한다. 무료 사용 범위와 데이터 지역을 확인하고 운영과 분리한다.
2. Google Cloud에서 OAuth 동의 화면과 Web application client를 만든다. 개발 중에는 테스트 사용자로 팀원 계정을 등록한다.
3. Google의 redirect URI에는 Supabase의 `https://<project-ref>.supabase.co/auth/v1/callback`을 입력한다.
4. Google Client ID/Secret은 Supabase Authentication의 Google 제공자 설정에 입력한다. Git이나 프런트엔드 환경변수에 넣지 않는다.
5. Supabase URL Configuration에 Site URL `http://localhost:3000`, Redirect URL `http://localhost:3000/auth/callback`을 등록한다.
6. `.env.local`에 Project URL, `sb_publishable_`로 시작하는 Publishable key, `APP_ORIGIN=http://localhost:3000`을 설정한다. 서비스 역할/secret key는 사용하지 않는다.
7. 서버 재시작 후 `/login`에서 Google 로그인 → `/home` → 새로고침 → 로그아웃을 확인한다. 로그인 취소와 다른 브라우저에서 callback 재사용 실패도 확인한다.

`APP_ORIGIN`은 하나의 정확한 origin이다. Vercel 환경마다 실제 주소와 Supabase 허용 callback을 맞춰야 한다. 휴대폰 카메라와 배포 검증에는 HTTPS가 필요하다. Preview 배포를 할 경우에도 테스트 사용자와 개발 프로젝트만 연결한다.

외부 계정 설정이 끝나기 전에는 “실제 Google 로그인 완료”로 기록하지 않는다. Supabase Auth 사용자 생성은 챌린지 Participant 생성과 다르다. 실제 도메인 DB/RLS·Private Storage·Cron은 후속 구현 대상이다.

## UI 기준

검정 배경·핑크 강조·둥근 카드는 사용자 기획안의 10–12번 슬라이드에서 가져왔다. CSS token은 `src/app/globals.css`, 버튼과 입력은 `src/components/ui.tsx`를 사용한다. 본문 글자는 확대 가능하고 버튼은 최소 44px 이상의 터치 영역을 가진다. 캐릭터 출처는 `public/brand/README.md`에 기록한다.
