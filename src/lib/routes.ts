export const previewRoutes = {
  challenge: '/preview/challenge',
  home: '/preview/home',
  board: '/preview/board',
  mission: (id: string) => `/preview/missions/${encodeURIComponent(id)}`,
  camera: (id: string) => `/preview/missions/${encodeURIComponent(id)}/camera`,
  result: (id: string) => `/preview/missions/${encodeURIComponent(id)}/result`,
};
