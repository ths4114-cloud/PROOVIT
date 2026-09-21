import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { todayMission as previewTodayMission } from '@/lib/preview/data';
import { LogoutButton } from '@/components/forms';

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function BoardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M15.5 16.3 17 17.8l2.6-2.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function ChallengeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 3c1 2.2-.6 3.4-1.6 4.6C9 9.2 8.3 10.6 8.3 12a3.7 3.7 0 0 0 7.4 0c0-1-.4-1.7-1-2.4-.2.9-.6 1.5-1.2 1.9.2-2-.6-3.3-1.9-4.6C10.6 5.9 10.9 4.3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 15.5c0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.2" r="3.3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 20c.9-3.6 3.8-5.5 7-5.5s6.1 1.9 7 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AppShell({
  children,
  preview = false,
  nav = true,
  authenticated = false,
}: {
  children: ReactNode;
  preview?: boolean;
  /** 탭바가 필요 없는 real 페이지(예: 로그인)에서 false로 끕니다. preview는 항상 표시됩니다. */
  nav?: boolean;
  authenticated?: boolean;
}) {
  const showNav = preview || nav;
  const home = preview ? '/preview/home' : '/home';
  const board = preview ? '/preview/board' : '/board';
  const challenge = preview ? '/preview/challenge' : '/';
  const account = authenticated ? '/mypage' : '/login';
  const cameraHref = preview ? `/preview/missions/${previewTodayMission.id}/camera` : '/camera';

  const items = [
    { href: home, Icon: HomeIcon, label: '홈' },
    { href: board, Icon: BoardIcon, label: '미션보드' },
  ] as const;

  return (
    <div className="mx-auto flex h-dvh max-w-lg flex-col overflow-hidden border-x border-line bg-background">
      <header className="flex shrink-0 items-center justify-between px-6 py-5">
        <Link href={home} aria-label="프루빗 홈">
          <Image
            src="/brand/logo-pink.webp"
            alt="프루빗"
            width={180}
            height={60}
            priority
            className="h-6 w-auto"
          />
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] font-bold tracking-[.2em] text-muted">
            ROUND 01
          </span>
          {authenticated && <LogoutButton />}
        </div>
      </header>
      {preview && (
        <div className="shrink-0 border-y border-accent/20 bg-accent/10 px-6 py-2 text-xs text-accent">
          화면 미리보기 · 참가·인증·점수는 예시이며 저장되지 않습니다
        </div>
      )}
      <main id="main" className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pt-6 pb-6">
        {children}
      </main>
      {showNav && (
        <nav
          aria-label="주요 메뉴"
          className="flex shrink-0 items-end justify-around rounded-t-3xl border-t border-white/10 bg-white/[0.06] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        >
          {items.map(({ href, Icon, label }) => (
            <Link key={href} className="nav-link flex-col gap-0.5" href={href}>
              <Icon />
              {label}
            </Link>
          ))}
          <Link
            href={cameraHref}
            aria-label="오늘의 미션 카메라 인증"
            className="-mt-6 flex flex-col items-center gap-1"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-[0_10px_24px_-6px_rgba(255,46,126,0.85)] ring-4 ring-background">
              <Image
                src="/brand/symbol-pink.webp"
                alt=""
                width={28}
                height={28}
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </span>
            <span className="text-[10px] font-semibold text-muted">인증</span>
          </Link>
          <Link className="nav-link flex-col gap-0.5" href={challenge}>
            <ChallengeIcon />
            챌린지
          </Link>
          <Link className="nav-link flex-col gap-0.5" href={account}>
            <UserIcon />
            {authenticated ? '마이페이지' : '로그인'}
          </Link>
        </nav>
      )}
    </div>
  );
}
