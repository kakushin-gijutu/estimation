-- 会社/個人の種別カラムを追加
alter table public.companies
  add column if not exists type text not null default 'company'
    check (type in ('company', 'individual'));

-- デフォルトデータ: 合同会社RHY
insert into public.companies (name, address, tel, fax, email, license, representative_name, type)
values (
  '合同会社RHY',
  '大阪府大阪市東成区深江北1-3-5三好ビル306',
  '',
  '',
  '',
  '大阪府知事(1)第65124号',
  '鯰江',
  'company'
)
on conflict do nothing;
