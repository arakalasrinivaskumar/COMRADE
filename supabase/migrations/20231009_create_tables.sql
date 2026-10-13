// supabase/migrations/20231009_create_tables.sql
-- Create table for joining COMRADE
create table public.join_comrade (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null unique,
  created_at timestamp with time zone default now()
);

-- Create table for contact messages
create table public.contact (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);
