-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Groups table
create table public.groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  share_id text unique not null,
  fuel_efficiency numeric,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index on share_id for fast lookups
create index idx_groups_share_id on public.groups(share_id);

-- Members table
create table public.members (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references public.groups(id) on delete cascade,
  name text not null,
  joined_at timestamp with time zone default now()
);

-- Create index on group_id for fast lookups
create index idx_members_group_id on public.members(group_id);

-- Expenses table
create table public.expenses (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references public.groups(id) on delete cascade,
  amount integer not null check (amount >= 0),
  description text,
  category text not null,
  payer_member_id uuid references public.members(id) on delete restrict,
  paid_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create indexes for expenses
create index idx_expenses_group_id on public.expenses(group_id);
create index idx_expenses_payer_member_id on public.expenses(payer_member_id);

-- Enable Row Level Security
alter table public.groups enable row level security;
alter table public.members enable row level security;
alter table public.expenses enable row level security;

-- Create policies (for now, allow all access - to be refined later)
create policy "Groups are viewable by everyone" on public.groups
  for all using (true) with check (true);

create policy "Members are viewable by everyone" on public.members
  for all using (true) with check (true);

create policy "Expenses are viewable by everyone" on public.expenses
  for all using (true) with check (true);

-- Function to generate unique share_id
create or replace function generate_share_id()
returns text as $$
declare
  chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- Trigger to automatically generate share_id
create or replace function set_share_id()
returns trigger as $$
begin
  if new.share_id is null then
    new.share_id := generate_share_id();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger groups_set_share_id
  before insert on public.groups
  for each row
  execute function set_share_id();

-- Enable realtime for all tables
alter publication supabase_realtime add table public.groups;
alter publication supabase_realtime add table public.members;
alter publication supabase_realtime add table public.expenses;