import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/lib/env';
import { getContext, logFailure } from '@/lib/data';
import { ProofError } from './service.mjs';
import type { ScoreResult } from '@/lib/contracts';

export function proofStorageConfigured() {
  return Boolean(getSupabaseConfig() && process.env.SUPABASE_SECRET_KEY);
}
export function createProofAdmin() {
  const config = getSupabaseConfig();
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!config || !secret) throw new ProofError('UNAVAILABLE');
  return createClient(config.url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, cache: 'no-store', signal: AbortSignal.timeout(20000) }),
    },
  });
}
export async function getProofResult(missionId: string): Promise<ScoreResult | null> {
  const { supabase, user } = await getContext();
  if (!user) return null;
  const { data, error } = await supabase.rpc('proof_result', { p_mission_id: missionId });
  if (error) {
    logFailure('proof.result', error.code);
    throw new ProofError('UNAVAILABLE');
  }
  return data as unknown as ScoreResult | null;
}
export function proofDependencies() {
  const admin = createProofAdmin();
  async function mutate(name: string, args: Record<string, string>) {
    const { data, error } = await admin.rpc(name, args);
    if (error) {
      logFailure(`proof.${name}`, error.code);
      if (error.message === 'KEY_CONFLICT') throw new ProofError('KEY_CONFLICT', 409);
      if (error.message === 'RATE_LIMIT') throw new ProofError('RATE_LIMIT', 429);
      if (error.message === 'FORBIDDEN') throw new ProofError('FORBIDDEN', 403);
      if (error.message === 'NOT_READY') throw new ProofError('NOT_READY', 409);
      throw new ProofError('UNAVAILABLE');
    }
    return data;
  }
  return {
    reserve: (userId: string, missionId: string, key: string, hash: string) =>
      mutate('reserve_camera_proof', {
        p_user_id: userId,
        p_mission_id: missionId,
        p_request_key: key,
        p_image_hash: hash,
      }),
    accept: (userId: string, id: string) =>
      mutate('accept_camera_proof', { p_user_id: userId, p_attempt_id: id }),
    fail: (userId: string, id: string) =>
      mutate('fail_camera_proof', { p_user_id: userId, p_attempt_id: id }),
    result: getProofResult,
    upload: async (path: string, image: Uint8Array) => {
      const { error } = await admin.storage
        .from('camera-proofs')
        .upload(path, image, { contentType: 'image/jpeg', upsert: false, cacheControl: '0' });
      if (error) {
        logFailure('proof.upload');
        throw new ProofError('UNAVAILABLE');
      }
    },
  };
}
