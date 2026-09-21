// Run from a trusted server scheduler. Dry run unless --execute is explicitly supplied.
import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error('Missing server Storage configuration');
const client = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(20000) }) },
});
const execute = process.argv.includes('--execute');
// The RPC marks only expired attempts and returns a bounded batch, never live uploads.
if (!execute) {
  console.log('Dry run: no DB or Storage changes. Use --execute on the approved environment.');
} else {
  const { data, error } = await client.rpc('camera_cleanup_candidates');
  if (error) throw new Error('Cleanup candidate query failed');
  let removed = 0,
    failed = 0;
  for (const row of data ?? []) {
    const result = await client.storage.from('camera-proofs').remove([row.object_path]);
    if (result.error) {
      failed++;
      continue;
    }
    const marked = await client.rpc('camera_cleanup_done', { p_attempt_id: row.id });
    if (marked.error) {
      failed++;
      continue;
    }
    removed++;
  }
  // No original paths, identities or secrets in logs. Failed rows are retryable.
  console.log(JSON.stringify({ operation: 'proof.cleanup', removed, failed }));
  if (failed) process.exitCode = 1;
}
