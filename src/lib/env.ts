export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const parsed = new URL(url);
    const local = ['localhost', '127.0.0.1'].includes(parsed.hostname);
    if (
      (parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:')) ||
      parsed.username ||
      parsed.password
    )
      return null;
    if (!key.startsWith('sb_publishable_')) return null;
    return { url: parsed.origin, key };
  } catch {
    return null;
  }
}
export const challengeSlug = () => process.env.PROOVIT_CHALLENGE_SLUG || 'launch-31';
