import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { ChallengeHero } from '@/components/challenge-hero';
import { JoinForm } from '@/components/forms';
import { ActionLink, Badge, Card, StateNotice } from '@/components/ui';
import { getSupabaseConfig } from '@/lib/env';
import { getOverview, getHome, getContext } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  if (!getSupabaseConfig()) {
    return (
      <AppShell>
        <ChallengeHero />
        <StateNotice title="새로운 도전을 준비하고 있어요">
          챌린지 연결이 완료되면 이곳에서 참가하고 오늘의 미션을 확인할 수 있습니다. 운영자에게
          서비스 준비 상태를 확인해 주세요.
        </StateNotice>
      </AppShell>
    );
  }

  const { user } = await getContext();
  const [overview, home, query] = await Promise.all([getOverview(), getHome(), searchParams]);

  if (!overview) {
    return (
      <AppShell authenticated={!!user}>
        <ChallengeHero />
        <StateNotice title="다음 챌린지를 준비 중이에요.">
          새로운 일정이 공개되면 이곳에서 확인할 수 있어요.
        </StateNotice>
      </AppShell>
    );
  }

  const { challenge: c, can_join: canJoin } = overview;
  const end = new Date(`${c.start_date}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + c.duration_days - 1);

  return (
    <AppShell authenticated={!!user}>
      <ChallengeHero />

      <Card>
        <Badge>{home ? '참가 완료' : canJoin ? '참가 신청 중' : '신청 기간 아님'}</Badge>
        <h2 className="mt-3 text-xl font-bold">{c.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{c.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted">진행 기간</p>
            <p className="mt-1 font-semibold">
              {c.start_date.replaceAll('-', '.')} –<br />
              {end.toISOString().slice(0, 10).replaceAll('-', '.')}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">기준 시간대</p>
            <p className="mt-1 font-semibold">{c.timezone}</p>
          </div>
        </div>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">출시까지, 한 걸음씩</h2>
          <span className="font-mono text-[10px] font-bold tracking-[.2em] text-muted">
            HOW IT WORKS
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { n: '01', title: '오늘의 미션', body: '무엇부터 할지 고민하지 않도록' },
            { n: '02', title: '실행으로 증명', body: '작은 결과물을 하나씩 쌓아가요' },
            { n: '03', title: '나의 첫 출시', body: '아이디어를 세상 밖으로' },
          ].map((step) => (
            <Card key={step.n} className="p-3 text-center">
              <p className="font-mono text-xs text-accent">{step.n}</p>
              <p className="mt-1 text-sm font-bold">{step.title}</p>
              <p className="mt-1 text-[11px] leading-5 text-muted">{step.body}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <h2 className="font-bold">시작 전에 확인해 주세요</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
          {c.rules.map((rule, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent">✓</span>
              {rule}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          신청 마감:{' '}
          {new Intl.DateTimeFormat('ko-KR', {
            timeZone: c.timezone,
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(c.enrollment_closes_at))}{' '}
          ({c.timezone})
        </p>
      </Card>

      <Card className="border-accent/50">
        {query.notice && (
          <p role="alert" className="mb-3 text-sm text-accent">
            로그인은 완료되었습니다. 참가 기간과 최신 규칙을 확인한 뒤 다시 참가해 주세요.
          </p>
        )}
        {home ? (
          <>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <span className="text-accent">✓</span>이미 참가한 챌린지입니다.
            </p>
            <ActionLink href="/home" className="mt-3 w-full">
              나의 홈으로 →
            </ActionLink>
          </>
        ) : canJoin ? (
          <JoinForm id={c.id} version={c.rules_version} />
        ) : (
          <div>
            <p className="font-semibold">지금은 참가 신청 기간이 아니에요.</p>
            <p className="mt-1 text-sm text-muted">다음 챌린지 일정을 기다려 주세요.</p>
          </div>
        )}
        <p className="mt-4 text-center text-xs text-muted">
          하루 하나의 실행, 오늘부터 증명하세요.
        </p>
      </Card>

      {!user && (
        <Link href="/login" className="block text-center text-sm font-semibold text-accent">
          이미 계정이 있으신가요? 로그인
        </Link>
      )}
    </AppShell>
  );
}
