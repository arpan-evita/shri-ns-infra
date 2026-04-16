-- Create project_submissions table to store developer form submissions
create table if not exists public.project_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  reference_id text unique,
  status text default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected')),

  -- Key fields (for quick filtering)
  project_name text,
  developer_name text,
  property_type text,
  listing_status text,
  city text,
  state text,
  contact_name text,
  contact_phone text,
  contact_email text,

  -- All form data stored as JSONB
  form_data jsonb not null default '{}'
);

-- Allow public inserts (form submissions)
alter table public.project_submissions enable row level security;

create policy "Anyone can submit a project"
  on public.project_submissions
  for insert
  to public, anon, authenticated
  with check (true);

create policy "Only authenticated admins can read submissions"
  on public.project_submissions
  for select
  to authenticated
  using (true);

create policy "Only authenticated admins can update submissions"
  on public.project_submissions
  for update
  to authenticated
  using (true);

-- Index for fast filtering
create index if not exists project_submissions_status_idx on public.project_submissions (status);
create index if not exists project_submissions_created_at_idx on public.project_submissions (created_at desc);
