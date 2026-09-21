export { getSupabaseConfig } from '@/lib/env';
export function getAppOrigin() {
  const value = process.env.APP_ORIGIN;
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null;
    if (
      url.protocol === 'https:' ||
      (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))
    )
      return url.origin;
    return null;
  } catch {
    return null;
  }
}
