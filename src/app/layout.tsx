import type { Metadata, Viewport } from 'next';
import './globals.css';
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
  themeColor: '#0b0b0e',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only">
          본문으로 이동
        </a>
        {children}
      </body>
    </html>
  );
}
