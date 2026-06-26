import { NOTES_PAGE_SIZE } from '@/shared/config/notes'
import { getSupabase } from '@/shared/api/supabase'
import { stripMarkdown, stripMarkdownLine } from '@/shared/lib/markdown/stripMarkdown'
import { deriveTitle, validateNoteContent, validateTitle } from '@/shared/lib/validation'
import { generateEditToken, generateSlug } from '@/shared/lib/slug'
import type { CreateNoteInput, Note, UpdateNoteInput } from '../model/types'
import { EDIT_TOKEN_STORAGE_PREFIX } from '../model/types'

export class NoteRepositoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NoteRepositoryError'
  }
}

export class NoteExpiredError extends NoteRepositoryError {
  constructor() {
    super('NOTE_EXPIRED')
    this.name = 'NoteExpiredError'
  }
}

const NOTE_COLUMNS =
  'id, slug, title, content, author_id, indexable, expires_at, created_at, updated_at'

export interface FetchUserNotesResult {
  notes: Note[]
  total: number
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

async function isNoteExpired(slug: string): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) return false

  const { data, error } = await supabase.rpc('is_note_expired', { p_slug: slug })

  if (error) return false
  return Boolean(data)
}

export async function createNote(
  input: CreateNoteInput,
): Promise<{ note: Note; editToken: string }> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new NoteRepositoryError('Supabase is not configured')
  }

  const contentError = validateNoteContent(input.content)
  if (contentError) {
    throw new NoteRepositoryError(contentError)
  }

  const title = deriveTitle(input.title, input.content)
  const titleError = validateTitle(title)
  if (titleError) {
    throw new NoteRepositoryError(titleError)
  }

  const slug = generateSlug()
  const editToken = generateEditToken()

  const { data, error } = await supabase
    .from('notes')
    .insert({
      slug,
      title,
      content: input.content,
      author_id: input.authorId ?? null,
      edit_token: editToken,
      indexable: input.indexable ?? false,
    })
    .select(NOTE_COLUMNS)
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
    .select(NOTE_COLUMNS)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw new NoteRepositoryError(error.message)
  }

  if (!data) {
    if (await isNoteExpired(slug)) {
      throw new NoteExpiredError()
    }
    return null
  }

  return data as Note
}

export async function updateNoteAsAuthor(
  slug: string,
  title: string,
  content: string,
  authorId: string,
  indexable?: boolean,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new NoteRepositoryError('Supabase is not configured')
  }

  const contentError = validateNoteContent(content)
  if (contentError) {
    throw new NoteRepositoryError(contentError)
  }

  const resolvedTitle = deriveTitle(title, content)
  const titleError = validateTitle(resolvedTitle)
  if (titleError) {
    throw new NoteRepositoryError(titleError)
  }

  const payload: Record<string, unknown> = {
    title: resolvedTitle,
    content,
    updated_at: new Date().toISOString(),
  }

  if (indexable !== undefined) {
    payload.indexable = indexable
  }

  const { error } = await supabase
    .from('notes')
    .update(payload)
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

  const resolvedTitle = deriveTitle(input.title, input.content)
  const titleError = validateTitle(resolvedTitle)
  if (titleError) {
    throw new NoteRepositoryError(titleError)
  }

  const { data, error } = await supabase.rpc('update_note_by_token', {
    p_slug: input.slug,
    p_edit_token: input.editToken,
    p_content: input.content,
    p_title: resolvedTitle,
    p_indexable: input.indexable ?? false,
  })

  if (error) {
    throw new NoteRepositoryError(error.message)
  }

  return Boolean(data)
}

export async function fetchUserNotes(
  authorId: string,
  page = 0,
  pageSize = NOTES_PAGE_SIZE,
): Promise<FetchUserNotesResult> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new NoteRepositoryError('Supabase is not configured')
  }

  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('notes')
    .select(NOTE_COLUMNS, { count: 'exact' })
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new NoteRepositoryError(error.message)
  }

  return {
    notes: (data as Note[]) ?? [],
    total: count ?? 0,
  }
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

export function formatNoteDate(date: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function formatNoteDateShort(date: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(date))
}

export function formatNoteExpiryDate(date: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(date))
}

export function estimateReadingMinutes(content: string): number {
  const words = content.trim() ? content.trim().split(/\s+/).length : 0
  return Math.max(1, Math.ceil(words / 200))
}

export function getNoteExcerpt(content: string, maxLength = 120, title?: string): string {
  let plain = stripMarkdown(content)

  if (title) {
    const normalizedTitle = stripMarkdownLine(title.trim())
    if (normalizedTitle && plain.startsWith(normalizedTitle)) {
      plain = plain.slice(normalizedTitle.length).trimStart()
    }
  }

  if (!plain) return ''
  if (plain.length <= maxLength) return plain
  return `${plain.slice(0, maxLength).trimEnd()}...`
}
