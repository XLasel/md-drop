alter table notes add column if not exists indexable boolean not null default false;

-- Adding a parameter creates a new overload; drop the 4-arg version from 002 first.
drop function if exists public.update_note_by_token(text, text, text, text);

create or replace function update_note_by_token(
  p_slug text,
  p_edit_token text,
  p_content text,
  p_title text,
  p_indexable boolean default false
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count int;
begin
  update notes
  set
    content = p_content,
    title = p_title,
    indexable = p_indexable,
    updated_at = now()
  where slug = p_slug
    and edit_token = p_edit_token;

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

grant execute on function update_note_by_token(text, text, text, text, boolean) to anon, authenticated;
