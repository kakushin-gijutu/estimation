-- 会社マスタテーブル
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  address text not null default '',
  tel text not null default '',
  fax text not null default '',
  email text not null default '',
  license text not null default '',
  representative_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at 自動更新トリガー
drop trigger if exists set_updated_at on public.companies;
create trigger set_updated_at
  before update on public.companies
  for each row
  execute function public.update_updated_at();

-- RLS
alter table public.companies enable row level security;
create policy "Allow all operations" on public.companies
  for all
  using (true)
  with check (true);

-- インデックス
create index if not exists idx_companies_name on public.companies (name);
