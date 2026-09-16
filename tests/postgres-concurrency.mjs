// Run ONLY against an empty disposable test database. Never a Supabase/production URL.
import { Client } from 'pg';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const url = process.env.TEST_DATABASE_URL;
if (!url) throw new Error('TEST_DATABASE_URL must point to a fresh disposable database.');
const admin = new Client({ connectionString: url });
await admin.connect();
const uid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  cid = '10000000-0000-4000-8000-000000000001';
const clients = [];
try {
  // Refuse to operate where application or auth data already exists.
  assert.equal(
    (
      await admin.query(
        "select to_regclass('public.challenges') as c, to_regclass('auth.users') as u",
      )
    ).rows[0].c,
    null,
  );
  assert.equal((await admin.query("select to_regclass('auth.users') as u")).rows[0].u, null);
  await admin.query(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key,email_confirmed_at timestamptz,is_anonymous boolean default false);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;
    insert into auth.users values('${uid}',now(),false);`);
  await admin.query(
    readFileSync(
      new URL('../supabase/migrations/20260916065824_participant_slice.sql', import.meta.url),
      'utf8',
    ),
  );
  await admin.query(readFileSync(new URL('../supabase/seed.sql', import.meta.url), 'utf8'));
  for (let i = 0; i < 20; i++) {
    const client = new Client({ connectionString: url });
    await client.connect();
    clients.push(client);
    await client.query(
      `select set_config('request.jwt.claim.sub','${uid}',false);set role authenticated;`,
    );
  }
  // Hold the first insert uncommitted, then release 19 genuinely independent sessions.
  await clients[0].query('begin');
  const first = await clients[0].query('select public.join_challenge($1,$2) as id', [
    cid,
    'development-v1',
  ]);
  const pending = clients
    .slice(1)
    .map((client) =>
      client.query('select public.join_challenge($1,$2) as id', [cid, 'development-v1']),
    );
  await clients[0].query('commit');
  const results = await Promise.all(pending);
  assert.deepEqual(
    new Set(results.map((result) => result.rows[0].id)),
    new Set([first.rows[0].id]),
  );
  assert.equal(
    (await admin.query('select count(*)::integer as n from public.participations')).rows[0].n,
    1,
  );
  console.log(
    'PASS: 20 independent PostgreSQL sessions returned the same Participation; exactly one row.',
  );
  // Transaction failure must not strand a partial participation.
  await admin.query(`delete from public.participations;`);
  await clients[0].query('begin');
  await clients[0].query('select public.join_challenge($1,$2)', [cid, 'development-v1']);
  await clients[0].query('rollback');
  assert.equal(
    (await admin.query('select count(*)::integer as n from public.participations')).rows[0].n,
    0,
  );
  await clients[1].query('select public.join_challenge($1,$2)', [cid, 'development-v1']);
  assert.equal(
    (await admin.query('select count(*)::integer as n from public.participations')).rows[0].n,
    1,
  );
  console.log('PASS: rolled-back join leaves no record; retry creates exactly one.');
} finally {
  await Promise.all(clients.map((client) => client.end()));
  await admin.end();
}
