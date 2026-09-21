begin;
-- No browser policies: uploads and deletions are server-only. No public URLs.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('camera-proofs','camera-proofs',false,4194304,array['image/jpeg'])
on conflict(id) do nothing;
-- Even a pre-existing broad permissive policy must not grant browser access.
create policy camera_proofs_server_only on storage.objects as restrictive for all
to anon,authenticated using(bucket_id <> 'camera-proofs') with check(bucket_id <> 'camera-proofs');
-- Fail closed rather than silently repurpose a conflicting existing bucket.
do $$ begin
  if not exists(select 1 from storage.buckets where id='camera-proofs' and public=false and file_size_limit=4194304 and allowed_mime_types=array['image/jpeg']) then
    raise exception 'CAMERA_BUCKET_CONFIG_MISMATCH';
  end if;
end $$;
commit;
