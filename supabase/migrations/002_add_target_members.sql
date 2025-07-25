-- Add target_member_ids column to expenses table
alter table public.expenses 
add column target_member_ids uuid[] not null default '{}';

-- Create index for better performance
create index idx_expenses_target_member_ids on public.expenses using gin(target_member_ids);・