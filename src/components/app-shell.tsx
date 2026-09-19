import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

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

const navItems = [
  { href: '/preview/home', Icon: HomeIcon, label: '홈' },
  { href: '/preview/board', Icon: BoardIcon, label: '미션보드' },
  { href: '/preview/challenge', Icon: ChallengeIcon, label: '챌린지' },
] as const;

export function AppShell({
  children,
  preview = false,
  authenticated = false,
}: {
  children: ReactNode;
  preview?: boolean;
  authenticated?: boolean;
}) {
  return (
    <div className="mx-auto min-h-dvh max-w-lg border-x border-line bg-background">
      <header className="flex items-center justify-between px-6 py-5">
        <Link href={preview ? '/preview/home' : '/'} aria-label="프루빗 홈">
          <Image
            src="/brand/logo-pink.webp"
            alt="프루빗"
            width={180}
            height={60}
            priority
            className="h-6 w-auto"
          />
        </Link>
        <span className="font-mono text-[10px] font-bold tracking-[.2em] text-muted">ROUND 01</span>
      </header>
      {preview && (
        <div className="border-y border-accent/20 bg-accent/10 px-6 py-2 text-xs text-accent">
          화면 미리보기 · 참가·인증·점수는 예시이며 저장되지 않습니다
        </div>
      )}
      <main id="main" className="space-y-6 px-5 pt-6 pb-32">
        {children}
      </main>
      {preview && (
        <nav
          aria-label="주요 메뉴"
          className="fixed inset-x-0 bottom-0 mx-auto mb-[max(0.9rem,env(safe-area-inset-bottom))] flex max-w-[calc(28rem-1.5rem)] justify-around rounded-3xl border border-white/10 bg-white/[0.06] px-2 py-2 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        >
          {navItems.map(({ href, Icon, label }) => (
            <Link key={href} className="nav-link flex-col gap-0.5" href={href}>
              <Icon />
              {label}
            </Link>
          ))}
          <Link className="nav-link flex-col gap-0.5" href={authenticated ? '/mypage' : '/login'}>
            <UserIcon />
            {authenticated ? '마이페이지' : '로그인'}
          </Link>
        </nav>
      )}
    </div>
  );
}
