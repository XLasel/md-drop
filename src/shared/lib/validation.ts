import { i18n } from '@/shared/i18n'

const MAX_CONTENT_LENGTH = 512_000
const MAX_TITLE_LENGTH = 100

export function validateNoteContent(content: string): string | null {
  const trimmed = content.trim()

  if (!trimmed) {
    return i18n.global.t('validation.contentEmpty')
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return i18n.global.t('validation.contentTooLong')
  }

  return null
}

export function validateTitle(title: string): string | null {
  if (title.length > MAX_TITLE_LENGTH) {
    return i18n.global.t('validation.titleTooLong')
  }

  return null
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9]{6,12}$/.test(slug)
}

export function deriveTitle(title: string, content: string): string {
  const trimmedTitle = title.trim()
  if (trimmedTitle) {
    return trimmedTitle.slice(0, MAX_TITLE_LENGTH)
  }

  const firstLine = content
    .trim()
    .split('\n')[0]
    ?.replace(/^#+\s*/, '')
    .trim() ?? ''

  return firstLine.slice(0, MAX_TITLE_LENGTH) || i18n.global.t('common.untitled')
}
