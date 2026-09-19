import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});
export const metadata: Metadata = {
  title: { default: '프루빗 · 실행을 증명하세요', template: '%s | 프루빗' },
  description: '매일 하나의 미션, 31일의 실행. 솔로프리너 MVP 런칭 챌린지.',
  manifest: '/manifest.webmanifest',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: '프루빗' },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#100c0b',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={plexMono.variable}>
      <head>
        {/* Pretendard는 next/font/google 목록에 없어 공식 CDN 정적 빌드를 사용합니다. */}
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only">
          본문으로 이동
        </a>
        {children}
      </body>
    </html>
  );
}
