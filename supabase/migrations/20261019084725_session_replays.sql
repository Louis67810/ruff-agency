create table public.saas_session_replays (
  id uuid primary key,
  visitor_id text not null,
  session_id text not null,
  path text not null,
  token_hash text not null,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  event_count integer not null default 0,
  byte_count integer not null default 0
);
create index saas_replays_visitor_started on public.saas_session_replays(visitor_id, started_at desc);
create index saas_replays_expiry on public.saas_session_replays(expires_at);
create table public.saas_replay_chunks (
  replay_id uuid not null references public.saas_session_replays(id) on delete cascade,
  sequence integer not null check (sequence between 0 and 500),
  events jsonb not null check (jsonb_typeof(events) = 'array'),
  primary key(replay_id, sequence)
);
alter table public.saas_session_replays enable row level security;
alter table public.saas_replay_chunks enable row level security;
revoke all on public.saas_session_replays, public.saas_replay_chunks from anon, authenticated;
grant select, insert, update, delete on public.saas_session_replays, public.saas_replay_chunks to service_role;
-- No public policies: recordings are accessible only through the authenticated server API.
create function public.save_saas_replay_chunk(p_id uuid, p_visitor text, p_session text, p_path text, p_token text, p_sequence integer, p_events jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
declare recording public.saas_session_replays; size_bytes integer; next_sequence integer;
begin
  size_bytes := octet_length(p_events::text);
  if jsonb_typeof(p_events) <> 'array' or jsonb_array_length(p_events) not between 1 and 3000 or size_bytes > 2000000 then raise exception 'Invalid replay chunk'; end if;
  if p_sequence = 0 then
    insert into public.saas_session_replays(id,visitor_id,session_id,path,token_hash)
      values(p_id,p_visitor,p_session,p_path,p_token) on conflict(id) do nothing;
  end if;
  select * into recording from public.saas_session_replays where id=p_id for update;
  if not found or recording.token_hash <> p_token or recording.visitor_id <> p_visitor or recording.session_id <> p_session or recording.path <> p_path then raise exception 'Invalid recording owner'; end if;
  if recording.expires_at <= now() or recording.started_at < now() - interval '30 minutes' then raise exception 'Recording expired'; end if;
  if exists(select 1 from public.saas_replay_chunks where replay_id=p_id and sequence=p_sequence) then return; end if;
  select coalesce(max(sequence)+1,0) into next_sequence from public.saas_replay_chunks where replay_id=p_id;
  if p_sequence <> next_sequence or recording.byte_count+size_bytes > 20000000 then raise exception 'Recording limit reached'; end if;
  insert into public.saas_replay_chunks values(p_id,p_sequence,p_events);
  update public.saas_session_replays set updated_at=now(), event_count=event_count+jsonb_array_length(p_events), byte_count=byte_count+size_bytes where id=p_id;
end;
$$;
revoke all on function public.save_saas_replay_chunk(uuid,text,text,text,text,integer,jsonb) from public, anon, authenticated;
grant execute on function public.save_saas_replay_chunk(uuid,text,text,text,text,integer,jsonb) to service_role;
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('ruff-replay-retention', '17 * * * *', $$delete from public.saas_session_replays where expires_at < now()$$);
