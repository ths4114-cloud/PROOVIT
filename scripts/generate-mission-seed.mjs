import { readFileSync, writeFileSync } from 'node:fs';
import { missionContentSql } from './mission-content-sql.mjs';
const target = new URL('../supabase/mission-content.seed.sql', import.meta.url);
const sql = `-- GENERATED from src/lib/missions/content.ts. DEVELOPMENT ONLY. Do not edit by hand.
begin;
do $$ begin
  if not exists(select 1 from public.challenges where id='10000000-0000-4000-8000-000000000001' and rules_version='development-v1') then
    raise exception 'DEVELOPMENT_CHALLENGE_REQUIRED';
  end if;
end $$;
${missionContentSql('10000000-0000-4000-8000-000000000001')}
commit;
`;
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== sql)
    throw new Error('Mission seed is stale. Run node scripts/generate-mission-seed.mjs');
} else writeFileSync(target, sql, 'utf8');
