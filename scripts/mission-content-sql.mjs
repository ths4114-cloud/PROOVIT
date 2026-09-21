// Pure SQL generation. This module never connects to a database.
import { missionContents } from '../src/lib/missions/content.ts';
const quote = (value) => `'${value.replaceAll("'", "''")}'`;
const array = (items) => `array[${items.map(quote).join(',')}]::text[]`;
export function missionContentSql(challengeId) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(challengeId))
    throw new Error('Invalid challenge UUID');
  return missionContents
    .map(
      (m) => `insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values (${quote(challengeId)},${m.day},${quote(m.phase)},${quote(m.title)},${quote(m.description)},
      ${quote(m.steps.join('\n'))},${quote(m.completionCriteria.join('\n'))},${array(m.steps)},
      ${array(m.submissionItems)},${array(m.completionCriteria)},${quote(m.proofGuide)},'mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;`,
    )
    .join('\n');
}
