import type { NoteTheme } from '@/entities/note/model/types'
import { NOTE_THEMES } from '@/entities/note/model/types'

const MAX_CONTENT_LENGTH = 512_000

export function validateNoteContent(content: string): string | null {
  const trimmed = content.trim()

  if (!trimmed) {
    return 'Content cannot be empty'
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return 'Content is too long (max 500 KB)'
  }

  return null
}

export function validateTheme(theme: string): theme is NoteTheme {
  return NOTE_THEMES.some((item) => item.value === theme)
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9]{6,12}$/.test(slug)
}
