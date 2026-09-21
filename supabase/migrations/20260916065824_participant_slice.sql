begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  title text not null check (length(title) between 1 and 120),
  description text not null,
  start_date date not null,
  duration_days integer not null default 31 check (duration_days = 31),
  timezone text not null,
  enrollment_opens_at timestamptz not null,
  enrollment_closes_at timestamptz not null,
  published boolean not null default false,
  rules jsonb not null check (jsonb_typeof(rules) = 'array'),
  rules_version text not null check (length(rules_version) between 1 and 80),
  check (enrollment_opens_at < enrollment_closes_at)
);
create function private.validate_challenge() returns trigger language plpgsql set search_path = '' as $$
begin
  if not exists (select 1 from pg_catalog.pg_timezone_names where name = new.timezone) then
    raise exception 'INVALID_TIMEZONE' using errcode = '22023';
  end if;
  if new.enrollment_closes_at > ((new.start_date + new.duration_days)::timestamp at time zone new.timezone) then
    raise exception 'ENROLLMENT_AFTER_CHALLENGE' using errcode = '22023';
  end if;
  return new;
end;
$$;
create trigger validate_challenge before insert or update on public.challenges
for each row execute function private.validate_challenge();

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id),
  day integer not null check (day between 1 and 31),
  phase text not null check (phase in ('DEFINE','DISCOVER','VALIDATE','DESIGN','BUILD','LAUNCH')),
  title text not null check (length(title) between 1 and 160),
  purpose text not null, guide text not null, completion_criteria text not null,
  unique (challenge_id, day), unique (id, challenge_id)
);
create table public.participations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  challenge_id uuid not null references public.challenges(id),
  joined_at timestamptz not null default statement_timestamp(),
  rules_version text not null,
  unique (user_id, challenge_id), unique (id, challenge_id)
);
create table public.score_events (
  id uuid primary key default gen_random_uuid(),
  participation_id uuid not null,
  challenge_id uuid not null,
  mission_id uuid not null,
  source_event_id uuid not null unique,
  amount integer not null check (amount <> 0),
  policy_version text not null,
  created_at timestamptz not null default statement_timestamp(),
  foreign key (participation_id, challenge_id) references public.participations(id, challenge_id),
  foreign key (mission_id, challenge_id) references public.missions(id, challenge_id)
);
create index score_events_participation_idx on public.score_events(participation_id);
create index score_events_mission_idx on public.score_events(mission_id, challenge_id);
create index participations_challenge_idx on public.participations(challenge_id);
create function private.immutable_score_event() returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception 'SCORE_EVENT_IS_IMMUTABLE' using errcode = '23514';
end;
$$;
create trigger immutable_score_event before update or delete on public.score_events
for each row execute function private.immutable_score_event();

-- A pure helper for boundary tests. Public RPCs never accept a client-supplied clock.
create function public.challenge_day(p_start date, p_timezone text, p_duration integer, p_now timestamptz)
returns integer language sql stable strict security invoker set search_path = '' as $$
  select greatest(0, least(p_duration + 1, (p_now at time zone p_timezone)::date - p_start + 1));
$$;

alter table public.challenges enable row level security;
alter table public.missions enable row level security;
alter table public.participations enable row level security;
alter table public.score_events enable row level security;
revoke all on public.challenges, public.missions, public.participations, public.score_events from public, anon, authenticated;
grant select on public.challenges to anon, authenticated;
grant select on public.missions, public.participations, public.score_events to authenticated;
create policy published_challenges on public.challenges for select to anon, authenticated using (published);
create policy own_participations on public.participations for select to authenticated using (user_id = (select auth.uid()));
create policy available_missions on public.missions for select to authenticated using (
  exists (select 1 from public.challenges c join public.participations p on p.challenge_id = c.id
    where c.id = missions.challenge_id and p.user_id = (select auth.uid())
      and missions.day <= public.challenge_day(c.start_date, c.timezone, c.duration_days, statement_timestamp()))
);
create policy own_scores on public.score_events for select to authenticated using (
  exists (select 1 from public.participations p where p.id = score_events.participation_id and p.user_id = (select auth.uid()))
);

create function public.challenge_overview(p_slug text) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'challenge', to_jsonb(c), 'server_now', statement_timestamp(),
    'current_day', public.challenge_day(c.start_date,c.timezone,c.duration_days,statement_timestamp()),
    'can_join', statement_timestamp() >= c.enrollment_opens_at and statement_timestamp() < c.enrollment_closes_at
  ) from public.challenges c where c.slug = p_slug;
$$;

-- Only this narrowly scoped helper may insert Participation. No caller supplies user_id.
create function private.join_challenge(p_challenge_id uuid, p_rules_version text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_challenge public.challenges%rowtype;
  v_id uuid;
begin
  if v_user is null or not exists (select 1 from auth.users where id = v_user and email_confirmed_at is not null and coalesce(is_anonymous, false) = false) then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;
  -- Serialize same-user retries without granting client UPDATE privileges.
  perform pg_advisory_xact_lock(hashtextextended(v_user::text || ':' || p_challenge_id::text, 0));
  select id into v_id from public.participations where user_id = v_user and challenge_id = p_challenge_id;
  if v_id is not null then return v_id; end if;
  select * into v_challenge from public.challenges where id = p_challenge_id and published for share;
  if not found then raise exception 'CHALLENGE_UNAVAILABLE' using errcode = 'P0001'; end if;
  if statement_timestamp() < v_challenge.enrollment_opens_at or statement_timestamp() >= v_challenge.enrollment_closes_at then
    raise exception 'ENROLLMENT_CLOSED' using errcode = 'P0001';
  end if;
  if p_rules_version is distinct from v_challenge.rules_version then
    raise exception 'RULES_CHANGED' using errcode = 'P0001';
  end if;
  insert into public.participations(user_id, challenge_id, rules_version)
    values(v_user, p_challenge_id, v_challenge.rules_version)
    on conflict (user_id, challenge_id) do nothing returning id into v_id;
  if v_id is null then
    select id into v_id from public.participations where user_id = v_user and challenge_id = p_challenge_id;
  end if;
  return v_id;
end;
$$;
create function public.join_challenge(p_challenge_id uuid, p_rules_version text) returns uuid
language sql volatile security invoker set search_path = '' as $$
  select private.join_challenge(p_challenge_id, p_rules_version);
$$;

create function public.participant_home(p_slug text) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select public.challenge_overview(p_slug) || jsonb_build_object(
    'participation', to_jsonb(p),
    'today_mission', (select to_jsonb(m) from public.missions m
      where m.challenge_id = c.id and m.day = public.challenge_day(c.start_date,c.timezone,c.duration_days,statement_timestamp())),
    'total_score', (select coalesce(sum(s.amount),0) from public.score_events s where s.participation_id = p.id)
  ) from public.challenges c join public.participations p on p.challenge_id = c.id
    where c.slug = p_slug and p.user_id = (select auth.uid());
$$;

revoke all on function private.validate_challenge(), private.immutable_score_event(), private.join_challenge(uuid,text) from public, anon, authenticated;
revoke all on function public.challenge_day(date,text,integer,timestamptz), public.challenge_overview(text), public.join_challenge(uuid,text), public.participant_home(text) from public, anon, authenticated;
grant execute on function public.challenge_day(date,text,integer,timestamptz), public.challenge_overview(text) to anon, authenticated;
grant execute on function private.join_challenge(uuid,text), public.join_challenge(uuid,text), public.participant_home(text) to authenticated;
commit;
