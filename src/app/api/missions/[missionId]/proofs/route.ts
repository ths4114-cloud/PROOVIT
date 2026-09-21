import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContext, logFailure } from '@/lib/data';
import { getAppOrigin } from '@/lib/supabase/config';
import { UUID } from '@/lib/missions/queries';
import { proofDependencies } from '@/lib/proofs/server';
import { MAX_IMAGE_BYTES } from '@/lib/proofs/image.mjs';
import { ProofError, submitProof } from '@/lib/proofs/service.mjs';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ missionId: string }> },
) {
  try {
    if (!getAppOrigin() || request.headers.get('origin') !== getAppOrigin())
      throw new ProofError('FORBIDDEN', 403);
    const { user } = await getContext();
    if (!user) throw new ProofError('UNAUTHENTICATED', 401);
    const { missionId } = await params;
    const key = request.headers.get('idempotency-key') ?? '';
    if (!UUID.test(missionId) || !UUID.test(key)) throw new ProofError('INVALID_INPUT', 400);
    if (request.headers.get('content-type')?.split(';')[0] !== 'image/jpeg')
      throw new ProofError('INVALID_IMAGE', 415);
    if (Number(request.headers.get('content-length')) > MAX_IMAGE_BYTES)
      throw new ProofError('IMAGE_TOO_LARGE', 413);
    const reader = request.body?.getReader();
    if (!reader) throw new ProofError('INVALID_IMAGE', 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_IMAGE_BYTES) {
          await reader.cancel();
          throw new ProofError('IMAGE_TOO_LARGE', 413);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const result = await submitProof(
      { userId: user.id, missionId, key, bytes: Buffer.concat(chunks) },
      proofDependencies(),
    );
    for (const path of [
      '/home',
      '/board',
      `/missions/${missionId}`,
      `/missions/${missionId}/result`,
    ])
      revalidatePath(path);
    return NextResponse.json(
      { ok: true, data: result },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (!(error instanceof ProofError)) logFailure('proof.submit');
    const code = error instanceof ProofError ? error.code : 'UNAVAILABLE';
    return NextResponse.json(
      { ok: false, error: { code } },
      {
        status: error instanceof ProofError ? error.status : 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}
