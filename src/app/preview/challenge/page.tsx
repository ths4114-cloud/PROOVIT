import { ChallengeHero } from '@/components/challenge-hero';
import { ActionLink, Badge, Card } from '@/components/ui';
export default function Challenge() {
  return (
    <>
      <ChallengeHero />
      <Badge>참가 전 · 예시 상태</Badge>
      <Card>
        <h2 className="text-xl font-bold">31일, 나만의 MVP 출시</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          아이디어 정의부터 고객 검증, 핵심 기능 제작, 출시까지. 매일의 실행을 쌓아갑니다.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
          <p>
            기간
            <br />
            <strong>31일</strong>
          </p>
          <p>
            미션
            <br />
            <strong>매일 1개</strong>
          </p>
          <p>
            목표
            <br />
            <strong>MVP 출시</strong>
          </p>
        </div>
      </Card>
      <Card>
        <h2 className="font-bold">참가 흐름 준비 중</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          로그인과 챌린지 참가는 별개입니다. 실제 참가·프로젝트 설정은 담당 개발자가 연결합니다.
        </p>
      </Card>
      <ActionLink href="/login" className="w-full">
        로그인 화면 보기
      </ActionLink>
      <ActionLink href="/preview/home" className="w-full !bg-panel">
        참가 후 홈 미리보기
      </ActionLink>
    </>
  );
}
