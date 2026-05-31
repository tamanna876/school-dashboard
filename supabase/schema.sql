create extension if not exists pgcrypto;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  progress integer not null check (progress >= 0 and progress <= 100),
  icon_name text not null,
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;

drop policy if exists "Allow public read access" on public.courses;

create policy "Allow public read access"
on public.courses
for select
to anon
using (true);

insert into public.courses (title, progress, icon_name, created_at) values
  ('Advanced React Patterns', 75, 'Code', now() - interval '10 days'),
  ('Next.js App Router', 40, 'Layers', now() - interval '8 days'),
  ('TypeScript Mastery', 90, 'FileCode', now() - interval '6 days'),
  ('Tailwind CSS Pro', 55, 'Paintbrush', now() - interval '3 days')
on conflict do nothing;