import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { challengeSlug } from '@/lib/env';
import type { Overview, HomeData } from '@/types/domain';
export function logFailure(operation: string, code?: string) {
  const reference = crypto.randomUUID();
  console.error(JSON.stringify({ operation, reference, code: code || 'unavailable' }));
  return reference;
}
export const getContext = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (
    error &&
    error.name !== 'AuthSessionMissingError' &&
    error.status !== 401 &&
    error.status !== 403
  ) {
    logFailure('auth.read', error.code);
    throw new Error('로그인 상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
  return { supabase, user };
});
export async function getOverview() {
  const { supabase } = await getContext();
  const { data, error } = await supabase.rpc('challenge_overview', {
    p_slug: challengeSlug(),
  });
  if (error) {
    logFailure('challenge.read', error.code);
    throw new Error('챌린지를 불러오지 못했습니다.');
  }
  return data as Overview | null;
}
export async function getHome() {
  const { supabase, user } = await getContext();
  if (!user) return null;
  const { data, error } = await supabase.rpc('participant_home', {
    p_slug: challengeSlug(),
  });
  if (error) {
    logFailure('home.read', error.code);
    throw new Error('오늘의 미션과 점수를 불러오지 못했습니다.');
  }
  return data as HomeData | null;
}
