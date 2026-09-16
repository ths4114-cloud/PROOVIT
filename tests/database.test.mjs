import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const db = new PGlite();
const a = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  b = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const c = '10000000-0000-4000-8000-000000000001';
const as = async (id = a) => {
  await db.exec(
    `reset role; select set_config('request.jwt.claim.sub','${id}',false); set role authenticated;`,
  );
};
before(async () => {
  // Auth identities/roles stand in for GoTrue; SQL/RLS/functions are the actual migration.
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key, email_confirmed_at timestamptz, is_anonymous boolean default false);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;
    insert into auth.users values ('${a}', now(), false), ('${b}', now(), false);`);
  await db.exec(
    readFileSync(
      new URL('../supabase/migrations/20260916065824_participant_slice.sql', import.meta.url),
      'utf8',
    ),
  );
  await db.exec(readFileSync(new URL('../supabase/seed.sql', import.meta.url), 'utf8'));
});
after(async () => {
  await db.close();
});
test('DB date is timezone-local: before start, midnight, last day, end, leap year and DST', async () => {
  const cases = [
    ['2026-09-17', 'Asia/Seoul', '2026-09-16T14:59:59.999Z', 0],
    ['2026-09-17', 'Asia/Seoul', '2026-09-16T15:00:00Z', 1],
    ['2026-09-17', 'Asia/Seoul', '2026-10-16T15:00:00Z', 31],
    ['2026-09-17', 'Asia/Seoul', '2026-10-17T15:00:00Z', 32],
    ['2024-02-28', 'UTC', '2024-03-01T00:00:00Z', 3],
    ['2026-03-07', 'America/New_York', '2026-03-09T04:00:00Z', 3],
  ];
  for (const [start, tz, now, day] of cases) {
    const r = await db.query('select public.challenge_day($1,$2,31,$3) as day', [start, tz, now]);
    assert.equal(r.rows[0].day, day);
  }
});
test('anonymous access only sees published challenge, cannot join/read private data', async () => {
  await db.exec('set role anon');
  assert.equal(
    (await db.query("select public.challenge_overview('launch-31') as data")).rows[0].data.challenge
      .id,
    c,
  );
  await assert.rejects(
    db.query(`select public.join_challenge('${c}','development-v1')`),
    /permission denied/,
  );
  await assert.rejects(db.query('select * from public.participations'), /permission denied/);
  await assert.rejects(
    db.query("select public.participant_home('launch-31')"),
    /permission denied/,
  );
  await db.exec('reset role');
});
test('rules-version mismatch creates nothing; retry is idempotent', async () => {
  await as();
  await assert.rejects(db.query(`select public.join_challenge('${c}','old')`), /RULES_CHANGED/);
  assert.equal((await db.query('select * from public.participations')).rows.length, 0);
  const first = (await db.query(`select public.join_challenge('${c}','development-v1') as id`))
    .rows[0].id;
  const second = (await db.query(`select public.join_challenge('${c}','development-v1') as id`))
    .rows[0].id;
  assert.equal(first, second);
  assert.equal((await db.query('select * from public.participations')).rows.length, 1);
});
test('ownership, future mission secrecy, direct mutation and score spoofing blocked', async () => {
  await as(b);
  assert.equal((await db.query('select * from public.participations')).rows.length, 0);
  assert.equal(
    (await db.query("select public.participant_home('launch-31') as data")).rows[0].data,
    null,
  );
  assert.equal((await db.query('select * from public.missions')).rows.length, 0);
  await assert.rejects(
    db.query(
      `insert into public.participations(user_id,challenge_id,rules_version) values('${b}','${c}','x')`,
    ),
    /permission denied/,
  );
  await assert.rejects(
    db.query("update public.participations set rules_version='x'"),
    /permission denied/,
  );
  await assert.rejects(db.query('delete from public.participations'), /permission denied/);
  await assert.rejects(
    db.query('insert into public.score_events default values'),
    /permission denied/,
  );
});
test('home reflects current mission and append-only score adjustments; others cannot read score', async () => {
  await db.exec(`reset role; update public.challenges set start_date=(now() at time zone 'Asia/Seoul')::date where id='${c}';
    insert into public.score_events(participation_id,challenge_id,mission_id,source_event_id,amount,policy_version)
    select p.id,p.challenge_id,m.id,gen_random_uuid(),100,'fixture' from public.participations p join public.missions m on m.challenge_id=p.challenge_id;
    insert into public.score_events(participation_id,challenge_id,mission_id,source_event_id,amount,policy_version)
    select p.id,p.challenge_id,m.id,gen_random_uuid(),-30,'fixture-correction' from public.participations p join public.missions m on m.challenge_id=p.challenge_id;`);
  await as();
  const { data } = (await db.query("select public.participant_home('launch-31') as data")).rows[0];
  assert.equal(data.current_day, 1);
  assert.equal(data.total_score, 70);
  assert.equal(data.today_mission.day, 1);
  await as(b);
  assert.equal((await db.query('select * from public.score_events')).rows.length, 0);
  await db.exec('reset role');
  await assert.rejects(db.query('update public.score_events set amount=999'), /IMMUTABLE/);
  await assert.rejects(db.query('delete from public.score_events'), /IMMUTABLE/);
  await assert.rejects(
    db.query(
      `insert into public.score_events(participation_id,challenge_id,mission_id,source_event_id,amount,policy_version) select participation_id,challenge_id,mission_id,source_event_id,amount,policy_version from public.score_events limit 1`,
    ),
    /unique/,
  );
});
test('closed enrollment denies new participant but preserves original retry', async () => {
  await db.exec(
    `reset role; update public.challenges set enrollment_closes_at=statement_timestamp() where id='${c}'`,
  );
  await as(b);
  await assert.rejects(
    db.query(`select public.join_challenge('${c}','development-v1')`),
    /ENROLLMENT_CLOSED/,
  );
  await as();
  assert.ok(
    (await db.query(`select public.join_challenge('${c}','development-v1') as id`)).rows[0].id,
  );
});
test('unverified identity, invalid timezone and absent challenge cannot create data', async () => {
  await db.exec(`reset role; update auth.users set email_confirmed_at=null where id='${b}';`);
  await as(b);
  await assert.rejects(
    db.query(`select public.join_challenge('${c}','development-v1')`),
    /AUTH_REQUIRED/,
  );
  await db.exec('reset role');
  await assert.rejects(
    db.query(`update public.challenges set timezone='Invalid/Moon'`),
    /INVALID_TIMEZONE/,
  );
});
