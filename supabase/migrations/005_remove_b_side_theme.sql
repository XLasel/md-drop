-- Migrate removed b-side preference to dark
update profiles
set theme_preference = 'dark'
where theme_preference = 'b-side';

alter table profiles
  drop constraint profiles_theme_preference_check;

alter table profiles
  add constraint profiles_theme_preference_check
    check (theme_preference in ('system', 'light', 'dark'));
