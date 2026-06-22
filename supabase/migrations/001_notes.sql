create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  content text not null,
  theme text not null default 'github',
  author_id uuid references auth.users(id) on delete set null,
  edit_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_slug_idx on notes (slug);
create index if not exists notes_author_id_idx on notes (author_id);

alter table notes enable row level security;

create policy "notes_select_public"
  on notes for select
  using (true);

create policy "notes_insert_public"
  on notes for insert
  with check (true);

create policy "notes_update_owner"
  on notes for update
  using (author_id = auth.uid());

create policy "notes_delete_owner"
  on notes for delete
  using (author_id = auth.uid());

create or replace function update_note_by_token(
  p_slug text,
  p_edit_token text,
  p_content text,
  p_theme text
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
    theme = p_theme,
    updated_at = now()
  where slug = p_slug
    and edit_token = p_edit_token;

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

grant execute on function update_note_by_token(text, text, text, text) to anon, authenticated;
