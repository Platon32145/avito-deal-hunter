-- Avito Deal Hunter — initial schema
-- Run in Supabase SQL Editor. Every exposed table has RLS enabled.

create extension if not exists pgcrypto;

create table if not exists public.monitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 100),
  query text not null check (char_length(query) between 2 and 300),
  region text not null default 'Москва',
  max_price numeric(12,2) check (max_price is null or max_price > 0),
  min_discount_percent numeric(5,2) not null default 15 check (min_discount_percent between 0 and 95),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  monitor_id uuid references public.monitors(id) on delete set null,
  source text not null,
  external_id text not null,
  title text not null,
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'RUB',
  region text,
  url text not null,
  image_url text,
  discount_percent numeric(5,2),
  published_at timestamptz,
  first_seen_at timestamptz not null default now(),
  is_favorite boolean not null default false,
  unique (user_id, source, external_id)
);

create table if not exists public.price_observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  price numeric(12,2) not null check (price >= 0),
  observed_at timestamptz not null default now()
);

create table if not exists public.telegram_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  chat_id text,
  is_enabled boolean not null default false,
  notify_new_matches boolean not null default true,
  min_discount_percent numeric(5,2) not null default 20 check (min_discount_percent between 0 and 95),
  updated_at timestamptz not null default now()
);

create index if not exists monitors_user_active_idx on public.monitors(user_id, is_active);
create index if not exists listings_user_seen_idx on public.listings(user_id, first_seen_at desc);
create index if not exists listings_user_price_idx on public.listings(user_id, price);
create index if not exists price_observations_listing_time_idx on public.price_observations(listing_id, observed_at desc);

alter table public.monitors enable row level security;
alter table public.listings enable row level security;
alter table public.price_observations enable row level security;
alter table public.telegram_settings enable row level security;

grant select, insert, update, delete on public.monitors to authenticated;
grant select, insert, update, delete on public.listings to authenticated;
grant select, insert, update, delete on public.price_observations to authenticated;
grant select, insert, update, delete on public.telegram_settings to authenticated;

create policy "owner manages monitors" on public.monitors
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "owner manages listings" on public.listings
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "owner manages price observations" on public.price_observations
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "owner manages telegram settings" on public.telegram_settings
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
