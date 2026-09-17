'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
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
  return offline ? (
    <div className="offline-banner" role="status">
      인터넷 연결이 끊겼습니다. 표시된 정보는 이전 조회 결과이며, 참가·로그인은 연결 후 다시 시도해
      주세요.
    </div>
  ) : null;
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
    <div className="install-area">
      <button
        className="install-button"
        onClick={async () => {
          if (prompt) {
            await prompt.prompt();
            await prompt.userChoice;
            setPrompt(null);
          } else setHelp(!help);
        }}
      >
        <Download size={16} />홈 화면에 추가하기
      </button>
      {help && (
        <p className="install-help">
          iPhone에서는 Safari의 공유 메뉴에서 ‘홈 화면에 추가’를 선택하세요. Android에서는 Chrome
          메뉴의 ‘앱 설치’ 또는 ‘홈 화면에 추가’를 선택하세요.
        </p>
      )}
    </div>
  );
}
