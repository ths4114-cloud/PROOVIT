import { ChallengeHero } from '@/components/challenge-hero';
import { ParticipationStatus } from '@/components/participation-status';
import { ActionLink, Card } from '@/components/ui';
export default function Challenge() {
  return (
    <>
      <ChallengeHero />
      <ParticipationStatus />
      <Card tone="cream">
        <h2 className="font-bold">참가 흐름 안내</h2>
        <p className="mt-2 text-sm leading-7 text-[#4a3634]">
          로그인과 챌린지 참가는 별개입니다. 실제 참가 신청·프로젝트 설정 API는 담당 개발자가
          연결합니다.
        </p>
      </Card>
      <ActionLink href="/login" className="w-full !bg-panel">
        로그인 화면 보기
      </ActionLink>
    </>
  );
}
