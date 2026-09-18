import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '프루빗 · PROOVIT',
    short_name: '프루빗',
    description: '31일 MVP 런칭 챌린지',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0b0e',
    theme_color: '#0b0b0e',
    lang: 'ko',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
