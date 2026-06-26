alter table notes add column if not exists expires_at timestamptz;

create index if not exists notes_expires_at_idx on notes (expires_at)
  where expires_at is not null;

create or replace function set_anonymous_note_expiry()
returns trigger
language plpgsql
as $$
begin
  if new.author_id is null then
    new.expires_at := now() + interval '90 days';
  end if;
  return new;
end;
$$;

drop trigger if exists notes_set_anonymous_expiry on notes;

create trigger notes_set_anonymous_expiry
  before insert on notes
  for each row
  execute function set_anonymous_note_expiry();

drop policy if exists "notes_select_public" on notes;

create policy "notes_select_public"
  on notes for select
  using (expires_at is null or expires_at > now());

create or replace function is_note_expired(p_slug text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from notes
    where slug = p_slug
      and expires_at is not null
      and expires_at <= now()
  );
$$;

grant execute on function is_note_expired(text) to anon, authenticated;
