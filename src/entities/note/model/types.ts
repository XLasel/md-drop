export type NoteTheme = 'github' | 'dracula' | 'nord'

export interface Note {
  id: string
  slug: string
  content: string
  theme: NoteTheme
  author_id: string | null
  created_at: string
  updated_at: string
}

export interface CreateNoteInput {
  content: string
  theme: NoteTheme
  authorId?: string | null
}

export interface UpdateNoteInput {
  slug: string
  content: string
  theme: NoteTheme
  editToken: string
}

export const NOTE_THEMES: { value: NoteTheme; label: string }[] = [
  { value: 'github', label: 'GitHub' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'nord', label: 'Nord' },
]

export const EDIT_TOKEN_STORAGE_PREFIX = 'md-drop:edit-token:'
