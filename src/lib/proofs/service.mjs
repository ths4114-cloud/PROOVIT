import { createHash } from 'node:crypto';
import { normalizeProofImage } from './image.mjs';

export class ProofError extends Error {
  constructor(code, status = 503) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

// Injected infrastructure makes partial failures testable without a live Storage project.
export async function submitProof({ userId, missionId, key, bytes }, deps) {
  const hash = createHash('sha256').update(bytes).digest('hex');
  const reservation = await deps.reserve(userId, missionId, key, hash);
  if (reservation.state === 'accepted') {
    const result = await deps.result(missionId);
    if (!result) throw new ProofError('UNAVAILABLE');
    return result;
  }
  if (reservation.state === 'processing') throw new ProofError('PROCESSING', 409);
  if (reservation.state === 'retry_required') throw new ProofError('RETRY_REQUIRED', 409);
  if (reservation.state !== 'reserved' || !reservation.id || !reservation.path)
    throw new ProofError('UNAVAILABLE');
  const attempt = reservation.id;
  let stage = 'image';
  try {
    const image = await normalizeProofImage(bytes);
    stage = 'upload';
    await deps.upload(reservation.path, image);
    stage = 'accept';
    await deps.accept(userId, attempt);
    const result = await deps.result(missionId);
    if (!result) throw new ProofError('UNAVAILABLE');
    return result;
  } catch {
    // A lost commit response must not delete a potentially accepted photo.
    if (stage === 'accept') {
      try {
        const result = await deps.result(missionId);
        if (result) return result;
      } catch {
        /* reconcile later */
      }
    }
    try {
      await deps.fail(userId, attempt);
    } catch {
      /* expired lease is picked up by cleanup */
    }
    throw new ProofError(
      stage === 'image' ? 'INVALID_IMAGE' : 'RETRY_REQUIRED',
      stage === 'image' ? 400 : 503,
    );
  }
}
