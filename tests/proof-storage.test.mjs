import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

test('private proof bucket rejects browser access even with broad existing policies', async () => {
  const db = new PGlite();
  try {
    // Minimal Storage schema exercises migration SQL/RLS, not the real Storage HTTP service.
    await db.exec(`create role anon;create role authenticated;create schema storage;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id integer generated always as identity,bucket_id text,name text);
      alter table storage.objects enable row level security;
      grant usage on schema storage to anon,authenticated;
      grant all on storage.objects to anon,authenticated;
      grant usage on all sequences in schema storage to anon,authenticated;
      create policy legacy_broad_policy on storage.objects for all to anon,authenticated using(true) with check(true);`);
    await db.exec(
      readFileSync(
        new URL('../supabase/migrations/20260921072000_proof_storage.sql', import.meta.url),
        'utf8',
      ),
    );
    assert.equal(
      (await db.query("select public from storage.buckets where id='camera-proofs'")).rows[0]
        .public,
      false,
    );
    await db.exec(
      "insert into storage.objects(bucket_id,name) values('camera-proofs','private.jpg'),('other','public.jpg')",
    );
    for (const role of ['anon', 'authenticated']) {
      await db.exec(`set role ${role}`);
      assert.deepEqual(
        (await db.query('select name from storage.objects')).rows.map((r) => r.name),
        ['public.jpg'],
      );
      await assert.rejects(
        db.query(
          "insert into storage.objects(bucket_id,name) values('camera-proofs','attack.jpg')",
        ),
        /row-level security/,
      );
      assert.equal(
        (await db.query("delete from storage.objects where bucket_id='camera-proofs' returning id"))
          .rows.length,
        0,
      );
      await assert.rejects(
        db.query("update storage.objects set bucket_id='camera-proofs' where bucket_id='other'"),
        /row-level security/,
      );
      await db.exec('reset role');
    }
    assert.equal(
      (
        await db.query(
          "select count(*)::int as n from storage.objects where bucket_id='camera-proofs'",
        )
      ).rows[0].n,
      1,
    );
  } finally {
    await db.close();
  }
});
