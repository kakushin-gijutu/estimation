-- Supabase SQL Editor で実行してください

-- estimations テーブル作成
create table if not exists public.estimations (
  id uuid primary key default gen_random_uuid(),

  -- 顧客情報
  customer_name text not null default '',

  -- 仲介業者情報
  broker_name text not null default '',
  broker_company_name text not null default '',
  broker_tel text not null default '',
  broker_fax text not null default '',
  broker_email text not null default '',
  broker_address text not null default '',
  broker_license text not null default '',

  -- 物件情報
  property_name text not null default '',
  property_type text not null default '',
  creation_date text not null default '',
  expiration_date text not null default '',
  move_in_date text not null default '',
  contract_period text not null default '',
  contract_renewal_fee integer not null default 0,
  basic_rent integer not null default 0,
  management_fee integer not null default 0,
  parking_fee integer not null default 0,
  initial_guarantee_fee integer not null default 0,
  monthly_guarantee_fee integer not null default 0,

  -- 費用明細 (JSONB配列)
  costs jsonb not null default '[]'::jsonb,

  -- 備考
  remarks text not null default '',

  -- ステータス
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'accepted', 'rejected', 'expired')),

  -- 合計金額 (計算済みキャッシュ)
  initial_total integer not null default 0,
  monthly_total integer not null default 0,

  -- タイムスタンプ
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at を自動更新するトリガー
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.estimations;
create trigger set_updated_at
  before update on public.estimations
  for each row
  execute function public.update_updated_at();

-- RLS (Row Level Security) を有効化
alter table public.estimations enable row level security;

-- 全操作を許可するポリシー (認証なしで使う場合)
create policy "Allow all operations" on public.estimations
  for all
  using (true)
  with check (true);

-- インデックス
create index if not exists idx_estimations_status on public.estimations (status);
create index if not exists idx_estimations_customer_name on public.estimations (customer_name);
create index if not exists idx_estimations_updated_at on public.estimations (updated_at desc);
