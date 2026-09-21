-- GENERATED from src/lib/missions/content.ts. DEVELOPMENT ONLY. Do not edit by hand.
begin;
do $$ begin
  if not exists(select 1 from public.challenges where id='10000000-0000-4000-8000-000000000001' and rules_version='development-v1') then
    raise exception 'DEVELOPMENT_CHALLENGE_REQUIRED';
  end if;
end $$;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',1,'DEFINE','이번 달에 끝낼 프로젝트를 정하세요','31일 동안 실제로 만들어보고 고객에게 보여줄 프로젝트 1개를 선택하세요. 완벽한 아이디어보다 이번 달 안에 실행하고 검증할 수 있는 아이디어가 좋습니다.',
      '후보를 최대 3개 적고 흥미, 31일 안의 실행 가능성, 실제 고객에게 보여줄 수 있는지를 비교하세요.
큰 플랫폼 대신 한 달 안에 고객이 경험할 수 있는 핵심 경험 하나로 범위를 줄이세요.
“저는 31일 동안 [누구]를 위해 [어떤 문제를 해결하는] [무엇]을 만들어 출시합니다.”를 완성하세요.','프로젝트 1개를 선택했어요.
한 줄 설명을 작성했어요.
선택한 이유를 작성했어요.',array['후보를 최대 3개 적고 흥미, 31일 안의 실행 가능성, 실제 고객에게 보여줄 수 있는지를 비교하세요.','큰 플랫폼 대신 한 달 안에 고객이 경험할 수 있는 핵심 경험 하나로 범위를 줄이세요.','“저는 31일 동안 [누구]를 위해 [어떤 문제를 해결하는] [무엇]을 만들어 출시합니다.”를 완성하세요.']::text[],
      array['프로젝트 이름','프로젝트 한 줄 설명','이 프로젝트를 선택한 이유 1~2문장']::text[],array['프로젝트 1개를 선택했어요.','한 줄 설명을 작성했어요.','선택한 이유를 작성했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',2,'DEFINE','핵심 고객을 한 사람처럼 구체화하세요','모두를 위한 제품은 누구에게도 절실하지 않을 수 있습니다. 내 프로젝트를 가장 먼저 필요로 할 사람을 구체적으로 정하세요.',
      '나이와 성별보다 지금 어떤 상황에 있고 어떤 행동을 반복하는 사람인지 먼저 적으세요.
그 사람이 언제 가장 불편하고 언제 해결책을 찾기 시작하는지 적으세요.
“[상황]에서 [문제]를 자주 겪는 사람”처럼 한 문장으로 좁히세요.','고객을 한 문장으로 정의했어요.
대표 상황을 2개 이상 적었어요.',array['나이와 성별보다 지금 어떤 상황에 있고 어떤 행동을 반복하는 사람인지 먼저 적으세요.','그 사람이 언제 가장 불편하고 언제 해결책을 찾기 시작하는지 적으세요.','“[상황]에서 [문제]를 자주 겪는 사람”처럼 한 문장으로 좁히세요.']::text[],
      array['핵심 고객 한 문장','고객이 처한 대표 상황 2~3개']::text[],array['고객을 한 문장으로 정의했어요.','대표 상황을 2개 이상 적었어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',3,'DEFINE','고객의 핵심 문제를 한 문장으로 정의하세요','해결책을 잠시 내려놓고 고객이 실제로 겪는 문제만 보세요. 좋은 문제 정의는 이후 인터뷰와 MVP의 기준이 됩니다.',
      '고객이 반복해서 겪는 불편, 시간 낭비, 비용, 불안 또는 포기하는 순간을 적으세요.
겉으로 보이는 증상과 그 때문에 생기는 결과를 나누세요.
“[고객]은 [상황]에서 [문제] 때문에 [불편/손실]을 겪는다.”로 정리하세요.','해결책 없이 문제를 표현했어요.
핵심 문제를 한 문장으로 정리했어요.',array['고객이 반복해서 겪는 불편, 시간 낭비, 비용, 불안 또는 포기하는 순간을 적으세요.','겉으로 보이는 증상과 그 때문에 생기는 결과를 나누세요.','“[고객]은 [상황]에서 [문제] 때문에 [불편/손실]을 겪는다.”로 정리하세요.']::text[],
      array['핵심 문제 1문장','보조 문제 최대 2개']::text[],array['해결책 없이 문제를 표현했어요.','핵심 문제를 한 문장으로 정리했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',4,'DEFINE','검증할 가설을 세우세요','앞으로의 조사와 인터뷰는 내 생각을 증명하는 과정이 아니라 가설이 맞는지 확인하는 과정입니다. 확인할 질문을 명확히 만드세요.',
      '이 문제를 가장 크게 느끼는 사람이 누구인지 고객 가설을 쓰세요.
문제가 실제로 얼마나 자주, 강하게 발생하는지 확인할 문제 가설을 쓰세요.
고객이 이미 시간, 돈, 노력을 쓰고 있는지 확인할 행동 가설을 쓰세요.','가설을 3개 이하로 좁혔어요.
확인할 증거를 함께 적었어요.',array['이 문제를 가장 크게 느끼는 사람이 누구인지 고객 가설을 쓰세요.','문제가 실제로 얼마나 자주, 강하게 발생하는지 확인할 문제 가설을 쓰세요.','고객이 이미 시간, 돈, 노력을 쓰고 있는지 확인할 행동 가설을 쓰세요.']::text[],
      array['검증할 핵심 가설 3개 이내','각 가설이 맞다고 판단할 증거 한 줄']::text[],array['가설을 3개 이하로 좁혔어요.','확인할 증거를 함께 적었어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',5,'DEFINE','31일 프로젝트 브리프를 완성하세요','지금까지 정한 고객, 문제, 가설을 한 장으로 모으세요. 이 브리프가 31일 동안 판단이 흔들릴 때 돌아올 기준점입니다.',
      '프로젝트명, 고객, 문제, 검증할 가설을 한 화면에 정리하세요.
무엇을 만들지뿐 아니라 누구에게 보여주고 어떤 반응을 확인할지 적으세요.
이번 달에는 만들지 않을 기능이나 범위를 2~3개 적으세요.','고객, 문제, 가설이 한 화면에 있어요.
31일 목표가 구체적이에요.',array['프로젝트명, 고객, 문제, 검증할 가설을 한 화면에 정리하세요.','무엇을 만들지뿐 아니라 누구에게 보여주고 어떤 반응을 확인할지 적으세요.','이번 달에는 만들지 않을 기능이나 범위를 2~3개 적으세요.']::text[],
      array['1페이지 프로젝트 브리프','31일 최종 목표','이번 달에 하지 않을 것 2~3개']::text[],array['고객, 문제, 가설이 한 화면에 있어요.','31일 목표가 구체적이에요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',6,'DISCOVER','고객이 지금 쓰는 대안을 찾아보세요','경쟁자는 같은 기능의 앱만이 아닙니다. 고객이 지금 문제를 해결하려고 쓰는 모든 방법이 대안입니다.',
      '고객이 무엇을 검색하고 누구에게 묻고 어떤 도구나 서비스를 쓰는지 적으세요.
앱, 서비스, 엑셀, 메모, 전문가, 커뮤니티 등 서로 다른 대안을 5개 이상 찾으세요.
각 대안을 선택하는 이유와 불편한 점을 한 줄씩 기록하세요.','대안을 5개 이상 찾았어요.
기능이 아닌 실제 고객 행동을 포함했어요.',array['고객이 무엇을 검색하고 누구에게 묻고 어떤 도구나 서비스를 쓰는지 적으세요.','앱, 서비스, 엑셀, 메모, 전문가, 커뮤니티 등 서로 다른 대안을 5개 이상 찾으세요.','각 대안을 선택하는 이유와 불편한 점을 한 줄씩 기록하세요.']::text[],
      array['현재 대안 5개 이상','각 대안의 선택 이유와 불편 한 줄']::text[],array['대안을 5개 이상 찾았어요.','기능이 아닌 실제 고객 행동을 포함했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',7,'DISCOVER','직접 경쟁 서비스를 뜯어보세요','비슷한 고객과 문제를 다루는 서비스를 살펴보고 시장이 이미 무엇을 제공하는지 확인하세요.',
      '같은 문제를 비슷한 방식으로 해결하는 국내외 경쟁 서비스 3~5개를 고르세요.
타깃, 핵심 기능, 가격, 첫 화면 메시지, 강점, 불편을 같은 항목으로 비교하세요.
“기존 서비스는 ___에 강하지만 ___는 충분히 해결하지 못한다”로 빈틈을 적으세요.','3개 이상을 같은 기준으로 비교했어요.
차별점보다 시장의 빈틈을 먼저 적었어요.',array['같은 문제를 비슷한 방식으로 해결하는 국내외 경쟁 서비스 3~5개를 고르세요.','타깃, 핵심 기능, 가격, 첫 화면 메시지, 강점, 불편을 같은 항목으로 비교하세요.','“기존 서비스는 ___에 강하지만 ___는 충분히 해결하지 못한다”로 빈틈을 적으세요.']::text[],
      array['경쟁 서비스 3~5개 비교','각 서비스의 강점과 불편','시장 빈틈 가설 1문장']::text[],array['3개 이상을 같은 기준으로 비교했어요.','차별점보다 시장의 빈틈을 먼저 적었어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',8,'DISCOVER','고객의 실제 목소리 10개를 모으세요','내가 만든 문장이 아니라 고객이 실제로 쓰는 표현을 모으세요. 이후 인터뷰 질문과 제품 카피에 도움이 됩니다.',
      '커뮤니티, SNS, 리뷰, 영상 댓글, 앱스토어 후기 등 실제 경험이 쌓이는 곳을 찾으세요.
문제, 불만, 포기 이유, 원하는 결과가 드러나는 표현을 최소 10개 모으세요.
여러 사람에게 반복되는 표현이나 상황을 표시하세요.','실제 고객 문장을 10개 모았어요.
반복되는 표현을 표시했어요.',array['커뮤니티, SNS, 리뷰, 영상 댓글, 앱스토어 후기 등 실제 경험이 쌓이는 곳을 찾으세요.','문제, 불만, 포기 이유, 원하는 결과가 드러나는 표현을 최소 10개 모으세요.','여러 사람에게 반복되는 표현이나 상황을 표시하세요.']::text[],
      array['고객 발언 또는 후기 10개 이상','반복 표현 또는 상황 Top 3']::text[],array['실제 고객 문장을 10개 모았어요.','반복되는 표현을 표시했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',9,'DISCOVER','고객 인터뷰 질문을 준비하세요','“이 서비스 쓰실래요?”보다 실제로 했던 행동을 묻는 질문이 더 정확합니다. 답을 유도하지 않는 질문을 준비하세요.',
      '최근 문제를 겪은 때와 그때 어떻게 해결했는지 같은 과거 행동을 물으세요.
발생 빈도와 시간, 돈, 노력의 크기를 확인하는 질문을 넣으세요.
초반에는 해결책 설명을 미루고 고객의 경험을 충분히 들을 수 있게 구성하세요.','과거 행동을 묻는 질문이 있어요.
유도 질문을 줄였어요.
질문을 10개 이내로 정리했어요.',array['최근 문제를 겪은 때와 그때 어떻게 해결했는지 같은 과거 행동을 물으세요.','발생 빈도와 시간, 돈, 노력의 크기를 확인하는 질문을 넣으세요.','초반에는 해결책 설명을 미루고 고객의 경험을 충분히 들을 수 있게 구성하세요.']::text[],
      array['인터뷰 질문 7~10개','꼭 확인할 가설 2~3개 표시']::text[],array['과거 행동을 묻는 질문이 있어요.','유도 질문을 줄였어요.','질문을 10개 이내로 정리했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',10,'DISCOVER','인터뷰할 고객을 섭외하세요','완벽한 질문지가 있어도 고객을 만나지 않으면 검증은 시작되지 않습니다. 실제 타깃에게 연락하는 것까지 끝내세요.',
      '지인뿐 아니라 커뮤니티나 SNS에서 만날 수 있는 실제 타깃을 포함해 후보를 10명 이상 적으세요.
판매가 아니라 문제를 이해하기 위한 15~20분 인터뷰임을 짧게 알리세요.
답장을 기다리기보다 오늘 안에 최소 5명에게 실제 요청을 보내세요.','5명 이상에게 직접 연락했어요.
실제 타깃을 포함했어요.',array['지인뿐 아니라 커뮤니티나 SNS에서 만날 수 있는 실제 타깃을 포함해 후보를 10명 이상 적으세요.','판매가 아니라 문제를 이해하기 위한 15~20분 인터뷰임을 짧게 알리세요.','답장을 기다리기보다 오늘 안에 최소 5명에게 실제 요청을 보내세요.']::text[],
      array['인터뷰 후보 목록','실제 연락 5명 이상','확정된 인터뷰 일정 또는 답장']::text[],array['5명 이상에게 직접 연락했어요.','실제 타깃을 포함했어요.']::text[],'이름, 계정, 연락처, 대화 내용 등 상대방의 개인정보를 반드시 가린 뒤 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',11,'VALIDATE','첫 번째 고객 인터뷰를 진행하세요','내 가설을 고객의 실제 경험과 비교합니다. 정답을 얻으려 하기보다 고객의 언어와 행동을 충분히 들으세요.',
      '가장 최근 문제를 겪었던 상황을 처음부터 끝까지 이야기해달라고 요청하세요.
중요한 답에는 왜 그렇게 했는지, 가장 불편한 것이 무엇인지 한 번 더 물으세요.
인터뷰 직후 문제, 현재 해결법, 강한 표현, 예상 밖의 점을 기록하세요.','실제 고객과 인터뷰했어요.
고객 표현을 그대로 기록했어요.',array['가장 최근 문제를 겪었던 상황을 처음부터 끝까지 이야기해달라고 요청하세요.','중요한 답에는 왜 그렇게 했는지, 가장 불편한 것이 무엇인지 한 번 더 물으세요.','인터뷰 직후 문제, 현재 해결법, 강한 표현, 예상 밖의 점을 기록하세요.']::text[],
      array['인터뷰 1명 완료','핵심 메모 5줄 이상','예상 밖의 발견 1개']::text[],array['실제 고객과 인터뷰했어요.','고객 표현을 그대로 기록했어요.']::text[],'이름, 연락처, 계정, 얼굴 등 인터뷰 참여자의 개인정보를 가린 메모만 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',12,'VALIDATE','더 많은 고객에게 의견을 확인해보세요','한 사람의 강한 의견을 시장 전체로 받아들이지 마세요. 다른 고객에게 같은 패턴이 반복되는지 확인합니다.',
      'DAY 11과 핵심 질문을 유지해 비교할 수 있게 만드세요.
첫 인터뷰와 다른 행동이나 우선순위가 나오면 이유를 깊게 물으세요.
두 인터뷰에서 반복된 내용과 서로 다른 내용을 각각 3개 이내로 적으세요.','두 번째 고객 인터뷰를 완료했어요.
첫 인터뷰와 비교했어요.',array['DAY 11과 핵심 질문을 유지해 비교할 수 있게 만드세요.','첫 인터뷰와 다른 행동이나 우선순위가 나오면 이유를 깊게 물으세요.','두 인터뷰에서 반복된 내용과 서로 다른 내용을 각각 3개 이내로 적으세요.']::text[],
      array['두 번째 인터뷰 완료','공통점 목록','차이점 목록']::text[],array['두 번째 고객 인터뷰를 완료했어요.','첫 인터뷰와 비교했어요.']::text[],'인터뷰 참여자를 알아볼 수 있는 개인정보를 모두 가린 비교 메모를 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',13,'VALIDATE','누적 5명까지 고객을 만나세요','인터뷰 수를 늘려 개인 의견과 반복 패턴을 구분하세요. 같은 문제가 반복되는지 보는 것이 목표입니다.',
      '가능한 범위에서 누적 5명 이상을 목표로 추가 인터뷰를 진행하세요.
문제 상황, 빈도, 현재 해결법, 비용과 노력, 원하는 결과를 같은 항목으로 기록하세요.
같은 문제나 행동이 몇 명에게서 나왔는지 숫자로 표시하세요.','누적 5명 이상을 만났어요.
반복 패턴을 숫자로 표시했어요.',array['가능한 범위에서 누적 5명 이상을 목표로 추가 인터뷰를 진행하세요.','문제 상황, 빈도, 현재 해결법, 비용과 노력, 원하는 결과를 같은 항목으로 기록하세요.','같은 문제나 행동이 몇 명에게서 나왔는지 숫자로 표시하세요.']::text[],
      array['누적 인터뷰 5명 이상','반복된 문제와 행동별 등장 횟수']::text[],array['누적 5명 이상을 만났어요.','반복 패턴을 숫자로 표시했어요.']::text[],'참여자를 식별할 수 있는 이름, 연락처, 계정 등을 가린 인터뷰 요약표를 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',14,'VALIDATE','인터뷰를 패턴으로 묶어보세요','쌓인 고객의 말을 구조화하세요. 인터뷰 내용을 반복되는 패턴으로 바꾸는 날입니다.',
      'Pain, Trigger, Current Solution, Desire의 네 칸으로 분류하세요.
표현이 달라도 같은 원인의 문제라면 하나의 묶음으로 정리하세요.
빈도와 강도가 모두 높은 인사이트를 최대 5개로 추리세요.','인터뷰 내용을 4가지 관점으로 분류했어요.
Top 5 인사이트를 정했어요.',array['Pain, Trigger, Current Solution, Desire의 네 칸으로 분류하세요.','표현이 달라도 같은 원인의 문제라면 하나의 묶음으로 정리하세요.','빈도와 강도가 모두 높은 인사이트를 최대 5개로 추리세요.']::text[],
      array['고객 인사이트 Top 5','각 인사이트를 뒷받침하는 고객 발언 또는 행동']::text[],array['인터뷰 내용을 4가지 관점으로 분류했어요.','Top 5 인사이트를 정했어요.']::text[],'고객 발언에서 개인을 알아볼 수 있는 내용을 가린 인사이트 정리 화면을 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',15,'VALIDATE','가장 먼저 해결할 문제 하나를 선택하세요','모든 문제를 한 번에 해결하지 마세요. 고객이 자주 겪고 해결하려고 행동하는 문제 하나를 선택합니다.',
      '여러 인터뷰에서 반복해서 등장했는지 빈도를 확인하세요.
고객이 시간, 돈, 노력을 쓰거나 크게 불편해하는지 강도를 확인하세요.
“이번 MVP에서는 이 문제를 해결한다”라고 말할 수 있을 정도로 좁히세요.','핵심 문제를 하나로 좁혔어요.
인터뷰 근거를 함께 적었어요.',array['여러 인터뷰에서 반복해서 등장했는지 빈도를 확인하세요.','고객이 시간, 돈, 노력을 쓰거나 크게 불편해하는지 강도를 확인하세요.','“이번 MVP에서는 이 문제를 해결한다”라고 말할 수 있을 정도로 좁히세요.']::text[],
      array['핵심 문제 1개','선택 근거: 빈도, 강도, 현재 행동','처음 가설과 달라진 점']::text[],array['핵심 문제를 하나로 좁혔어요.','인터뷰 근거를 함께 적었어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',16,'VALIDATE','같은 문제를 푸는 해결책 3개를 만들어보세요','첫 아이디어가 유일한 답이라고 가정하지 마세요. 같은 문제를 서로 다른 방식으로 해결하는 대안 3개를 만드세요.',
      '서비스, 자동화, 콘텐츠, 사람의 도움처럼 해결 방식 자체를 다르게 만드세요.
각 해결책을 고객에게 빠르게 보여줄 수 있는 최소 형태를 적으세요.
효과, 구현 난이도, 고객에게 보여주기 쉬운 정도로 우선 후보 1개를 고르세요.','서로 다른 해결 방식 3개를 만들었어요.
우선 후보를 1개 정했어요.',array['서비스, 자동화, 콘텐츠, 사람의 도움처럼 해결 방식 자체를 다르게 만드세요.','각 해결책을 고객에게 빠르게 보여줄 수 있는 최소 형태를 적으세요.','효과, 구현 난이도, 고객에게 보여주기 쉬운 정도로 우선 후보 1개를 고르세요.']::text[],
      array['해결책 후보 3개','각 해결책의 최소 테스트 형태','우선 후보 1개']::text[],array['서로 다른 해결 방식 3개를 만들었어요.','우선 후보를 1개 정했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',17,'VALIDATE','해결책을 고객에게 보여주세요','말로만 설명하지 말고 간단한 화면, 스케치 또는 문장으로 해결책을 보여주고 실제 반응을 확인하세요.',
      '피그마 한 화면, 손그림, 랜딩 카피 등 30~60분 안에 보여줄 형태를 만드세요.
3명 이상에게 보여주고 어떤 상황에서 쓸지와 가장 필요한 부분을 물으세요.
연락처 남기기, 다음 테스트 요청, 가격 질문 같은 구체적 행동을 기록하세요.','3명 이상에게 보여줬어요.
구체적인 반응과 행동을 기록했어요.',array['피그마 한 화면, 손그림, 랜딩 카피 등 30~60분 안에 보여줄 형태를 만드세요.','3명 이상에게 보여주고 어떤 상황에서 쓸지와 가장 필요한 부분을 물으세요.','연락처 남기기, 다음 테스트 요청, 가격 질문 같은 구체적 행동을 기록하세요.']::text[],
      array['솔루션 콘셉트 1개','고객 반응 3명 이상','긍정, 우려, 행동 신호 정리']::text[],array['3명 이상에게 보여줬어요.','구체적인 반응과 행동을 기록했어요.']::text[],'고객을 식별할 수 있는 개인정보를 가린 콘셉트와 반응 기록을 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',18,'VALIDATE','GO 또는 해결책 방향 조정을 결정하세요','검증의 목적은 처음 생각을 지키는 것이 아닙니다. 공식 Project Pivot이 아니라, 지금까지의 증거를 바탕으로 해결책 방향을 유지하거나 조정하세요.',
      '고객 문제, 현재 행동, 해결책 반응에서 가장 강한 근거를 각각 한 줄로 요약하세요.
근거가 충분하면 GO, 해결 방식이 빗나갔다면 해결책 방향 조정을 선택하세요.
DAY 1의 한 줄 설명을 현재 증거에 맞게 다듬되 고객과 핵심 문제 자체를 바꾸는 Project Pivot으로 처리하지 마세요.','결정을 하나 내렸어요.
고객 증거로 이유를 설명했어요.',array['고객 문제, 현재 행동, 해결책 반응에서 가장 강한 근거를 각각 한 줄로 요약하세요.','근거가 충분하면 GO, 해결 방식이 빗나갔다면 해결책 방향 조정을 선택하세요.','DAY 1의 한 줄 설명을 현재 증거에 맞게 다듬되 고객과 핵심 문제 자체를 바꾸는 Project Pivot으로 처리하지 마세요.']::text[],
      array['GO 또는 해결책 방향 조정 결정','결정 근거 3줄','다듬은 프로젝트 한 줄 설명']::text[],array['결정을 하나 내렸어요.','고객 증거로 이유를 설명했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',19,'DESIGN','MVP가 줄 단 하나의 가치를 정하세요','기능 목록보다 먼저 고객이 MVP를 사용한 뒤 얻게 될 변화 하나를 정하세요.',
      '고객이 사용 전에는 못하지만 사용 후에는 할 수 있게 되는 것을 적으세요.
“이 MVP는 고객이 ___할 수 있게 해준다”라는 문장을 완성하세요.
가치가 전달됐는지 확인할 행동이나 반응 신호를 적으세요.','핵심 가치를 한 문장으로 정했어요.
확인할 행동 신호를 적었어요.',array['고객이 사용 전에는 못하지만 사용 후에는 할 수 있게 되는 것을 적으세요.','“이 MVP는 고객이 ___할 수 있게 해준다”라는 문장을 완성하세요.','가치가 전달됐는지 확인할 행동이나 반응 신호를 적으세요.']::text[],
      array['Core Value 1문장','사용 전과 사용 후','가치 전달 여부를 볼 신호 1~2개']::text[],array['핵심 가치를 한 문장으로 정했어요.','확인할 행동 신호를 적었어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',20,'DESIGN','고객이 처음부터 결과까지 가는 흐름을 그리세요','좋은 기능도 흐름이 끊기면 사용되지 않습니다. 고객이 처음 들어와 핵심 가치를 얻기까지의 최소 경로를 그리세요.',
      '고객이 링크, 앱, 메시지 등 어디에서 처음 진입하는지 정하세요.
입력, 핵심 기능, 결과처럼 꼭 필요한 단계만 순서대로 연결하세요.
가입, 입력, 결제, 설명 등 이탈할 가능성이 높은 곳을 표시하세요.','처음부터 결과까지 한 흐름으로 연결했어요.
불필요한 단계를 줄였어요.',array['고객이 링크, 앱, 메시지 등 어디에서 처음 진입하는지 정하세요.','입력, 핵심 기능, 결과처럼 꼭 필요한 단계만 순서대로 연결하세요.','가입, 입력, 결제, 설명 등 이탈할 가능성이 높은 곳을 표시하세요.']::text[],
      array['최소 User Flow 1개','핵심 화면과 단계 목록','예상 이탈 지점 1~3개']::text[],array['처음부터 결과까지 한 흐름으로 연결했어요.','불필요한 단계를 줄였어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',21,'DESIGN','MVP에서 뺄 기능을 결정하세요','MVP는 핵심 가설을 검증할 만큼만 만든 제품입니다. 넣는 것보다 빼는 데 집중하세요.',
      '지금 떠오르는 기능을 제한 없이 한 번 적으세요.
Must, Later, Delete로 나누고 핵심 가치에 꼭 필요한 것만 Must로 남기세요.
이 기능이 없으면 핵심 테스트가 불가능한지 물어 Must를 한 번 더 줄이세요.','Must-have를 최소화했어요.
나중으로 미룰 기능을 명확히 했어요.',array['지금 떠오르는 기능을 제한 없이 한 번 적으세요.','Must, Later, Delete로 나누고 핵심 가치에 꼭 필요한 것만 Must로 남기세요.','이 기능이 없으면 핵심 테스트가 불가능한지 물어 Must를 한 번 더 줄이세요.']::text[],
      array['Must-have 기능 목록','Later 기능 목록','이번 MVP에서 버릴 기능 목록']::text[],array['Must-have를 최소화했어요.','나중으로 미룰 기능을 명확히 했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',22,'DESIGN','첫 수익모델과 가격 가설을 정하세요','무료 MVP라도 고객이 어디에서 돈을 낼 수 있는지 생각해야 합니다. 완벽한 가격표보다 첫 수익 가설을 만드세요.',
      '진단, 구독, 거래, 추가 기능, 컨설팅 등 고객 가치가 가장 커지는 순간을 찾으세요.
나중으로 미루지 말고 현재의 가설 가격을 숫자로 적으세요.
구매 의향, 선결제, 대기 목록, 예약 같은 행동으로 확인할 방법을 정하세요.','돈을 내는 지점을 정했어요.
가격을 숫자로 적었어요.',array['진단, 구독, 거래, 추가 기능, 컨설팅 등 고객 가치가 가장 커지는 순간을 찾으세요.','나중으로 미루지 말고 현재의 가설 가격을 숫자로 적으세요.','구매 의향, 선결제, 대기 목록, 예약 같은 행동으로 확인할 방법을 정하세요.']::text[],
      array['수익모델 1개','가격 가설','가격 또는 구매 의향을 확인할 행동 테스트']::text[],array['돈을 내는 지점을 정했어요.','가격을 숫자로 적었어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',23,'DESIGN','MVP 설계도를 한 장으로 완성하세요','제작을 시작하기 전 만들 범위와 순서를 한 장으로 정리하세요. 개발 중 범위 확장을 막아주는 기준표입니다.',
      'DAY 20 흐름을 기준으로 필요한 화면, 콘텐츠, 기능을 적으세요.
핵심 기능, 전체 연결, 실제 사용 준비 순서로 우선순위를 매기세요.
외부 사용자가 혼자 결과까지 도달하는 것처럼 출시 가능한 상태를 정의하세요.','MVP 범위가 한 장에 정리됐어요.
제작 순서와 완료 조건이 있어요.',array['DAY 20 흐름을 기준으로 필요한 화면, 콘텐츠, 기능을 적으세요.','핵심 기능, 전체 연결, 실제 사용 준비 순서로 우선순위를 매기세요.','외부 사용자가 혼자 결과까지 도달하는 것처럼 출시 가능한 상태를 정의하세요.']::text[],
      array['MVP Spec 1장','화면과 기능 목록','제작 순서','MVP 완성 조건']::text[],array['MVP 범위가 한 장에 정리됐어요.','제작 순서와 완료 조건이 있어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',24,'BUILD','MVP의 뼈대를 만드세요','완성도보다 작동하는 구조를 만드세요. 예쁘게 다듬기 전에 핵심 플로우가 들어갈 골격부터 만듭니다.',
      '웹, 앱, 노션, 폼, AI, 수작업 중 MVP를 가장 빨리 구현할 도구를 선택하세요.
첫 화면, 입력, 핵심 결과처럼 사용자 흐름의 큰 뼈대를 먼저 만드세요.
세부 내용이 비어 있어도 화면과 단계가 이동되도록 구조부터 연결하세요.','사용 흐름의 뼈대를 만들었어요.
핵심 단계들이 연결되기 시작했어요.',array['웹, 앱, 노션, 폼, AI, 수작업 중 MVP를 가장 빨리 구현할 도구를 선택하세요.','첫 화면, 입력, 핵심 결과처럼 사용자 흐름의 큰 뼈대를 먼저 만드세요.','세부 내용이 비어 있어도 화면과 단계가 이동되도록 구조부터 연결하세요.']::text[],
      array['MVP v0.1 화면 또는 링크','핵심 화면과 단계의 기본 구조']::text[],array['사용 흐름의 뼈대를 만들었어요.','핵심 단계들이 연결되기 시작했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',25,'BUILD','가장 중요한 핵심 기능을 작동시키세요','MVP의 가치는 핵심 기능 하나에서 시작됩니다. 고객이 필요하다고 느낄 핵심 경험을 먼저 작동시키세요.',
      'DAY 19의 Core Value를 가장 직접적으로 전달하는 기능 하나를 고르세요.
입력하면 결과가 나오거나 사용자가 핵심 행동을 끝낼 수 있게 만드세요.
서로 다른 입력이나 상황으로 직접 3번 테스트하고 실패를 기록하세요.','핵심 기능이 실제로 작동해요.
3번 이상 직접 테스트했어요.',array['DAY 19의 Core Value를 가장 직접적으로 전달하는 기능 하나를 고르세요.','입력하면 결과가 나오거나 사용자가 핵심 행동을 끝낼 수 있게 만드세요.','서로 다른 입력이나 상황으로 직접 3번 테스트하고 실패를 기록하세요.']::text[],
      array['작동하는 핵심 기능','자체 테스트 3회 결과','발견한 오류와 불편 목록']::text[],array['핵심 기능이 실제로 작동해요.','3번 이상 직접 테스트했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',26,'BUILD','처음부터 끝까지 한 번에 사용할 수 있게 연결하세요','부분 기능이 동작해도 사용자가 혼자 끝까지 갈 수 없다면 아직 제품이 아닙니다. End-to-End 흐름을 완성하세요.',
      '처음 방문한 사용자처럼 링크나 첫 화면에서 시작하세요.
버튼, 입력, 결과, 다음 행동이 자연스럽게 이어지도록 중간 끊김을 없애세요.
자동화가 오래 걸리면 운영자가 수동 처리하더라도 사용자는 끝까지 경험하게 만드세요.','처음부터 결과까지 한 번에 진행할 수 있어요.
필요한 곳은 수작업으로라도 연결했어요.',array['처음 방문한 사용자처럼 링크나 첫 화면에서 시작하세요.','버튼, 입력, 결과, 다음 행동이 자연스럽게 이어지도록 중간 끊김을 없애세요.','자동화가 오래 걸리면 운영자가 수동 처리하더라도 사용자는 끝까지 경험하게 만드세요.']::text[],
      array['End-to-End 가능한 MVP 링크 또는 화면','중간 끊김 수정 내역']::text[],array['처음부터 결과까지 한 번에 진행할 수 있어요.','필요한 곳은 수작업으로라도 연결했어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',27,'BUILD','외부 고객이 혼자 쓸 수 있게 준비하세요','내가 옆에서 설명해야만 사용할 수 있다면 아직 테스트하기 어렵습니다. 처음 보는 사람도 혼자 쓸 수 있게 만드세요.',
      '무엇을 하는 서비스이고 무엇을 얻는지 첫 화면에서 바로 이해되게 적으세요.
입력 방법, CTA, 완료 후 다음 행동처럼 막힐 부분에 짧은 안내를 넣으세요.
문의, 피드백, 대기 목록, 신청 등 다음 행동 경로를 하나 이상 만드세요.','처음 보는 사람이 무엇을 해야 하는지 알 수 있어요.
다음 행동 경로가 있어요.',array['무엇을 하는 서비스이고 무엇을 얻는지 첫 화면에서 바로 이해되게 적으세요.','입력 방법, CTA, 완료 후 다음 행동처럼 막힐 부분에 짧은 안내를 넣으세요.','문의, 피드백, 대기 목록, 신청 등 다음 행동 경로를 하나 이상 만드세요.']::text[],
      array['MVP v0.8','첫 화면 핵심 카피','문의, 신청, 구매 등 다음 행동 경로']::text[],array['처음 보는 사람이 무엇을 해야 하는지 알 수 있어요.','다음 행동 경로가 있어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',28,'BUILD','실제 사용자 3명에게 써보게 하세요','설명하지 말고 관찰하세요. 칭찬보다 사용자가 어디에서 멈추는지 발견하는 것이 목표입니다.',
      '가능하면 핵심 고객에 가까운 사용자 3명에게 직접 사용을 요청하세요.
제품만 주고 처음부터 끝까지 사용하게 하며 질문받기 전에는 개입하지 마세요.
멈춘 화면, 이해하지 못한 문구, 예상과 다른 행동을 기록하세요.','3명 이상이 직접 사용했어요.
설명보다 관찰을 우선했어요.',array['가능하면 핵심 고객에 가까운 사용자 3명에게 직접 사용을 요청하세요.','제품만 주고 처음부터 끝까지 사용하게 하며 질문받기 전에는 개입하지 마세요.','멈춘 화면, 이해하지 못한 문구, 예상과 다른 행동을 기록하세요.']::text[],
      array['사용 테스트 3명 이상','막힌 지점 목록','수정이 필요한 Top 3']::text[],array['3명 이상이 직접 사용했어요.','설명보다 관찰을 우선했어요.']::text[],'테스트 참여자의 얼굴, 이름, 연락처, 계정과 입력 내용을 가린 기록만 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',29,'BUILD','출시를 막는 문제만 고치세요','출시 직전에는 새 기능을 추가하고 싶어집니다. 완벽함보다 출시를 방해하는 문제만 고치세요.',
      '문제를 출시 불가, 불편하지만 사용 가능, 나중에 개선의 세 등급으로 나누세요.
핵심 기능 오류, 이해 불가, 진행 막힘처럼 사용을 방해하는 문제부터 수정하세요.
좋은 새 아이디어는 Later 목록에 넣고 오늘은 만들지 마세요.','출시를 막는 이슈를 우선 수정했어요.
새 기능 추가를 멈췄어요.',array['문제를 출시 불가, 불편하지만 사용 가능, 나중에 개선의 세 등급으로 나누세요.','핵심 기능 오류, 이해 불가, 진행 막힘처럼 사용을 방해하는 문제부터 수정하세요.','좋은 새 아이디어는 Later 목록에 넣고 오늘은 만들지 마세요.']::text[],
      array['출시 차단 이슈 수정 내역','Later 목록','Release Candidate 버전']::text[],array['출시를 막는 이슈를 우선 수정했어요.','새 기능 추가를 멈췄어요.']::text[],'개인정보가 보이지 않도록 정리한 뒤, 결과물이 화면에 읽히도록 앱 카메라로 촬영해 인증해 주세요.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',30,'LAUNCH','MVP를 실제 세상에 공개하세요','준비가 끝나는 날이 아니라 실제 시장 테스트가 시작되는 날입니다. 외부 사람이 접근할 수 있는 곳에 공개하세요.',
      'SNS, 커뮤니티, 지인 고객, 오픈채팅, 뉴스레터 중 핵심 고객이 볼 채널을 고르세요.
누구를 위한 무엇이고 어떤 문제를 해결하며 무엇을 해달라는지 짧게 쓰세요.
초안으로 두지 말고 링크를 공개해 사용, 신청 또는 구매가 가능하게 만드세요.','외부 사람이 실제로 접근할 수 있어요.
출시 메시지를 실제로 게시했어요.',array['SNS, 커뮤니티, 지인 고객, 오픈채팅, 뉴스레터 중 핵심 고객이 볼 채널을 고르세요.','누구를 위한 무엇이고 어떤 문제를 해결하며 무엇을 해달라는지 짧게 쓰세요.','초안으로 두지 말고 링크를 공개해 사용, 신청 또는 구매가 가능하게 만드세요.']::text[],
      array['공개된 MVP URL 또는 접근 경로','실제로 게시한 출시 글 또는 메시지','첫 행동 요청']::text[],array['외부 사람이 실제로 접근할 수 있어요.','출시 메시지를 실제로 게시했어요.']::text[],'공개 게시물과 MVP 화면을 앱 카메라로 촬영해 인증해 주세요. URL 원문은 별도의 Final Submission 절차에서 제출합니다.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
insert into public.missions
    (challenge_id,day,phase,title,purpose,guide,completion_criteria,steps,submission_items,completion_criteria_items,proof_guide,content_version)
    values ('10000000-0000-4000-8000-000000000001',31,'LAUNCH','첫 반응을 기록하고 31일을 마무리하세요','출시는 끝이 아니라 다음 실험의 시작입니다. 숫자의 크기보다 어떤 반응이 실제로 일어났는지 기록하세요.',
      '방문, 가입, 신청, 구매, 댓글, DM, 사용 완료 등 확인 가능한 첫 반응을 적으세요.
DAY 4 가설을 맞았던 것, 틀렸던 것, 아직 모르는 것으로 나누세요.
계속 키울지, 바꿀지, 멈출지와 다음 핵심 실험 하나를 정하세요.','최종 MVP를 제출했어요.
실제 시장 반응을 기록했어요.
다음 행동을 하나 정했어요.',array['방문, 가입, 신청, 구매, 댓글, DM, 사용 완료 등 확인 가능한 첫 반응을 적으세요.','DAY 4 가설을 맞았던 것, 틀렸던 것, 아직 모르는 것으로 나누세요.','계속 키울지, 바꿀지, 멈출지와 다음 핵심 실험 하나를 정하세요.']::text[],
      array['최종 MVP 링크 또는 결과물','출시 후 첫 반응','31일 회고: 배운 점 3개','다음 핵심 실험 1개']::text[],array['최종 MVP를 제출했어요.','실제 시장 반응을 기록했어요.','다음 행동을 하나 정했어요.']::text[],'개인정보와 비공개 지표를 가린 최종 MVP와 회고 화면을 앱 카메라로 촬영해 인증해 주세요. 최종 URL은 별도의 Final Submission 절차에서 제출합니다.','mission-2026-09-21')
    on conflict (challenge_id,day) do update set phase=excluded.phase,title=excluded.title,
      purpose=excluded.purpose,guide=excluded.guide,completion_criteria=excluded.completion_criteria,
      steps=excluded.steps,submission_items=excluded.submission_items,
      completion_criteria_items=excluded.completion_criteria_items,proof_guide=excluded.proof_guide,
      content_version=excluded.content_version;
commit;
