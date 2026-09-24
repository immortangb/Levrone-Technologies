-- Run this in Supabase: SQL Editor > New query > Run
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 100),
  email text not null check (char_length(email) <= 200),
  phone text check (char_length(phone) <= 30),
  service text check (char_length(service) <= 100),
  message text check (char_length(message) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

-- Visitors can send an enquiry, but cannot read anyone's enquiries.
-- You read them in the Supabase dashboard (Table Editor).
create policy "Anyone can send an enquiry"
  on public.enquiries for insert to anon with check (true);
