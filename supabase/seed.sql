-- DEVELOPMENT ONLY. Not approved production content. Run only on an empty/local project.
insert into public.challenges(id,slug,title,description,start_date,timezone,enrollment_opens_at,enrollment_closes_at,published,rules,rules_version)
values ('10000000-0000-4000-8000-000000000001','launch-31','31일 MVP 런칭 챌린지',
'아이디어에 머무르지 말고, 세상에 내놓으세요. 하루 하나의 미션으로 나만의 제품을 완성하는 31일.',
(current_timestamp at time zone 'Asia/Seoul')::date + 1,'Asia/Seoul',now()-interval '1 day',
(((current_timestamp at time zone 'Asia/Seoul')::date + 1)::timestamp at time zone 'Asia/Seoul'),true,
'["하루 하나의 미션을 수행하고 결과물로 실행을 증명합니다.","누적 점수에는 확정된 점수 이력만 반영됩니다.","참가비 결제와 금전 지급 기능은 제공하지 않습니다.","이 개발 챌린지의 미션은 검증용 콘텐츠입니다."]','development-v1')
on conflict do nothing;
insert into public.missions(challenge_id,day,phase,title,purpose,guide,completion_criteria)
values ('10000000-0000-4000-8000-000000000001',1,'DEFINE','해결하고 싶은 문제를 한 문장으로 정의하기',
'제품보다 먼저, 누구의 어떤 문제를 해결할지 선명하게 만드세요.',
'타깃 고객 한 명을 떠올려 보세요. 그 사람이 겪는 불편과 현재 대안을 적어 보세요.',
'대상 고객, 겪는 문제, 현재 대안을 담은 문제 정의 문장 1개를 작성합니다.')
on conflict do nothing;
