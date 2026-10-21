alter table public.linkedin_posts add column if not exists media_paths text[] not null default '{}';
update public.linkedin_posts set media_paths = array[image_path] where image_path is not null and cardinality(media_paths) = 0;
