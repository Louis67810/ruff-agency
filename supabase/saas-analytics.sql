create table if not exists public.saas_analytics_events (
  id uuid primary key,
  created_at timestamptz not null default now(),
  event_type text not null check (event_type in (
    'page_view', 'section_view', 'section_time', 'cta_click', 'vote',
    'before_after_interaction', 'conversion', 'site_navigation', 'session_end',
    'scroll_depth', 'scroll_zone', 'heartbeat'
  )),
  visitor_id text not null,
  session_id text not null,
  section_id text,
  country_code text not null default 'XX' check (char_length(country_code) = 2),
  path text not null,
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  value numeric,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.saas_analytics_events drop constraint if exists saas_analytics_events_event_type_check;
alter table public.saas_analytics_events add constraint saas_analytics_events_event_type_check
  check (event_type in (
    'page_view', 'section_view', 'section_time', 'cta_click', 'vote',
    'before_after_interaction', 'conversion', 'site_navigation', 'session_end',
    'scroll_depth', 'scroll_zone', 'heartbeat'
  ));

alter table public.saas_analytics_events enable row level security;
revoke all on table public.saas_analytics_events from anon, authenticated;
grant select, insert, update, delete on table public.saas_analytics_events to service_role;

drop policy if exists "deny public analytics reads" on public.saas_analytics_events;
drop policy if exists "deny public analytics inserts" on public.saas_analytics_events;
drop policy if exists "deny public analytics updates" on public.saas_analytics_events;
drop policy if exists "deny public analytics deletes" on public.saas_analytics_events;
create policy "deny public analytics reads"
  on public.saas_analytics_events for select to anon, authenticated
  using (false);
create policy "deny public analytics inserts"
  on public.saas_analytics_events for insert to anon, authenticated
  with check (false);
create policy "deny public analytics updates"
  on public.saas_analytics_events for update to anon, authenticated
  using (false) with check (false);
create policy "deny public analytics deletes"
  on public.saas_analytics_events for delete to anon, authenticated
  using (false);

create index if not exists saas_analytics_events_created_at_idx
  on public.saas_analytics_events (created_at desc);
create index if not exists saas_analytics_events_type_created_idx
  on public.saas_analytics_events (event_type, created_at desc);
create index if not exists saas_analytics_events_section_created_idx
  on public.saas_analytics_events (section_id, created_at desc)
  where section_id is not null;
create index if not exists saas_analytics_events_session_idx
  on public.saas_analytics_events (session_id);

create table if not exists public.saas_tweets (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9_-]{1,79}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  handle text not null check (char_length(handle) between 1 and 100),
  copy text not null check (char_length(copy) between 1 and 500),
  href text not null check (href ~ '^https://(x[.]com|twitter[.]com)/'),
  accent text not null default '#d9f0ff' check (accent ~ '^#[0-9a-fA-F]{6}$'),
  position integer not null default 0 check (position >= 0),
  published boolean not null default true
);

alter table public.saas_tweets enable row level security;
revoke all on table public.saas_tweets from anon, authenticated;
grant select, insert, update, delete on table public.saas_tweets to service_role;

drop policy if exists "deny public tweet reads" on public.saas_tweets;
drop policy if exists "deny public tweet inserts" on public.saas_tweets;
drop policy if exists "deny public tweet updates" on public.saas_tweets;
drop policy if exists "deny public tweet deletes" on public.saas_tweets;
create policy "deny public tweet reads"
  on public.saas_tweets for select to anon, authenticated
  using (false);
create policy "deny public tweet inserts"
  on public.saas_tweets for insert to anon, authenticated
  with check (false);
create policy "deny public tweet updates"
  on public.saas_tweets for update to anon, authenticated
  using (false) with check (false);
create policy "deny public tweet deletes"
  on public.saas_tweets for delete to anon, authenticated
  using (false);

create index if not exists saas_tweets_published_position_idx
  on public.saas_tweets (published, position);

insert into public.saas_tweets
  (id, name, handle, copy, href, accent, position, published)
values
  ('damien-ai-generated', 'damien', '@damienghader', 'Never build a website that looks "AI generated" again.', 'https://x.com/damienghader/status/2062156647246475290', '#d9f0ff', 0, true),
  ('andrew-marketing-slop', 'andrew pignanelli', '@ndrewpignanelli', 'When your first impression is marketing slop, customers remember it.', 'https://x.com/ndrewpignanelli/status/2033926820605698262', '#ffe7ad', 1, true),
  ('aakash-code-quality', 'Aakash Gupta', '@aakashgupta', 'AI-generated products trade speed for code quality — and sometimes trust.', 'https://x.com/aakashgupta/status/2015298307690783021', '#e8ddff', 2, true),
  ('apoorva-business-trust', 'Apoorva Govind', '@Appyg99', 'Businesses buy software from vendors they can trust and rely on.', 'https://x.com/Appyg99/status/2025979690360635587', '#dff6d5', 3, true)
on conflict (id) do nothing;
