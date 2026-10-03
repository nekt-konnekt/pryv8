create table if not exists public.validation_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  side text not null check (side in ('user','creator')),
  answers jsonb not null default '{}'::jsonb,
  email text not null,
  whatsapp text not null,
  source text not null default 'direct',
  age_confirmed boolean not null default false
);

alter table public.validation_responses enable row level security;

drop policy if exists "public can submit validation responses" on public.validation_responses;
create policy "public can submit validation responses"
on public.validation_responses
for insert
to anon
with check (
  age_confirmed = true
  and length(email) between 5 and 320
  and length(whatsapp) between 7 and 32
);

revoke select, update, delete on public.validation_responses from anon, authenticated;
grant insert on public.validation_responses to anon;