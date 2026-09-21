import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { PGlite } from '@electric-sql/pglite';
import { missionContentSql } from '../scripts/mission-content-sql.mjs';
import { normalizeProofImage, MAX_IMAGE_BYTES } from '../src/lib/proofs/image.mjs';
import { submitProof } from '../src/lib/proofs/service.mjs';
const db = new PGlite();
const uid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  other = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const cid = '10000000-0000-4000-8000-000000000001';
let mid, future, photo;
const owner = () => db.exec('reset role');
const as = async (id) =>
  db.exec(
    `reset role;select set_config('request.jwt.claim.sub','${id}',false);set role authenticated;`,
  );
const reserve = async (user, key = randomUUID(), hash = 'a'.repeat(64), mission = mid) =>
  (
    await db.query('select public.reserve_camera_proof($1,$2,$3,$4) as data', [
      user,
      mission,
      key,
      hash,
    ])
  ).rows[0].data;
before(async () => {
  await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;
    create table auth.users(id uuid primary key,email_confirmed_at timestamptz,is_anonymous boolean default false);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;
    insert into auth.users values('${uid}',now(),false),('${other}',now(),false);`);
  for (const name of [
    '20260916065824_participant_slice.sql',
    '20260921070000_mission_detail.sql',
    '20260921071000_camera_proof.sql',
  ])
    await db.exec(readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8'));
  await db.exec(readFileSync(new URL('../supabase/seed.sql', import.meta.url), 'utf8'));
  await db.exec(missionContentSql(cid));
  await db.exec(
    `update public.challenges set start_date=(now() at time zone 'Asia/Seoul')::date,enrollment_closes_at=now()+interval '1 hour';`,
  );
  const missions = (await db.query('select id from public.missions order by day')).rows;
  mid = missions[0].id;
  future = missions[30].id;
  await as(uid);
  await db.query('select public.join_challenge($1,$2)', [cid, 'development-v1']);
  await owner();
  photo = await sharp({ create: { width: 2000, height: 1000, channels: 3, background: '#ff0066' } })
    .withExif({ IFD0: { Artist: 'Private test identity' } })
    .jpeg()
    .toBuffer();
});
after(() => db.close());
test('image decoding enforces JPEG, size, downscaling and strips metadata', async () => {
  assert.ok((await sharp(photo).metadata()).exif);
  const result = await normalizeProofImage(photo);
  const meta = await sharp(result).metadata();
  assert.equal(meta.width, 1600);
  assert.equal(meta.height, 800);
  assert.equal(meta.exif, undefined);
  await assert.rejects(normalizeProofImage(Buffer.from('not jpeg')));
  await assert.rejects(normalizeProofImage(Buffer.alloc(MAX_IMAGE_BYTES + 1)));
  const png = await sharp(photo).png().toBuffer();
  await assert.rejects(normalizeProofImage(png));
});
test('untrusted roles cannot reserve or award; nonparticipant and locked mission denied', async () => {
  await as(uid);
  await assert.rejects(reserve(uid), /permission denied/);
  await owner();
  await assert.rejects(reserve(other), /FORBIDDEN/);
  await assert.rejects(reserve(uid, randomUUID(), 'a'.repeat(64), future), /NOT_READY/);
});
test('serial retries create one accepted proof and score', async () => {
  const key = randomUUID();
  const r = await reserve(uid, key);
  assert.equal(r.state, 'reserved');
  assert.equal((await reserve(uid, key)).state, 'processing');
  await assert.rejects(reserve(uid, key, 'b'.repeat(64)), /KEY_CONFLICT/);
  await db.query('select public.accept_camera_proof($1,$2)', [uid, r.id]);
  await db.query('select public.accept_camera_proof($1,$2)', [uid, r.id]);
  assert.equal((await reserve(uid, key)).state, 'accepted');
  assert.equal((await reserve(uid)).state, 'accepted');
  assert.equal((await db.query('select count(*)::int as n from public.score_events')).rows[0].n, 1);
  await as(uid);
  const result = (await db.query('select public.proof_result($1) as data', [mid])).rows[0].data;
  assert.equal(result.totalScore, 100);
  assert.equal(result.awardedScore, 100);
  assert.equal(
    (await db.query('select public.mission_detail($1) as data', [mid])).rows[0].data.status,
    'accepted',
  );
  const board = (await db.query("select public.mission_board('launch-31') as data")).rows[0].data;
  assert.equal(board.missions[0].status, 'accepted');
  await as(other);
  assert.equal(
    (await db.query('select public.proof_result($1) as data', [mid])).rows[0].data,
    null,
  );
  assert.equal(
    (await db.query('select public.mission_detail($1) as data', [mid])).rows[0].data,
    null,
  );
  await owner();
});
test('expired attempts cannot award, cleanup preserves accepted scores', async () => {
  const user2 = other;
  await as(user2);
  await db.query('select public.join_challenge($1,$2)', [cid, 'development-v1']);
  await owner();
  const r = await reserve(user2);
  await db.query(
    "update public.proof_attempts set lease_until=now()-interval '11 minutes' where id=$1",
    [r.id],
  );
  await assert.rejects(
    db.query('select public.accept_camera_proof($1,$2)', [user2, r.id]),
    /EXPIRED/,
  );
  const candidates = (await db.query('select * from public.camera_cleanup_candidates()')).rows;
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].id, r.id);
  await db.query('select public.camera_cleanup_done($1)', [r.id]);
  assert.equal((await db.query('select * from public.camera_cleanup_candidates()')).rows.length, 0);
  assert.equal((await db.query('select count(*)::int as n from public.score_events')).rows[0].n, 1);
});
test('service never awards on storage failure, and recovers lost accept responses', async () => {
  const input = { userId: uid, missionId: mid, key: randomUUID(), bytes: photo };
  let accepts = 0,
    fails = 0;
  const deps = {
    reserve: async () => ({ state: 'reserved', id: randomUUID(), path: 'test.jpg' }),
    upload: async () => {
      throw new Error('Storage offline');
    },
    accept: async () => {
      accepts++;
    },
    fail: async () => {
      fails++;
    },
    result: async () => null,
  };
  await assert.rejects(submitProof(input, deps), /RETRY_REQUIRED/);
  assert.equal(accepts, 0);
  assert.equal(fails, 1);
  let committed = false;
  const expected = { status: 'accepted', totalScore: 100 };
  const recovered = await submitProof(input, {
    ...deps,
    upload: async () => {},
    accept: async () => {
      committed = true;
      throw new Error('lost response');
    },
    result: async () => (committed ? expected : null),
  });
  assert.deepEqual(recovered, expected);
  assert.equal(fails, 1);
});
