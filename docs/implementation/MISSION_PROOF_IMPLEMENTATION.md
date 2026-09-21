# Mission → Camera Proof → Score 구현 인계

2026-09-21. Owner: PO 정아의 `codex/mission-proof` 작업. 독립 Reviewer: 별도 Bugbot. 팀원 GitHub Approve는 [프로젝트 전체 병합 기준](../decisions/2026-09-21-project-merge-policy.md)에 따라 선택 사항이며 받은 것으로 표시하지 않는다. 선행 PR #8은 main `195319c`로 병합됐고 팀원 통합 PR #9도 반영된 상태다. 기존 Google 인증/참가 규칙·네비 디자인은 재설계하지 않았다.

## 구현 범위와 결정

- 실제31일 보드/UUID 상세, 제출 항목·완료 기준·Camera 안내와 실제 촬영 컴포넌트 연결.
- 비공개 JPEG 저장, 실제 디코딩·크기 제한·EXIF 제거, 소유권/해금/마감 검사, 요청 키 재시도, atomic accepted/점수 지급, 결과/홈/보드 갱신.
- [PO 승인 설계](../decisions/2026-09-21-mission-proof-integration-proposed.md), [API 계약](API_CONTRACT.md), [보안 경계](SECURITY_BOUNDARIES.md).
- 사진 내용의 적절성/진위 AI 판정, 랭킹 확정·금전 지급, Vercel 연결/운영 DB 적용은 이번 변경에 없다.

## 적용 순서 (이 문서만으로 실제 환경 적용 승인이 되지 않는다)

1. PR #8 병합 완료 후 이 PR의 base를 main으로 변경하고 최신 main을 병합했다. 최종 diff·독립 리뷰·CI를 확인한 뒤 PO의 MVP 잔여 PR 병합 요청 범위에서 진행한다. 강제 push하지 않는다.
2. 별도 승인된 스테이징에서 기존 participant migration 다음에 `20260921070000_mission_detail.sql`, `20260921071000_camera_proof.sql`, `20260921072000_proof_storage.sql` 순서로 적용한다. additive 변경이며 기존 participant/home 계약을 유지한다. Storage migration은 Supabase의 storage schema가 필요하다.
3. local `supabase db reset`은 파괴적 명령이므로 disposable 환경에서만 사용한다. seed 순서는 `seed.sql` → `mission-content.seed.sql`. 후자는 고정 development challenge/rules_version만 허용한다. 운영 데이터에 그대로 사용하지 않는다.
4. 카탈로그 원본은 `src/lib/missions/content.ts`. `node scripts/generate-mission-seed.mjs`로 개발 seed를 재생성하고, `npm test`가 drift를 검사한다. 실제 챌린지 반영은 대상UUID/기존데이터를 확인한 별도 승인된 작업으로 수행한다.
5. 앱 서버에 기존 Supabase URL/publishable key/APP_ORIGIN과 **서버 전용** `SUPABASE_SECRET_KEY`를 설정한다. `.env.example`에는 값이 없다. secret 미설정이면 실제 카메라 제출을 활성화하지 않는다. 키 발급/등록은 아직 실행하지 않았다.
6. HTTPS 실제 기기에서 Google 로그인→참가→상세→촬영→제출→결과·누적점수→재접속을 확인한다. Galaxy Chrome/Samsung Internet, iPhone Safari의 권한 거부/허용·재촬영·이탈·작은 글씨 가독성을 확인한다.

## 실패·삭제 운영

- 앱 오류 로그의 `operation: proof.*`, `reference`, `code`로 확인한다. 사진/토큰/Storage 경로는 로그에 남기지 않는다. UI가 성공을 못 받았더라도 DB accepted 여부를 먼저 확인한다. 임의 재적립/accepted 사진 삭제는 하지 않는다.
- Storage 업로드/DB 응답 유실 시 즉시 객체를 지우지 않는다. 만료된 시도는 cleanup_pending으로 전환한다. accepted/점수는 한 트랜잭션이고 재시도는 원래 결과를 돌려준다.
- `node scripts/cleanup-proofs.mjs`는 dry run(조회/변경 없음). 승인된 서버 환경에서 `--execute`를 명시하면 최대100개 batch를 정리한다. accepted는 마감30일 후, 미완료는 시도 만료+10분 후만 대상이다. remove 성공 후 deleted timestamp를 기록하며 실패한 행은 다음 실행에서 재시도한다. 점수는 보존한다.
- 배포 담당자는 삭제 스케줄·실패 알림·담당자를 **출시 전** 지정해야 한다. 스케줄은 아직 미설정이다. batch backlog가 계속 남으면 실행 빈도/처리량을 조정한다. 20초 HTTP timeout보다 긴 지연 업로드가 외부 저장소에 뒤늦게 남는 극단적 상황은 실제 Storage 환경에서 대조·복구 절차를 검증해야 한다.
- 코드 rollback은 이전 앱 버전으로 복귀하고 새 제출을 중단한다. additive DB/인정·점수 기록은 삭제하지 않는다. 기존 bucket 설정 불일치면 migration을 중단하고 조사한다. 새 테이블/score 데이터를 drop해서 되돌리지 않는다.

## 검증과 남은 Gate

- 로컬 `npm run check`, `npm run build`, preview E2E15개, participant/proof E2E14개 실행. 직접 미션 방문 시 만료 세션 갱신과 HttpOnly/Secure/SameSite=Lax 유지 회귀를 포함한다. 마지막 결과는 PR/최종 보고에서 확인한다.
- PGlite 통합 테스트: 권한·미래 미션 차단·KST점수·순차 재시도·Storage policy SQL·만료 정리. sharp 테스트: JPEG 디코딩/크기/실제 EXIF 제거. 서비스 테스트: 저장 실패·commit 응답 유실.
- E2E는 실제 Next 라우트+PGlite SQL을 사용하지만 OAuth/Storage/getUserMedia는 테스트 대역이다. 실제 Supabase 연동/기기 검증으로 표시하지 않는다.
- 진짜 동시성은 `npm run test:concurrency`의20개 독립 PostgreSQL 세션이 검증한다. 로컬 PostgreSQL/Docker가 없어 로컬 실행은 미실행. CI의 disposable PostgreSQL17에서 `15f5814`의 동시성·전체 검증이 [통과](https://github.com/ths4114-cloud/PROOVIT/actions/runs/35569711176/job/106238573540)했다. 후속 변경은 최신 CI 성공을 별도 확인한다.
- `5ffd00a`의 별도 Bugbot 정적 검토에서 차단 지적 없음. 통합 후 최신 head의 재확인·CI는 PR 기록을 따른다. 팀원 Approve는 선택 사항이고 PO의 명시적 병합 승인·독립 리뷰·CI는 필수다. 실제 Supabase migration/Storage/OAuth·HTTPS 실제 기기·삭제 스케줄/복구 검증은 출시 전 남은 Gate다. 자체 점검은 독립 리뷰를 대체하지 않는다.
- 기존 미추적 Discord/팀원 피드백 문서는 이번 변경에 포함하지 않는다. 최종 통합 기준 main=`195319c` (규칙 #13 및 선행 기능 #8 포함).
