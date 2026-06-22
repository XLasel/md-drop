import { getSupabase } from '@/shared/api/supabase'
import { generateEditToken, generateSlug } from '@/shared/lib/slug'
import { validateNoteContent, validateTheme } from '@/shared/lib/validation'
import type { CreateNoteInput, Note, NoteTheme, UpdateNoteInput } from '../model/types'
import { EDIT_TOKEN_STORAGE_PREFIX } from '../model/types'

export class NoteRepositoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NoteRepositoryError'
  }
}

export function saveEditToken(slug: string, token: string): void {
  localStorage.setItem(`${EDIT_TOKEN_STORAGE_PREFIX}${slug}`, token)
}

export function getEditToken(slug: string): string | null {
  return localStorage.getItem(`${EDIT_TOKEN_STORAGE_PREFIX}${slug}`)
}

export function hasEditAccess(slug: string): boolean {
  return Boolean(getEditToken(slug))
}

export async function createNote(input: CreateNoteInput): Promise<{ note: Note; editToken: string }> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new NoteRepositoryError('Supabase is not configured')
  }

  const contentError = validateNoteContent(input.content)
  if (contentError) {
    throw new NoteRepositoryError(contentError)
  }

  if (!validateTheme(input.theme)) {
    throw new NoteRepositoryError('Invalid theme')
  }

  const slug = generateSlug()
  const editToken = generateEditToken()

  const { data, error } = await supabase
    .from('notes')
    .insert({
      slug,
      content: input.content,
      theme: input.theme,
      author_id: input.authorId ?? null,
      edit_token: editToken,
    })
    .select('id, slug, content, theme, author_id, created_at, updated_at')
    .single()

  if (error || !data) {
    throw new NoteRepositoryError(error?.message ?? 'Failed to create note')
  }

  saveEditToken(slug, editToken)

  return { note: data as Note, editToken }
}

export async function fetchNoteBySlug(slug: string): Promise<Note | null> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new NoteRepositoryError('Supabase is not configured')
  }

  const { data, error } = await supabase
    .from('notes')
    .select('id, slug, content, theme, author_id, created_at, updated_at')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw new NoteRepositoryError(error.message)
  }

  return (data as Note | null) ?? null
}

export async function updateNoteAsAuthor(
  slug: string,
  content: string,
  theme: NoteTheme,
  authorId: string,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new NoteRepositoryError('Supabase is not configured')
  }

  const contentError = validateNoteContent(content)
  if (contentError) {
    throw new NoteRepositoryError(contentError)
  }

  if (!validateTheme(theme)) {
    throw new NoteRepositoryError('Invalid theme')
  }

  const { error } = await supabase
    .from('notes')
    .update({
      content,
      theme,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .eq('author_id', authorId)

  if (error) {
    throw new NoteRepositoryError(error.message)
  }
}

export async function updateNoteByToken(input: UpdateNoteInput): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new NoteRepositoryError('Supabase is not configured')
  }

  const contentError = validateNoteContent(input.content)
  if (contentError) {
    throw new NoteRepositoryError(contentError)
  }

  if (!validateTheme(input.theme)) {
    throw new NoteRepositoryError('Invalid theme')
  }

  const { data, error } = await supabase.rpc('update_note_by_token', {
    p_slug: input.slug,
    p_edit_token: input.editToken,
    p_content: input.content,
    p_theme: input.theme,
  })

  if (error) {
    throw new NoteRepositoryError(error.message)
  }

  return Boolean(data)
}

export async function fetchUserNotes(authorId: string): Promise<Note[]> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new NoteRepositoryError('Supabase is not configured')
  }

  const { data, error } = await supabase
    .from('notes')
    .select('id, slug, content, theme, author_id, created_at, updated_at')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new NoteRepositoryError(error.message)
  }

  return (data as Note[]) ?? []
}

export async function deleteNote(noteId: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new NoteRepositoryError('Supabase is not configured')
  }

  const { error } = await supabase.from('notes').delete().eq('id', noteId)

  if (error) {
    throw new NoteRepositoryError(error.message)
  }
}

export function getNoteUrl(slug: string): string {
  return `${window.location.origin}/v/${slug}`
}

export function formatNoteDate(date: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export type { NoteTheme }
