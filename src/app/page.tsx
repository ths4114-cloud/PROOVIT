import { AppShell } from '@/components/app-shell';
import { ChallengeHero } from '@/components/challenge-hero';
import { ActionLink, Card } from '@/components/ui';
export default function Page() {
  return (
    <AppShell>
      <ChallengeHero />
      <Card>
        <h2 className="text-xl font-bold">작은 실행이, 결국 큰 차이를.</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          매일 하나의 미션을 수행하고, 앱 안에서 촬영한 사진으로 실행을 기록하세요.
        </p>
        <ul className="mt-5 space-y-3 text-sm">
          <li>01 · 하루에 하나씩 열리는 미션</li>
          <li>02 · 카메라로 남기는 실행 기록</li>
          <li>03 · 제출 결과와 누적 점수 확인</li>
        </ul>
      </Card>
      <ActionLink href="/login" className="w-full">
        로그인하고 시작하기 →
      </ActionLink>
      {process.env.ENABLE_UI_PREVIEW === 'true' && (
        <ActionLink href="/preview/home" className="w-full !bg-panel">
          개발용 화면 미리보기
        </ActionLink>
      )}
    </AppShell>
  );
}
