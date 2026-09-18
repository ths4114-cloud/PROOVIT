# PROOVIT Glossary

- 문서 상태: P0 정책 승인 반영
- 최종 수정일: 2026-09-12

코드, DB, API, UI와 문서에서 같은 개념에 같은 이름을 사용한다. 한글 UI 문구와 내부 영문 식별자가 다를 경우 이 문서에서 연결한다.

| 공식 용어 | 사용자 표시 후보 | 정의 | 사용하지 않을 혼용어 |
| --- | --- | --- | --- |
| Goal | 최종 목표 | Challenge가 끝날 때 Participant가 달성할 결과 | 목적, 목표값을 문맥 없이 혼용 |
| Challenge | 챌린지 | 정해진 기간, Mission, Score 정책을 공유하는 경쟁 단위 | 게임, 프로그램을 무분별하게 혼용 |
| Participant | 참가자 | Challenge에 참가한 User와 그 참가 상태 | 플레이어, 회원을 같은 의미로 혼용 |
| Project | 내 프로젝트 | Participant가 Challenge에서 출시할 제품 또는 서비스 | Goal과 혼용 |
| Phase | 단계 | 여러 Mission을 묶는 DEFINE부터 LAUNCH까지의 구간 | Stage와 혼용 |
| Mission | 미션 | 특정 Day에 해금되는 하나의 실행 행동. 해금 후 `proofCloseAt`까지 열려 있음 | Task, 할 일을 혼용 |
| Execution | 실행 | Participant가 앱 안팎에서 실제로 수행한 행동 | Proof와 혼용 |
| Camera Proof | 인증 사진 | Participant가 앱 내 Camera Capture 화면에서 새로 촬영해 제출한 이미지와 메타데이터 | 사진첩 이미지, Screenshot, 일반 파일 업로드와 혼용 |
| Technical Validation | 기술 검증 | 인증·권한·제출 가능 시각·이미지 형식·크기·저장 성공과 중복 여부를 검사하는 P0 과정 | 사진 내용 또는 Mission 수행 진위 판정과 혼용 |
| Proof Decision | 인증 판정 기록 | P0 자동 인정, 향후 AI 판정 또는 운영 정정의 방식·결과·정책 버전·사유 | 내용 검수와 파일 검증을 혼용 |
| AI Proof Monitoring | AI 인증 검수 | 정식 서비스에서 AI가 Camera Proof 내용을 판정하는 후속 기능 | P0에 구현된 기능처럼 표현 |
| Score | 점수 | 승인된 정책에 따라 Camera Proof 제출 행동에 확정된 수치. P0에서는 수행 진위 보증이 아님 | Point와 혼용 |
| Score Event | 점수 이력 | Score 생성 또는 보정을 기록한 변경 불가능한 사건 | 현재 Score 값과 혼용 |
| Ranking | 랭킹 | 매일 00:00 KST를 기준으로 생성되는 Challenge 내 Score 순서 | Leaderboard 화면 또는 실시간 Score와 혼용 |
| Ranking Snapshot | 랭킹 스냅샷 | 특정 기준시각의 전체 Rank와 동점 근거를 보존한 집계 결과 | 현재 Score 합계와 혼용 |
| Leaderboard | 전체 랭킹 | 참가자에게 공개되는 Ranking 목록 | Ranking 계산 규칙과 혼용 |
| Rival | 라이벌 | 현재 Ranking에서 가까운 비교 대상 | 친구, 팔로워와 혼용 |
| Final Submission | 최종 MVP 제출 | Challenge 종료 조건으로 제출한 공개 URL과 설명 | Proof와 혼용 |
| Reward Eligibility | 리워드 대상 여부 | 승인된 Score와 Final Submission 조건을 충족한 상태 | 실제 지급 완료와 혼용 |
| Reward Settlement | 리워드 정산 | 금전 또는 보상을 실제로 계산하고 지급하는 과정 | Reward Eligibility와 혼용 |
| Operator | 운영자 | Mission, 신고, 정정과 운영 예외를 처리할 권한이 있는 사용자 | P0의 일상 Proof 승인 담당자로 표현 |
| Policy Version | 정책 버전 | Score 등 판정에 적용된 규칙의 식별자 | 앱 버전과 혼용 |
| Launch MVP | 출시 MVP | 제한된 실제 사용자에게 안전하게 제공할 수 있는 최소 정식 제품 | 발표용 Demo와 혼용 |
| Vertical Slice | 수직 기능 단위 | UI부터 데이터 저장과 검증까지 사용자 행동 하나를 연결한 구현 단위 | 화면 묶음이나 서버 전체 작업과 혼용 |

## 상태 용어

- draft: 사용자가 아직 촬영을 시작하지 않은 상태
- camera_open: 앱이 Camera 권한을 확인하고 촬영 화면을 연 상태
- captured: 앱 내 Camera 화면에서 새 이미지가 생성된 상태
- uploading: 이미지가 저장소로 전송 중인 상태
- processing: 서버가 파일과 메타데이터를 기술 검증하는 상태
- accepted: P0 촬영·제출 정책을 충족해 Score 대상이 된 상태. 사진 내용의 진위 승인이 아님
- failed: 권한, 네트워크, 파일 검증 또는 저장 실패로 Score가 생성되지 않은 상태
- pending_ai_review: 정식 서비스 AI Monitoring에서만 사용하는 예약 상태. P0에는 사용하지 않음
- corrected: 자동 인정 또는 과거 판정을 취소·보정한 상태
- locked: 정책상 아직 행동할 수 없는 상태
- missed: 허용 기간에 유효 제출이 없는 상태

상태 이름을 변경하면 PRD, 사용자 흐름, API, DB와 분석 이벤트의 영향을 함께 검토한다.
