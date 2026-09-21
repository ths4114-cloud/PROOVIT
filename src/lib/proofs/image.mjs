import sharp from 'sharp';
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export async function normalizeProofImage(bytes) {
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) throw new Error('INVALID_IMAGE');
  const image = sharp(bytes, { limitInputPixels: 20_000_000, failOn: 'warning' });
  const meta = await image.metadata();
  if (meta.format !== 'jpeg' || !meta.width || !meta.height || (meta.pages ?? 1) !== 1)
    throw new Error('INVALID_IMAGE');
  // sharp strips metadata unless explicitly retained. rotate() applies orientation first.
  const output = await image
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  if (output.length > MAX_IMAGE_BYTES) throw new Error('INVALID_IMAGE');
  return output;
}
