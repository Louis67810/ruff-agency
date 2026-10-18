alter table public.saas_brief_responses add column if not exists attribution jsonb;

-- Recover only sources proven by the same visitor/session as the form visit.
-- Unmatched historical briefs remain unknown rather than being called untagged.
with attributed as (
  select b.id, jsonb_build_object(
    'path', p.path,
    'utm', jsonb_strip_nulls(jsonb_build_object(
      'utm_source', nullif(f.metadata->>'utmSource', ''),
      'utm_medium', nullif(f.metadata->>'utmMedium', ''),
      'utm_campaign', nullif(nullif(coalesce(f.metadata->>'utmCampaign', f.metadata->>'campaign'), 'None'), ''),
      'utm_content', nullif(f.metadata->>'utmContent', ''),
      'utm_term', nullif(f.metadata->>'utmTerm', '')
    ))
  ) as attribution
  from public.saas_brief_responses b
  join lateral (
    select e.session_id, e.created_at, e.metadata
    from public.saas_analytics_events e
    where e.visitor_id = b.visitor_id and e.event_type = 'page_view'
      and e.path ~ '/saas-redesign/brief/?$'
      and e.created_at between b.started_at - interval '2 minutes' and b.started_at + interval '2 minutes'
    order by abs(extract(epoch from e.created_at - b.started_at)) limit 1
  ) f on true
  join lateral (
    select e.path from public.saas_analytics_events e
    where e.visitor_id = b.visitor_id and e.session_id = f.session_id
      and e.event_type = 'page_view' and e.path !~ '/saas-redesign/brief/?$'
      and e.created_at <= f.created_at
    order by e.created_at desc limit 1
  ) p on true
  where b.attribution is null
)
update public.saas_brief_responses b set attribution = a.attribution
from attributed a where a.id = b.id;
