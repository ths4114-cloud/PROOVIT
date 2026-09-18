# Foundation PR 병합 Gate 예외

- 상태: Accepted
- 결정자 / 결정일: PO (`@ths4114-cloud`) / 2026-09-18
- 적용 대상: Foundation PR #2만
- 근거: 2026-09-18 팀 회의에서 Foundation 수정 사항을 구두로 확인했고, PO가 이 대화에서 별도 GitHub `Approve` 없이 병합하도록 요청했다. 확인 가능한 저장소 기록은 [PR #2](https://github.com/ths4114-cloud/PROOVIT/pull/2)에 남긴다.
- 종료 조건: PR #2가 병합되거나 닫히면 이 예외는 종료된다.

## 배경

기본 협업 규칙은 독립 Reviewer의 검토, 다른 팀원의 사람 리뷰 기록과 최신 필수 CI 통과를 병합 Gate로 요구한다. Foundation PR #2는 `leejidev`의 변경 요청과 후속 최종 검토 의견을 받았고, 요청된 정책·승인 기록 수정과 최신 CI 검증을 완료했다. 팀 회의에서 Foundation 변경 내용을 구두로 확인했지만 GitHub의 정식 `Approve` 상태는 남지 않았다.

## 선택지

1. 기존 규칙을 유지해 Reviewer의 GitHub `Approve`를 기다린다.
2. Foundation PR #2에 한해 회의 확인과 PO의 저장소 기록을 사람 검토 근거로 인정하고 GitHub `Approve` 클릭을 요구하지 않는다.
3. 모든 PR에서 사람 승인 요구를 제거한다.

## 결정

선택지 2를 사용한다. Foundation PR #2는 아래 조건을 모두 만족하면 GitHub Reviewer의 정식 `Approve`가 없어도 병합할 수 있다.

- 독립 Reviewer가 남긴 변경 요청과 최종 검토 내용을 PR에서 확인할 수 있다.
- 요청된 차단 지적을 해결하고 반영 커밋을 PR에 연결한다.
- 최신 커밋의 필수 CI가 모두 통과한다.
- `main`과 병합 충돌이 없다.
- PO가 회의 확인 사실, 결정일, 적용 범위와 이 예외를 PR 본문 또는 댓글에 기록한다.

GitHub에 남아 있는 과거 `Changes requested` 상태는 이 예외의 조건과 실제 수정 증거가 충족된 경우 PR #2의 병합을 차단하지 않는다. 미해결 차단 지적이나 실패한 필수 CI를 이 예외로 통과 처리할 수 없다.

## 영향과 보완책

- 포기하는 이점: GitHub `Approve` 이벤트가 제공하는 명확한 최종 승인 이력.
- 보완책: Reviewer 피드백, 수정 커밋, 최신 CI, PO의 회의 확인 기록을 PR #2에 함께 연결한다.
- 적용하지 않는 범위: 후속 기능 PR, 인증·권한·DB·Proof·Score·Reward 정책 변경, 배포 승인.
- 책임자: PO (`@ths4114-cloud`).
- 재검토 조건: PR #2 범위가 바뀌거나 새 차단 지적·CI 실패·충돌이 생기면 병합 전에 다시 검토한다.
