alter table profiles
  add column if not exists locale_preference text not null default 'system'
    check (locale_preference in ('system', 'en', 'ru'));
