import type { Metadata, Viewport } from 'next';
import { PwaRuntime } from '@/components/pwa';
import './globals.css';
export const metadata: Metadata = {
  title: 'PROOVIT · 프루빗',
  description: '오늘의 실행으로, 나의 가능성을 증명하다. 31일 MVP 런칭 챌린지.',
  applicationName: 'PROOVIT',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '프루빗',
  },
  icons: { icon: '/icons/icon-192.png', apple: '/icons/apple-touch-icon.png' },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0d0e10',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <PwaRuntime />
        {children}
      </body>
    </html>
  );
}
