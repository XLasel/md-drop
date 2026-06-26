export interface Note {
  id: string
  slug: string
  title: string
  content: string
  author_id: string | null
  indexable: boolean
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateNoteInput {
  title: string
  content: string
  authorId?: string | null
  indexable?: boolean
}

export interface UpdateNoteInput {
  slug: string
  title: string
  content: string
  editToken: string
  indexable?: boolean
}

export const EDIT_TOKEN_STORAGE_PREFIX = 'md-drop:edit-token:'
