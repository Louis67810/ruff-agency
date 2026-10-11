create table if not exists public.saas_brief_responses (
  id uuid primary key,
  edit_token_hash text not null check (edit_token_hash ~ '^[0-9a-f]{64}$'),
  visitor_id text not null check (char_length(visitor_id) between 8 and 80),
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  revision integer not null default 0 check (revision >= 0),
  last_step smallint not null default 0 check (last_step between 0 and 5),
  website text not null default '' check (char_length(website) <= 500),
  email text not null default '' check (char_length(email) <= 254),
  mrr text not null default '' check (mrr in ('', '<5k', '5–10k', '10–30k', '30k+')),
  changes text[] not null default '{}',
  details text not null default '' check (char_length(details) <= 800),
  duration_ms integer not null default 0 check (duration_ms between 0 and 86400000)
);

alter table public.saas_brief_responses enable row level security;
revoke all on table public.saas_brief_responses from anon, authenticated;
grant select, insert, update on table public.saas_brief_responses to service_role;

create policy "deny public brief reads"
  on public.saas_brief_responses for select to anon, authenticated
  using (false);
create policy "deny public brief inserts"
  on public.saas_brief_responses for insert to anon, authenticated
  with check (false);
create policy "deny public brief updates"
  on public.saas_brief_responses for update to anon, authenticated
  using (false) with check (false);
create policy "deny public brief deletes"
  on public.saas_brief_responses for delete to anon, authenticated
  using (false);

create index if not exists saas_brief_responses_started_at_idx
  on public.saas_brief_responses (started_at desc);
create index if not exists saas_brief_responses_visitor_idx
  on public.saas_brief_responses (visitor_id, started_at desc);
create index if not exists saas_brief_responses_status_idx
  on public.saas_brief_responses (completed_at, started_at desc);
