-- Private shared LinkedIn workspace, separate from the existing analytics data.
create table public.linkedin_categories (
  name text primary key check (char_length(name) between 1 and 60),
  created_at timestamptz not null default now()
);
create unique index linkedin_categories_lower_name on public.linkedin_categories (lower(name));

create table public.linkedin_posts (
  id text primary key default gen_random_uuid()::text check (id ~ '^[a-zA-Z0-9_-]{1,100}$'),
  title text not null check (char_length(title) between 1 and 120),
  body text not null default '' check (char_length(body) <= 50000),
  category text references public.linkedin_categories(name) on update cascade on delete set null,
  tags text[] not null default '{}' check (cardinality(tags) <= 30),
  publication_date date,
  image_path text check (image_path is null or image_path ~ '^[a-f0-9-]{36}\.(png|jpg|webp|gif)$'),
  stage text not null default '' check (stage in ('', 'À explorer', 'En cours', 'Prêtes à publier')),
  x double precision, y double precision,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index linkedin_posts_created_id on public.linkedin_posts(created_at desc, id desc);
create index linkedin_posts_publication_date on public.linkedin_posts(publication_date);
create index linkedin_posts_updated_at on public.linkedin_posts(updated_at);
create index linkedin_posts_category on public.linkedin_posts(category);

create table public.linkedin_api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  prefix text not null,
  token_hash text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
  scopes text[] not null default '{posts:read,posts:write}' check (scopes <@ array['posts:read','posts:write']::text[]),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

alter table public.linkedin_categories enable row level security;
alter table public.linkedin_posts enable row level security;
alter table public.linkedin_api_keys enable row level security;
revoke all on public.linkedin_categories, public.linkedin_posts, public.linkedin_api_keys from public, anon, authenticated;
grant all on public.linkedin_categories, public.linkedin_posts, public.linkedin_api_keys to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('linkedin-media', 'linkedin-media', false, 3145728, array['image/jpeg','image/png','image/webp','image/gif']);
-- No public Storage policies: only the authenticated application server serves media.
