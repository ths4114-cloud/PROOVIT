import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { missionContentSql } from '../scripts/mission-content-sql.mjs';
const db = new PGlite();
const uid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const other = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const cid = '10000000-0000-4000-8000-000000000001';
let first, future;
const as = async (user) =>
  db.exec(
    `reset role; select set_config('request.jwt.claim.sub','${user}',false); set role authenticated;`,
  );
before(async () => {
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key, email_confirmed_at timestamptz, is_anonymous boolean default false);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;
    insert into auth.users values('${uid}',now(),false),('${other}',now(),false);`);
  for (const name of ['20260916065824_participant_slice.sql', '20260921070000_mission_detail.sql'])
    await db.exec(readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8'));
  await db.exec(readFileSync(new URL('../supabase/seed.sql', import.meta.url), 'utf8'));
  await db.exec(missionContentSql(cid));
  await db.exec(
    `update public.challenges set start_date=(now() at time zone 'Asia/Seoul')::date, enrollment_closes_at=now()+interval '1 hour';`,
  );
  const rows = (await db.query('select id,day from public.missions order by day')).rows;
  first = rows[0].id;
  future = rows[30].id;
  await as(uid);
  await db.query('select public.join_challenge($1,$2)', [cid, 'development-v1']);
});
after(async () => db.close());
test('KST score uses 100/70/40 and rejects early or closed submissions', async () => {
  const cases = [
    [1, '2026-09-20T14:59:59.999Z', 0],
    [1, '2026-09-20T15:00:00Z', 100],
    [1, '2026-09-21T14:59:59.999Z', 100],
    [1, '2026-09-21T15:00:00Z', 70],
    [1, '2026-09-22T15:00:00Z', 40],
    [31, '2026-10-24T14:59:59.999Z', 40],
    [31, '2026-10-24T15:00:00Z', 0],
  ];
  for (const [day, now, expected] of cases) {
    const result = await db.query('select public.mission_available_score($1,$2,$3) as score', [
      '2026-09-21',
      day,
      now,
    ]);
    assert.equal(result.rows[0].score, expected);
  }
});
test('own detail includes complete content; locked details and another participant are hidden', async () => {
  const result = (await db.query('select public.mission_detail($1) as data', [first])).rows[0].data;
  assert.equal(result.day, 1);
  assert.equal(result.availableScore, 100);
  assert.ok(result.submissionItems.length);
  assert.ok(result.completionCriteria.length);
  assert.equal(
    (await db.query('select public.mission_detail($1) as data', [future])).rows[0].data,
    null,
  );
  await as(other);
  assert.equal(
    (await db.query('select public.mission_detail($1) as data', [first])).rows[0].data,
    null,
  );
  assert.equal(
    (await db.query("select public.mission_board('launch-31') as data")).rows[0].data,
    null,
  );
  await as(uid);
});
test('board has 31 ordered cells without exposing future titles or IDs', async () => {
  const board = (await db.query("select public.mission_board('launch-31') as data")).rows[0].data;
  assert.equal(board.missions.length, 31);
  assert.equal(board.missions[0].id, first);
  assert.deepEqual(board.missions[30], { day: 31, id: null, title: null, status: 'locked' });
});
test('canonical seed is repeatable and anonymous queries are denied', async () => {
  await db.exec('reset role');
  await db.exec(missionContentSql(cid));
  assert.equal((await db.query('select count(*)::int as n from public.missions')).rows[0].n, 31);
  await db.exec('set role anon');
  await assert.rejects(db.query('select public.mission_detail($1)', [first]), /permission denied/);
});
