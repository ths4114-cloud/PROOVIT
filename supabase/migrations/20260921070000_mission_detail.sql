begin;
-- Additive migration: old home consumers retain their text columns.
alter table public.missions
  add column steps text[], add column submission_items text[],
  add column completion_criteria_items text[], add column proof_guide text,
  add column content_version text;
alter table public.missions add constraint complete_mission_content check (
  (steps is null and submission_items is null and completion_criteria_items is null
    and proof_guide is null and content_version is null)
  or (steps is not null and cardinality(steps) > 0
    and submission_items is not null and cardinality(submission_items) > 0
    and completion_criteria_items is not null and cardinality(completion_criteria_items) > 0
    and proof_guide is not null and length(trim(proof_guide)) > 0
    and content_version is not null and length(trim(content_version)) > 0)
);
-- Pure policy helper. Public query endpoints never accept a client clock.
create function public.mission_available_score(p_start date, p_day integer, p_now timestamptz)
returns integer language sql immutable strict set search_path = '' as $$
  select case
    when p_day not between 1 and 31 then 0
    when p_now < ((p_start + p_day - 1)::timestamp at time zone 'Asia/Seoul') then 0
    when p_now >= ((p_start + 34)::timestamp at time zone 'Asia/Seoul') then 0
    when (p_now at time zone 'Asia/Seoul')::date = p_start + p_day - 1 then 100
    when (p_now at time zone 'Asia/Seoul')::date = p_start + p_day then 70
    else 40 end;
$$;
create function public.mission_detail(p_mission_id uuid) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'id', m.id, 'day', m.day, 'title', m.title, 'phase', m.phase,
    'description', m.purpose, 'steps', m.steps, 'submissionItems', m.submission_items,
    'completionCriteria', m.completion_criteria_items, 'proofGuide', m.proof_guide,
    'contentVersion', m.content_version,
    'status', case when statement_timestamp() >= ((c.start_date+34)::timestamp at time zone 'Asia/Seoul')
      then 'missed' else 'available' end,
    'availableScore', public.mission_available_score(c.start_date,m.day,statement_timestamp()),
    'awardedScore', null,
    'opensAt', ((c.start_date+m.day-1)::timestamp at time zone 'Asia/Seoul'),
    'proofCloseAt', ((c.start_date+34)::timestamp at time zone 'Asia/Seoul')
  ) from public.missions m join public.challenges c on c.id=m.challenge_id
  join public.participations p on p.challenge_id=c.id and p.user_id=(select auth.uid())
  where m.id=p_mission_id and c.published and c.timezone='Asia/Seoul';
$$;
create function public.mission_board(p_slug text) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object('challengeId',c.id,'title',c.title,'serverNow', statement_timestamp(),
    'missions', (select jsonb_agg(case when m.id is null then jsonb_build_object(
      'day', d.day, 'id', null, 'title', null,
      'status', case when d.day > public.challenge_day(c.start_date,c.timezone,31,statement_timestamp())
        then 'locked' else 'unavailable' end)
      else public.mission_detail(m.id) end order by d.day)
      from generate_series(1,31) as d(day)
      left join public.missions m on m.challenge_id=c.id and m.day=d.day)
  ) from public.challenges c join public.participations p on p.challenge_id=c.id
  where c.slug=p_slug and c.published and c.timezone='Asia/Seoul' and p.user_id=(select auth.uid());
$$;
revoke all on function public.mission_available_score(date,integer,timestamptz),
  public.mission_detail(uuid), public.mission_board(text) from public, anon, authenticated;
grant execute on function public.mission_available_score(date,integer,timestamptz),
  public.mission_detail(uuid), public.mission_board(text) to authenticated;
commit;
