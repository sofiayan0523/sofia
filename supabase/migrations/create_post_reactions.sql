-- Create a table for tracking post reactions
create table if not exists public.post_reactions (
  slug text primary key,
  claps integer default 0 not null,
  loves integer default 0 not null,
  insights integer default 0 not null,
  amazes integer default 0 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.post_reactions enable row level security;

-- Policy: Allow public read access (everyone can view reaction counts)
create policy "Allow public read access" on public.post_reactions
  for select using (true);

-- Create a stored procedure (RPC) to atomically increment reaction counts.
-- It is defined as SECURITY DEFINER so that anonymous public users can increment counts
-- safely without having direct write access to the table itself.
create or replace function public.increment_post_reaction(post_slug text, reaction_col text)
returns void as $$
begin
  if reaction_col not in ('claps', 'loves', 'insights', 'amazes') then
    raise exception 'Invalid reaction column name';
  end if;

  insert into public.post_reactions (slug, claps, loves, insights, amazes, updated_at)
  values (
    post_slug,
    case when reaction_col = 'claps' then 1 else 0 end,
    case when reaction_col = 'loves' then 1 else 0 end,
    case when reaction_col = 'insights' then 1 else 0 end,
    case when reaction_col = 'amazes' then 1 else 0 end,
    now()
  )
  on conflict (slug) do update set
    claps = public.post_reactions.claps + (case when reaction_col = 'claps' then 1 else 0 end),
    loves = public.post_reactions.loves + (case when reaction_col = 'loves' then 1 else 0 end),
    insights = public.post_reactions.insights + (case when reaction_col = 'insights' then 1 else 0 end),
    amazes = public.post_reactions.amazes + (case when reaction_col = 'amazes' then 1 else 0 end),
    updated_at = now();
end;
$$ language plpgsql security definer;
