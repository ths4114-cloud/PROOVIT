import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'PROOVIT · 프루빗',
    short_name: '프루빗',
    description: '하루 하나의 실행, 31일 MVP 런칭 챌린지',
    lang: 'ko',
    start_url: '/home',
    scope: '/',
    display: 'standalone',
    background_color: '#0d0e10',
    theme_color: '#0d0e10',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
