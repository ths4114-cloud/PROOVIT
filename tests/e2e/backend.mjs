// TEST ONLY: GoTrue HTTP test double + real migration on PGlite PostgreSQL.
// Never deploy this server. It accepts a fixed code and has unauthenticated test controls.
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const db = new PGlite();
const uid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const cid = '10000000-0000-4000-8000-000000000001';
await db.exec(`create role anon; create role authenticated; create schema auth;
create table auth.users(id uuid primary key, email_confirmed_at timestamptz, is_anonymous boolean default false);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;
insert into auth.users values('${uid}',now(),false);`);
await db.exec(
  readFileSync(
    new URL('../../supabase/migrations/20260916065824_participant_slice.sql', import.meta.url),
    'utf8',
  ),
);
let email = 'participant@example.test';
let fault = false;
const tokens = new Set();
function user() {
  return {
    id: uid,
    aud: 'authenticated',
    role: 'authenticated',
    email,
    email_confirmed_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    identities: [],
    created_at: new Date().toISOString(),
    is_anonymous: false,
  };
}
function session() {
  const expires_at = Math.floor(Date.now() / 1000) + 3600;
  const jwt = [
    Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
    Buffer.from(
      JSON.stringify({
        sub: uid,
        role: 'authenticated',
        aud: 'authenticated',
        exp: expires_at,
        iat: Math.floor(Date.now() / 1000),
      }),
    ).toString('base64url'),
    'test-signature',
  ].join('.');
  tokens.add(jwt);
  return {
    access_token: jwt,
    refresh_token: 'test-refresh-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at,
    user: user(),
  };
}
async function reset() {
  fault = false;
  tokens.clear();
  await db.exec(
    'reset role; truncate public.score_events,public.participations,public.missions,public.challenges cascade',
  );
  await db.exec(readFileSync(new URL('../../supabase/seed.sql', import.meta.url), 'utf8'));
  // Test only: active Challenge with enrollment open to exercise join + mission on one date.
  await db.exec(
    `update public.challenges set start_date=(now() at time zone 'Asia/Seoul')::date, enrollment_closes_at=now()+interval '1 hour' where id='${cid}'`,
  );
}
await reset();
let queue = Promise.resolve();
const server = http.createServer((req, res) => {
  queue = queue
    .then(async () => {
      res.setHeader('Content-Type', 'application/json');
      const reply = (status, data) => {
        res.writeHead(status);
        res.end(JSON.stringify(data));
      };
      const path = new URL(req.url, 'http://localhost').pathname;
      let raw = '';
      for await (const chunk of req) raw += chunk;
      let body = {};
      try {
        body = JSON.parse(raw || '{}');
      } catch {
        return reply(400, { message: 'Invalid JSON' });
      }
      if (path === '/health') return reply(200, { ready: true });
      if (path === '/__test/reset') {
        await reset();
        return reply(200, { ok: true });
      }
      if (path === '/__test/control') {
        await db.exec('reset role');
        if (body.fault !== undefined) fault = body.fault;
        if (body.day !== undefined)
          await db.query(
            `update public.challenges set start_date=(now() at time zone 'Asia/Seoul')::date - ($1::integer-1), enrollment_closes_at=least(enrollment_closes_at, (((now() at time zone 'Asia/Seoul')::date - ($1::integer-1) + 31)::timestamp at time zone 'Asia/Seoul'))`,
            [body.day],
          );
        if (body.closed)
          await db.exec(
            `update public.challenges set enrollment_closes_at=least(enrollment_closes_at,now()-interval '1 second')`,
          );
        if (body.score)
          await db.query(
            `insert into public.score_events(participation_id,challenge_id,mission_id,source_event_id,amount,policy_version) select p.id,p.challenge_id,m.id,gen_random_uuid(),$1,'e2e-fixture' from public.participations p join public.missions m on m.challenge_id=p.challenge_id`,
            [body.score],
          );
        if (body.missing) await db.exec('delete from public.missions');
        return reply(200, { ok: true });
      }
      if (path === '/__test/count')
        return reply(200, {
          count: (await db.query('select count(*)::integer as n from public.participations'))
            .rows[0].n,
        });
      const token = req.headers.authorization?.replace(/^Bearer /i, '');
      const signedIn = tokens.has(token);
      if (path === '/auth/v1/otp') {
        email = body.email;
        return reply(200, {});
      }
      if (path === '/auth/v1/verify')
        return body.token === '123456'
          ? reply(200, session())
          : reply(403, { code: 'otp_expired', msg: 'invalid code' });
      if (path === '/auth/v1/token') return reply(200, session());
      if (path === '/auth/v1/user')
        return signedIn ? reply(200, user()) : reply(401, { code: 'bad_jwt', msg: 'Invalid JWT' });
      if (path === '/auth/v1/logout') {
        tokens.delete(token);
        return reply(204, null);
      }
      if (path.startsWith('/rest/v1/rpc/')) {
        if (fault) return reply(503, { code: 'DB_DOWN', message: 'Test outage' });
        await db.exec(
          `reset role; select set_config('request.jwt.claim.sub','${signedIn ? uid : ''}',false); set role ${signedIn ? 'authenticated' : 'anon'};`,
        );
        try {
          let result;
          const name = path.split('/').at(-1);
          if (name === 'challenge_overview' || name === 'participant_home')
            result = await db.query(`select public.${name}($1) as data`, [body.p_slug]);
          else if (name === 'join_challenge')
            result = await db.query('select public.join_challenge($1,$2) as data', [
              body.p_challenge_id,
              body.p_rules_version,
            ]);
          else return reply(404, { message: 'Not found' });
          return reply(200, result.rows[0].data);
        } catch (e) {
          return reply(400, { code: e.code, message: e.message });
        } finally {
          await db.exec('reset role');
        }
      }
      reply(404, { message: 'Not found' });
    })
    .catch((e) => {
      console.error(e.message);
      if (!res.writableEnded) {
        res.writeHead(500);
        res.end('{"message":"test backend error"}');
      }
    });
});
server.listen(54329, '127.0.0.1', () =>
  console.log('TEST ONLY Supabase adapter ready on 127.0.0.1:54329; fixed OTP 123456'),
);
