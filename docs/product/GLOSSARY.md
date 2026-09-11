# PROOVIT Glossary

- 문서 상태: Draft
- 최종 수정일: 2026-09-12

코드, DB, API, UI와 문서에서 같은 개념에 같은 이름을 사용한다. 한글 UI 문구와 내부 영문 식별자가 다를 경우 이 문서에서 연결한다.

| 공식 용어 | 사용자 표시 후보 | 정의 | 사용하지 않을 혼용어 |
| --- | --- | --- | --- |
| Goal | 최종 목표 | Challenge가 끝날 때 Participant가 달성할 결과 | 목적, 목표값을 문맥 없이 혼용 |
| Challenge | 챌린지 | 정해진 기간, Mission, Score 정책을 공유하는 경쟁 단위 | 게임, 프로그램을 무분별하게 혼용 |
| Participant | 참가자 | Challenge에 참가한 User와 그 참가 상태 | 플레이어, 회원을 같은 의미로 혼용 |
| Project | 내 프로젝트 | Participant가 Challenge에서 출시할 제품 또는 서비스 | Goal과 혼용 |
| Phase | 단계 | 여러 Mission을 묶는 DEFINE부터 LAUNCH까지의 구간 | Stage와 혼용 |
| Mission | 미션 | 특정 Day에 수행할 하나의 검증 가능한 행동 | Task, 할 일을 혼용 |
| Execution | 실행 | Participant가 앱 안팎에서 실제로 수행한 행동 | Proof와 혼용 |
| Proof | 인증 결과 | Execution을 확인하기 위해 제출한 결과물과 메타데이터 | 사진, 인증샷으로 범위를 제한 |
| Proof Verification | 인증 검수 | Proof가 Mission 완료 기준을 충족하는지 판정하는 과정 | AI Monitoring을 확정 용어로 사용 |
| Proof Review | 검수 기록 | Operator의 승인·반려·정정 결과와 사유 | Verification과 Review의 책임을 혼용 |
| Score | 점수 | 승인된 정책에 따라 확정된 수치 | Point와 혼용 |
| Score Event | 점수 이력 | Score 생성 또는 보정을 기록한 변경 불가능한 사건 | 현재 Score 값과 혼용 |
| Ranking | 랭킹 | Challenge 내 확정 Score의 순서 | Leaderboard 화면과 혼용 |
| Leaderboard | 전체 랭킹 | 참가자에게 공개되는 Ranking 목록 | Ranking 계산 규칙과 혼용 |
| Rival | 라이벌 | 현재 Ranking에서 가까운 비교 대상 | 친구, 팔로워와 혼용 |
| Final Submission | 최종 MVP 제출 | Challenge 종료 조건으로 제출한 공개 URL과 설명 | Proof와 혼용 |
| Reward Eligibility | 리워드 대상 여부 | 승인된 Score와 Final Submission 조건을 충족한 상태 | 실제 지급 완료와 혼용 |
| Reward Settlement | 리워드 정산 | 금전 또는 보상을 실제로 계산하고 지급하는 과정 | Reward Eligibility와 혼용 |
| Operator | 운영자 | Mission과 Proof를 운영할 권한이 있는 사용자 | Admin을 사용자 표시 문구로 혼용 |
| Policy Version | 정책 버전 | Score 등 판정에 적용된 규칙의 식별자 | 앱 버전과 혼용 |
| Launch MVP | 출시 MVP | 제한된 실제 사용자에게 안전하게 제공할 수 있는 최소 정식 제품 | 발표용 Demo와 혼용 |
| Vertical Slice | 수직 기능 단위 | UI부터 데이터 저장과 검증까지 사용자 행동 하나를 연결한 구현 단위 | 화면 묶음이나 서버 전체 작업과 혼용 |

## 상태 용어

- draft: 사용자가 아직 제출하지 않은 상태
- uploading: 파일이 저장소로 전송 중인 상태
- processing: 서버가 파일과 메타데이터를 검증하는 상태
- pending_review: Operator 판정을 기다리는 상태
- approved: 완료 기준을 충족해 승인된 상태
- rejected: 완료 기준 또는 파일 정책을 충족하지 못해 반려된 상태
- corrected: 이전 판정을 취소하거나 보정하는 상태
- locked: 정책상 아직 행동할 수 없는 상태
- missed: 허용 기간에 유효 제출이 없는 상태

상태 이름을 변경하면 PRD, 사용자 흐름, API, DB와 분석 이벤트의 영향을 함께 검토한다.
