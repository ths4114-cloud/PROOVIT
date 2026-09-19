import Link from 'next/link';
import { ArrowUpRight, House, Flag } from 'lucide-react';
import { LogoutButton } from './forms';
import { InstallButton } from './pwa';
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="프루빗 챌린지 소개">
      프루<span>빗</span>
      <small>PROVE IT.</small>
    </Link>
  );
}
export function Shell({
  children,
  active,
  loggedIn = false,
}: {
  children: React.ReactNode;
  active?: 'home' | 'challenge';
  loggedIn?: boolean;
}) {
  return (
    <div className="site-frame">
      <aside className="desktop-story">
        <Brand />
        <div>
          <p className="eyebrow">FROM IDEA TO LAUNCH</p>
          <h2>
            생각은
            <br />
            누구나.
            <br />
            <span>증명은 당신이.</span>
          </h2>
          <p>
            하루 하나의 실행.
            <br />
            31일 후, 세상에 내놓을 나의 첫 MVP.
          </p>
        </div>
        <span className="story-footer">
          BETTER YOURSELF. GAME ON. <ArrowUpRight size={20} />
        </span>
      </aside>
      <div className="app-shell">
        <a href="#main" className="skip-link">
          본문으로 건너뛰기
        </a>
        <header className="app-header">
          <Brand />
          {loggedIn ? (
            <LogoutButton />
          ) : (
            <Link href="/login" className="header-link">
              로그인
              <ArrowUpRight size={15} />
            </Link>
          )}
        </header>
        <main id="main">
          {children}
          <InstallButton />
        </main>
        {active && (
          <nav className="bottom-nav" aria-label="주요 메뉴">
            <Link href="/home" aria-current={active === 'home' ? 'page' : undefined}>
              <House size={21} />홈
            </Link>
            <span className="nav-mark" aria-hidden="true">
              P<span>↗</span>
            </span>
            <Link href="/" aria-current={active === 'challenge' ? 'page' : undefined}>
              <Flag size={21} />
              챌린지
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
export function SetupNotice() {
  return (
    <div className="empty-state">
      <p className="eyebrow">GETTING READY</p>
      <h1>
        새로운 도전을
        <br />
        준비하고 있어요.
      </h1>
      <p>챌린지 연결이 완료되면 이곳에서 참가하고 오늘의 미션을 확인할 수 있습니다.</p>
      <p className="muted">운영자에게 서비스 준비 상태를 확인해 주세요.</p>
    </div>
  );
}
