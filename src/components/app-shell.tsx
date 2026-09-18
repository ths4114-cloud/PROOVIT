import Link from 'next/link';
import type { ReactNode } from 'react';
export function AppShell({
  children,
  preview = false,
}: {
  children: ReactNode;
  preview?: boolean;
}) {
  return (
    <div className="mx-auto min-h-dvh max-w-lg border-x border-line bg-background">
      <header className="flex items-center justify-between px-6 py-5">
        <Link
          href={preview ? '/preview/home' : '/'}
          aria-label="프루빗 홈"
          className="text-2xl font-black tracking-tighter"
        >
          프루<span className="text-accent">빗</span>
          <span className="mt-0.5 block text-[8px] tracking-[.5em] text-muted">PROVE IT</span>
        </Link>
        <span className="text-[10px] font-bold tracking-[.2em] text-muted">ROUND 01</span>
      </header>
      {preview && (
        <div className="border-y border-accent/20 bg-accent/10 px-6 py-2 text-xs text-pink-200">
          화면 미리보기 · 참가·인증·점수는 예시이며 저장되지 않습니다
        </div>
      )}
      <main id="main" className="space-y-6 px-5 pt-6 pb-28">
        {children}
      </main>
      {preview && (
        <nav
          aria-label="주요 메뉴"
          className="fixed inset-x-0 bottom-0 mx-auto flex max-w-lg justify-around border-t border-line bg-background/95 px-3 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur"
        >
          <Link className="nav-link" href="/preview/home">
            홈
          </Link>
          <Link className="nav-link" href="/preview/board">
            미션보드
          </Link>
          <Link className="nav-link" href="/preview/challenge">
            챌린지
          </Link>
          <Link className="nav-link" href="/login">
            로그인
          </Link>
        </nav>
      )}
    </div>
  );
}
