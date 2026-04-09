create table if not exists servers (
  id uuid primary key default gen_random_uuid(),
  name text,
  ip text,
  created_at timestamp default now()
);

create table if not exists metrics (
  id bigint generated always as identity primary key,
  server_id uuid,
  cpu_usage float,
  memory_usage float,
  disk_usage float,
  created_at timestamp default now()
);

create table if not exists containers (
  id bigint generated always as identity primary key,
  server_id uuid,
  container_name text,
  status text,
  created_at timestamp default now()
);

create table if not exists alerts (
  id bigint generated always as identity primary key,
  server_id uuid,
  type text,
  message text,
  created_at timestamp default now()
);