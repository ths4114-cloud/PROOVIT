import Link from 'next/link';
import { CalendarDays, Globe2, ArrowRight, Check, Target, Zap, Rocket } from 'lucide-react';
import { Shell, SetupNotice } from '@/components/shell';
import { JoinForm } from '@/components/forms';
import { getSupabaseConfig } from '@/lib/env';
import { getOverview, getHome, getContext } from '@/lib/data';
export const dynamic = 'force-dynamic';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  if (!getSupabaseConfig())
    return (
      <Shell active="challenge">
        <SetupNotice />
      </Shell>
    );
  const { user } = await getContext();
  const [overview, home, query] = await Promise.all([getOverview(), getHome(), searchParams]);
  if (!overview)
    return (
      <Shell loggedIn={!!user} active="challenge">
        <div className="empty-state">
          <h1>다음 챌린지를 준비 중이에요.</h1>
          <p>새로운 일정이 공개되면 이곳에서 확인할 수 있어요.</p>
        </div>
      </Shell>
    );
  const { challenge: c, can_join: canJoin } = overview;
  const end = new Date(`${c.start_date}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + c.duration_days - 1);
  return (
    <Shell active="challenge" loggedIn={!!user}>
      <section className="hero">
        <div className="hero-top">
          <span className="pill">
            <span className="status-dot" />
            {home ? '참가 완료' : canJoin ? '참가 신청 중' : '신청 기간 아님'}
          </span>
          <span className="edition">LAUNCH CHALLENGE / 01</span>
        </div>
        <p className="eyebrow">MAKE YOUR NEXT MOVE</p>
        <h1>
          아이디어를 넘어,
          <br />
          <span>진짜 출시까지.</span>
        </h1>
        <p className="hero-description">
          혼자서는 미뤘던 시작.
          <br />
          매일의 미션으로 31일 뒤의 나를 바꿔보세요.
        </p>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="launch-symbol">
            <ArrowRight strokeWidth={1.6} />
          </div>
          <span className="art-label">IDEA → REALITY</span>
          <span className="art-number">31</span>
        </div>
        <div className="hero-bottom">
          <strong>31 DAYS.</strong>
          <span>
            작은 실행이 만드는
            <br />
            가장 확실한 변화
          </span>
        </div>
      </section>
      <section className="section challenge-info">
        <p className="eyebrow">YOUR CHALLENGE</p>
        <h2>{c.title}</h2>
        <p className="muted">{c.description}</p>
        <div className="meta-grid">
          <div>
            <CalendarDays />
            <span>
              진행 기간
              <strong>
                {c.start_date.replaceAll('-', '.')} –<br />
                {end.toISOString().slice(0, 10).replaceAll('-', '.')}
              </strong>
            </span>
          </div>
          <div>
            <Globe2 />
            <span>
              기준 시간대<strong>{c.timezone}</strong>
            </span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <h2>출시까지, 한 걸음씩</h2>
          <span>HOW IT WORKS</span>
        </div>
        <div className="steps">
          <div>
            <Target />
            <span>01</span>
            <h3>오늘의 미션</h3>
            <p>
              무엇부터 할지
              <br />
              고민하지 않도록
            </p>
          </div>
          <div>
            <Zap />
            <span>02</span>
            <h3>실행으로 증명</h3>
            <p>
              작은 결과물을
              <br />
              하나씩 쌓아가요
            </p>
          </div>
          <div>
            <Rocket />
            <span>03</span>
            <h3>나의 첫 출시</h3>
            <p>
              생각 속 아이디어를
              <br />
              세상 밖으로
            </p>
          </div>
        </div>
      </section>
      <section className="section rules">
        <h2>시작 전에 확인해 주세요</h2>
        <ul>
          {c.rules.map((rule, i) => (
            <li key={i}>
              <Check size={17} />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        <p className="fine-print">
          신청 마감:{' '}
          {new Intl.DateTimeFormat('ko-KR', {
            timeZone: c.timezone,
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(c.enrollment_closes_at))}{' '}
          ({c.timezone})
        </p>
      </section>
      <section className="section join-section">
        {query.notice && (
          <p className="notice" role="alert">
            로그인은 완료되었습니다. 참가 기간과 최신 규칙을 확인한 뒤 다시 참가해 주세요.
          </p>
        )}
        {home ? (
          <>
            <p className="joined-note">
              <Check size={18} />
              이미 참가한 챌린지입니다.
            </p>
            <Link href="/home" className="button primary">
              나의 홈으로
              <ArrowRight size={19} />
            </Link>
          </>
        ) : canJoin ? (
          <JoinForm id={c.id} version={c.rules_version} />
        ) : (
          <div className="notice">
            <div>
              <strong>지금은 참가 신청 기간이 아니에요.</strong>
              <p>다음 챌린지 일정을 기다려 주세요.</p>
            </div>
          </div>
        )}
        <p className="fine-print center">하루 하나의 실행, 오늘부터 증명하세요.</p>
      </section>
    </Shell>
  );
}
