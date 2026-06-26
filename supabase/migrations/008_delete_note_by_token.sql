create or replace function delete_note_by_token(
  p_slug text,
  p_edit_token text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count int;
begin
  delete from notes
  where slug = p_slug
    and edit_token = p_edit_token;

  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

grant execute on function delete_note_by_token(text, text) to anon, authenticated;
