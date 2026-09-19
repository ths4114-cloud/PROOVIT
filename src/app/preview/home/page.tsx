import { ChallengeHero } from '@/components/challenge-hero';
import { ActionLink, Badge, Card, MonoStat } from '@/components/ui';
import { todayMission } from '@/lib/preview/data';
import { previewRoutes } from '@/lib/routes';
export default function Home() {
  return (
    <>
      <ChallengeHero />
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-muted">현재 진행</p>
          <MonoStat value={`DAY ${todayMission.day}`} suffix="/ 31" />
        </Card>
        <Card>
          <p className="text-xs text-muted">누적 점수</p>
          <MonoStat value="1,100" suffix="점" tone="gold" />
        </Card>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">오늘의 미션</h2>
        <Badge>{todayMission.phase}</Badge>
      </div>
      <Card className="border-accent/50">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl leading-8 font-bold">{todayMission.title}</h3>
          <Badge>{todayMission.availableScore}점</Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{todayMission.description}</p>
        <ol className="my-5 space-y-3">
          {todayMission.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-6">
              <span className="font-mono text-accent">0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <ActionLink className="w-full" href={previewRoutes.mission(todayMission.id)}>
          미션 시작하기 →
        </ActionLink>
      </Card>
    </>
  );
}
