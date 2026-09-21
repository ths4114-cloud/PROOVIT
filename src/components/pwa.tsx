'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

export function PwaRuntime() {
  const router = useRouter();
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* Browser may disable installation. Online app remains usable. */
      });
    }
    const refresh = () => {
      setOffline(!navigator.onLine);
      if (navigator.onLine) router.refresh();
    };
    const loseConnection = () => setOffline(true);
    const visible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    window.addEventListener('online', refresh);
    window.addEventListener('offline', loseConnection);
    const restored = (event: PageTransitionEvent) => {
      if (event.persisted) refresh();
    };
    window.addEventListener('pageshow', restored);
    document.addEventListener('visibilitychange', visible);
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 60000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', refresh);
      window.removeEventListener('offline', loseConnection);
      window.removeEventListener('pageshow', restored);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [router]);
  if (!offline) return null;
  return (
    <div
      role="status"
      className="border-b border-accent/25 bg-accent/10 px-6 py-2 text-center text-xs text-accent"
    >
      인터넷 연결이 끊겼습니다. 표시된 정보는 이전 조회 결과이며, 참가·로그인은 연결 후 다시 시도해
      주세요.
    </div>
  );
}

export function InstallButton() {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [help, setHelp] = useState(false);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallEvent);
    };
    const complete = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', complete);
    return () => {
      window.removeEventListener('beforeinstallprompt', capture);
      window.removeEventListener('appinstalled', complete);
    };
  }, []);
  if (installed) return null;
  return (
    <div>
      <button
        type="button"
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-panel px-5 py-3 text-sm font-semibold text-white"
        onClick={async () => {
          if (prompt) {
            await prompt.prompt();
            await prompt.userChoice;
            setPrompt(null);
          } else setHelp(!help);
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        홈 화면에 추가하기
      </button>
      {help && (
        <p className="mt-2 text-xs leading-6 text-muted">
          iPhone에서는 Safari의 공유 메뉴에서 &lsquo;홈 화면에 추가&rsquo;를 선택하세요.
          Android에서는 Chrome 메뉴의 &lsquo;앱 설치&rsquo; 또는 &lsquo;홈 화면에 추가&rsquo;를
          선택하세요.
        </p>
      )}
    </div>
  );
}
