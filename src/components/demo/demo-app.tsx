'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CameraCapture } from '@/components/camera-capture';
import { MissionJourney } from './mission-journey';
import { ActionLink, Badge, Button, Card, MonoStat, StateNotice } from '@/components/ui';
import { missionContents } from '@/lib/missions/content';
import { DEMO_DAY, demoTotal } from '@/lib/demo/state';
import { enterDemo, resetDemo, submitDemo, useDemo } from '@/lib/demo/store';

const todayPath = `/demo/missions/day-${DEMO_DAY}`;
const nav = [
  ['home', '홈'],
  ['board', '미션보드'],
  ['challenge', '챌린지'],
  ['account', '내 데모'],
] as const;

export function DemoApp({ route }: { route: string }) {
  const router = useRouter();
  const { ready, state, warning } = useDemo();
  const day = Number(route.match(/^missions\/day-(\d+)/)?.[1]);
  const mission = missionContents.find((item) => item.day === day);
  const completed = day < DEMO_DAY || (day === DEMO_DAY && state.completedToday);
  const total = demoTotal(state);

  function begin() {
    enterDemo();
    router.push('/demo/home');
  }
  function reset() {
    if (
      !window.confirm(
        '이 브라우저의 데모 진행을 초기화할까요? 실제 계정과 다른 저장 데이터는 변경하지 않습니다.',
      )
    )
      return;
    resetDemo();
    router.replace('/demo');
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-5 pb-28">
      <header className="space-y-3 border-b border-line py-5">
        <Link href="/demo" className="text-xl font-bold">
          PROOVIT <Badge>DEMO</Badge>
        </Link>
        <p className="text-xs leading-6 text-muted">
          시연용 가상 계정·점수입니다. 사진은 서버에 전송하거나 영구 저장하지 않습니다.
        </p>
      </header>
      <main id="main" className="space-y-5 py-6">
        {!ready ? (
          <p role="status">데모 기록을 불러오는 중…</p>
        ) : (
          <>
            {warning && (
              <p role="status" className="rounded-xl border border-line p-3 text-sm">
                {warning}
              </p>
            )}
            {!state.entered || route === '' ? (
              <>
                <Badge>31일 MVP 런칭 챌린지</Badge>
                <h1 className="text-3xl font-bold leading-tight">
                  매일 하나의 실행,
                  <br />
                  직접 증명해 보세요.
                </h1>
                <p className="leading-7 text-muted">
                  Google 로그인 없이 가상 참가자로 체험합니다. 오늘은 Day 12, 이전 11일은 완료된
                  샘플 기록입니다.
                </p>
                <Card>
                  <h2 className="font-bold">이번 데모에서 할 수 있어요</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    오늘의 미션 확인 → 실제 카메라 촬영 → 데모 제출 → 완료·누적 점수 확인
                  </p>
                </Card>
                <Button className="w-full" onClick={begin}>
                  {state.entered ? '데모 이어하기' : '데모로 시작'}
                </Button>
                <p className="text-xs leading-6 text-muted">
                  진행 상태만 이 브라우저에 저장됩니다. 실제 가입·챌린지 참가·리워드 지급은 발생하지
                  않습니다. 개인정보가 없는 대상을 촬영해 주세요.
                </p>
              </>
            ) : route === 'home' ? (
              <>
                <Badge>DAY 12 · 샘플 참가 중</Badge>
                <h1 className="text-2xl font-bold">데모 참가자님, 오늘의 미션</h1>
                <Card>
                  <h2 className="text-sm text-muted">데모 누적 점수</h2>
                  <MonoStat value={total.toLocaleString()} suffix="점" testId="demo-total" />
                  <p className="mt-2 text-sm">완료 {state.completedToday ? 12 : 11} / 31일</p>
                </Card>
                <Card>
                  <h2 className="text-xl font-bold">{missionContents[DEMO_DAY - 1].title}</h2>
                  <p className="my-4 text-sm leading-7 text-muted">
                    {state.completedToday
                      ? '오늘의 데모 제출을 완료했어요.'
                      : missionContents[DEMO_DAY - 1].description}
                  </p>
                  <ActionLink href={state.completedToday ? `${todayPath}/result` : todayPath}>
                    {state.completedToday ? '데모 결과 보기' : '오늘의 미션 보기'}
                  </ActionLink>
                </Card>
                <ActionLink href="/demo/board" className="w-full">
                  31일 미션보드 보기
                </ActionLink>
              </>
            ) : route === 'board' ? (
              <MissionJourney completedToday={state.completedToday} total={total} />
            ) : route === 'challenge' ? (
              <>
                <h1 className="text-2xl font-bold">31일 MVP 런칭 챌린지</h1>
                <Badge>샘플 참가 중</Badge>
                <Card>
                  <p className="leading-7">
                    아이디어 정의부터 고객 검증과 출시까지, 하루 하나의 미션을 수행하는
                    챌린지입니다. 이 데모에서는 12일차 참가자의 하루를 체험합니다.
                  </p>
                </Card>
                <ActionLink href="/demo/home">오늘의 미션으로 이동</ActionLink>
              </>
            ) : route === 'account' ? (
              <>
                <h1 className="text-2xl font-bold">내 데모</h1>
                <Card>
                  <h2 className="font-bold">데모 참가자</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    실제 Google 계정과 연결되지 않은 샘플 계정입니다. 점수는 시연용이며 다른 기기와
                    공유되지 않습니다.
                  </p>
                </Card>
                <Button onClick={reset}>데모 초기화</Button>
              </>
            ) : mission && day > DEMO_DAY ? (
              <StateNotice title="아직 열리지 않은 미션">
                데모의 오늘은 Day 12입니다.{' '}
                <Link href="/demo/board" className="underline">
                  미션보드로 돌아가기
                </Link>
              </StateNotice>
            ) : mission && route.endsWith('/result') ? (
              completed ? (
                <>
                  <Badge>{day < DEMO_DAY ? '기존 샘플 기록' : '데모 제출 완료'}</Badge>
                  <h1 className="text-2xl font-bold">Day {day} 완료 결과</h1>
                  <Card>
                    <h2 className="font-bold">미션 점수 +100점</h2>
                    <p className="mt-3">
                      데모 누적 점수{' '}
                      <strong data-testid="demo-total">{total.toLocaleString()}</strong>점
                    </p>
                  </Card>
                  <p className="text-sm leading-7 text-muted">
                    실제 사진 업로드·내용 검수·점수 지급은 없습니다. 같은 미션의 데모 결과를 다시
                    열어도 점수는 추가되지 않습니다.
                  </p>
                  <div className="grid gap-3">
                    <ActionLink href="/demo/home">홈으로 돌아가기</ActionLink>
                    <ActionLink href="/demo/board">미션보드 확인</ActionLink>
                  </div>
                </>
              ) : (
                <StateNotice title="아직 제출하지 않았어요">
                  <Link href={todayPath} className="underline">
                    미션을 확인하고 촬영해 주세요.
                  </Link>
                </StateNotice>
              )
            ) : mission && route.endsWith('/camera') ? (
              completed ? (
                <StateNotice title="이미 완료한 미션이에요">
                  <ActionLink href={`/demo/missions/day-${day}/result`}>데모 결과 보기</ActionLink>
                </StateNotice>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">Day {day} · 촬영 체험</h1>
                  <p className="text-sm leading-7 text-muted">
                    {mission.proofGuide} 데모 제출 시 사진은 저장하지 않고 완료 상태만 기록합니다.
                  </p>
                  <CameraCapture
                    key={route}
                    onDemoSubmit={() => {
                      submitDemo();
                      router.replace(`${todayPath}/result`);
                    }}
                  />
                </>
              )
            ) : mission ? (
              <>
                <Badge>
                  DAY {day} · {mission.phase}
                </Badge>
                <h1 className="text-2xl font-bold">{mission.title}</h1>
                <p className="leading-7 text-muted">{mission.description}</p>
                {(
                  [
                    ['진행 방법', mission.steps],
                    ['오늘의 제출', mission.submissionItems],
                    ['완료 기준', mission.completionCriteria],
                  ] as const
                ).map(([title, items]) => (
                  <Card key={title}>
                    <h2 className="font-bold">{title}</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
                      {items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                ))}
                <p className="text-sm leading-7 text-muted">{mission.proofGuide}</p>
                <ActionLink
                  href={`/demo/missions/day-${day}/${completed ? 'result' : 'camera'}`}
                  className="w-full"
                >
                  {completed ? '데모 결과 보기' : '카메라로 인증하기'}
                </ActionLink>
              </>
            ) : null}
          </>
        )}
      </main>
      {ready && state.entered && (
        <nav
          aria-label="데모 하단 메뉴"
          className="fixed inset-x-0 bottom-0 z-10 mx-auto grid max-w-lg grid-cols-4 border-t border-line bg-background px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        >
          {nav.map(([path, label]) => (
            <Link
              key={path}
              href={`/demo/${path}`}
              aria-current={route === path ? 'page' : undefined}
              className={`flex min-h-12 items-center justify-center rounded-xl text-sm font-bold ${route === path ? 'text-accent' : 'text-muted'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
