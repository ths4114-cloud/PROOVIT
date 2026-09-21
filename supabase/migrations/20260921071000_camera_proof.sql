begin;
create table public.proof_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  participation_id uuid not null,
  challenge_id uuid not null,
  mission_id uuid not null,
  request_key uuid not null,
  image_hash text not null check (image_hash ~ '^[0-9a-f]{64}$'),
  object_path text not null unique,
  status text not null check (status in ('uploading','accepted','cleanup_pending')),
  received_at timestamptz not null default statement_timestamp(),
  lease_until timestamptz not null,
  delete_after timestamptz not null,
  file_deleted_at timestamptz,
  awarded_score integer not null check (awarded_score in (40,70,100)),
  policy_version text not null default 'camera-auto-v1',
  unique(user_id,request_key),
  foreign key(participation_id,challenge_id) references public.participations(id,challenge_id),
  foreign key(mission_id,challenge_id) references public.missions(id,challenge_id)
);
create unique index one_accepted_proof on public.proof_attempts(participation_id,mission_id) where status='accepted';
create index proof_cleanup on public.proof_attempts(delete_after) where file_deleted_at is null;
alter table public.proof_attempts enable row level security;
revoke all on public.proof_attempts from public,anon,authenticated;
grant select on public.proof_attempts to authenticated;
create policy own_proofs on public.proof_attempts for select to authenticated using(user_id=(select auth.uid()));

create function public.proof_result(p_mission_id uuid) returns jsonb
language sql stable security invoker set search_path='' as $$
  select jsonb_build_object('missionId',r.mission_id,'status','accepted',
    'awardedScore',r.awarded_score,'totalScore',(select coalesce(sum(s.amount),0) from public.score_events s where s.participation_id=r.participation_id),
    'verificationMode','capture_auto_accept','policyVersion',r.policy_version)
  from public.proof_attempts r where r.mission_id=p_mission_id and r.user_id=(select auth.uid()) and r.status='accepted';
$$;

-- Only the trusted server invokes these mutations, after verified getUser().
create function public.reserve_camera_proof(p_user_id uuid,p_mission_id uuid,p_request_key uuid,p_image_hash text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
  m public.missions%rowtype; c public.challenges%rowtype; p public.participations%rowtype;
  r public.proof_attempts%rowtype; points integer; stamp timestamptz := statement_timestamp();
begin
  if p_user_id is null or p_request_key is null or p_image_hash is null or p_image_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'INVALID_INPUT' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text,17));
  stamp:=clock_timestamp();
  if not exists(select 1 from auth.users where id=p_user_id and email_confirmed_at is not null and not coalesce(is_anonymous,false)) then
    raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select * into r from public.proof_attempts where user_id=p_user_id and request_key=p_request_key for update;
  if found then
    if r.mission_id<>p_mission_id or r.image_hash<>p_image_hash then raise exception 'KEY_CONFLICT' using errcode='P0001'; end if;
    if r.status='accepted' then return jsonb_build_object('state','accepted'); end if;
    if r.status='uploading' and r.lease_until>stamp then return jsonb_build_object('state','processing'); end if;
    update public.proof_attempts set status='cleanup_pending' where id=r.id;
    return jsonb_build_object('state','retry_required');
  end if;
  select * into m from public.missions where id=p_mission_id;
  if not found then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select * into c from public.challenges where id=m.challenge_id and published and timezone='Asia/Seoul';
  if not found then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select * into p from public.participations where challenge_id=c.id and user_id=p_user_id;
  if not found then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  if exists(select 1 from public.proof_attempts where participation_id=p.id and mission_id=m.id and status='accepted') then
    return jsonb_build_object('state','accepted'); end if;
  points:=public.mission_available_score(c.start_date,m.day,stamp);
  if points=0 or m.content_version is null then raise exception 'NOT_READY' using errcode='P0001'; end if;
  if exists(select 1 from public.proof_attempts where user_id=p_user_id and status='uploading' and lease_until>stamp) then
    return jsonb_build_object('state','processing'); end if;
  if (select count(*) from public.proof_attempts where user_id=p_user_id and received_at>stamp-interval '1 minute')>=5 then
    raise exception 'RATE_LIMIT' using errcode='P0001'; end if;
  r.id:=gen_random_uuid();
  insert into public.proof_attempts(id,user_id,participation_id,challenge_id,mission_id,request_key,image_hash,object_path,status,received_at,lease_until,delete_after,awarded_score)
  values(r.id,p_user_id,p.id,c.id,m.id,p_request_key,p_image_hash,p_user_id::text||'/'||r.id::text||'.jpg','uploading',stamp,
    least(stamp+interval '2 minutes',((c.start_date+34)::timestamp at time zone 'Asia/Seoul')),
    ((c.start_date+64)::timestamp at time zone 'Asia/Seoul'),points) returning * into r;
  return jsonb_build_object('state','reserved','id',r.id,'path',r.object_path);
end;
$$;

create function public.accept_camera_proof(p_user_id uuid,p_attempt_id uuid) returns void
language plpgsql security definer set search_path='' as $$
declare r public.proof_attempts%rowtype;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text,17));
  select * into r from public.proof_attempts where id=p_attempt_id and user_id=p_user_id for update;
  if not found then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  if r.status='accepted' then return; end if;
  if r.status<>'uploading' or r.lease_until<=clock_timestamp() then raise exception 'EXPIRED' using errcode='P0001'; end if;
  update public.proof_attempts set status='accepted' where id=r.id;
  insert into public.score_events(participation_id,challenge_id,mission_id,source_event_id,amount,policy_version)
    values(r.participation_id,r.challenge_id,r.mission_id,r.id,r.awarded_score,r.policy_version);
end;
$$;

create function public.fail_camera_proof(p_user_id uuid,p_attempt_id uuid) returns void
language sql security definer set search_path='' as $$
  update public.proof_attempts set status='cleanup_pending'
  where id=p_attempt_id and user_id=p_user_id and status='uploading';
$$;

-- Cleanup waits past the lease plus a safety interval; never deletes live attempts.
create function public.camera_cleanup_candidates() returns table(id uuid,object_path text)
language plpgsql security definer set search_path='' as $$
begin
  update public.proof_attempts set status='cleanup_pending' where status='uploading' and lease_until<statement_timestamp()-interval '10 minutes';
  return query select r.id,r.object_path from public.proof_attempts r where r.file_deleted_at is null
    and ((r.status='cleanup_pending' and r.lease_until<statement_timestamp()-interval '10 minutes')
      or (r.status='accepted' and r.delete_after<=statement_timestamp()))
    order by r.received_at limit 100;
end;
$$;
create function public.camera_cleanup_done(p_attempt_id uuid) returns void
language sql security definer set search_path='' as $$
  update public.proof_attempts set file_deleted_at=statement_timestamp() where id=p_attempt_id and file_deleted_at is null
    and ((status='cleanup_pending' and lease_until<statement_timestamp()-interval '10 minutes')
      or (status='accepted' and delete_after<=statement_timestamp()));
$$;

-- Keep the query contract; accepted/processing state now comes from the proof ledger.
alter function public.mission_detail(uuid) rename to mission_detail_content;
create function public.mission_detail(p_mission_id uuid) returns jsonb
language sql stable security invoker set search_path='' as $$
  select public.mission_detail_content(p_mission_id) || jsonb_build_object(
    'status',case when a.id is not null then 'accepted' when exists(select 1 from public.proof_attempts x where x.mission_id=p_mission_id and x.status='uploading' and x.lease_until>statement_timestamp()) then 'processing'
      else public.mission_detail_content(p_mission_id)->>'status' end,
    'awardedScore',a.awarded_score,
    'availableScore',case when a.id is not null then 0 else (public.mission_detail_content(p_mission_id)->>'availableScore')::integer end)
  from (select 1) dummy left join public.proof_attempts a on a.mission_id=p_mission_id and a.user_id=(select auth.uid()) and a.status='accepted';
$$;
-- SQL function bodies are resolved on invocation, so board uses the new detail query.
revoke all on function public.proof_result(uuid), public.mission_detail(uuid) from public,anon,authenticated;
grant execute on function public.proof_result(uuid),public.mission_detail(uuid) to authenticated;
revoke all on function public.reserve_camera_proof(uuid,uuid,uuid,text),public.accept_camera_proof(uuid,uuid),
  public.fail_camera_proof(uuid,uuid),public.camera_cleanup_candidates(),public.camera_cleanup_done(uuid) from public,anon,authenticated;
grant execute on function public.reserve_camera_proof(uuid,uuid,uuid,text),public.accept_camera_proof(uuid,uuid),
  public.fail_camera_proof(uuid,uuid),public.camera_cleanup_candidates(),public.camera_cleanup_done(uuid) to service_role;
commit;
