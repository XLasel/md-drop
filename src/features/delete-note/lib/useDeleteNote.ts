import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  clearEditToken,
  deleteNote,
  deleteNoteByToken,
  getEditToken,
} from '@/entities/note'
import type { Note } from '@/entities/note'
import { useAuthStore } from '@/entities/user'
import { useToast } from '@/shared/lib/toast'

type DeletableNote = Pick<Note, 'id' | 'slug' | 'title' | 'author_id'>

export function useDeleteNote() {
  const { t } = useI18n()
  const toast = useToast()
  const authStore = useAuthStore()
  const deletingSlug = ref<string | null>(null)

  function canDelete(note: DeletableNote): boolean {
    const userId = authStore.user?.id
    if (userId && note.author_id === userId) return true
    return Boolean(getEditToken(note.slug))
  }

  function isDeleting(slug: string): boolean {
    return deletingSlug.value === slug
  }

  async function confirmAndDelete(
    note: DeletableNote,
    onSuccess?: () => void | Promise<void>,
  ): Promise<boolean> {
    if (!canDelete(note)) {
      toast.error(t('share.noPermission'))
      return false
    }

    if (!confirm(t('dashboard.deleteConfirm', { title: note.title }))) return false

    deletingSlug.value = note.slug

    try {
      const userId = authStore.user?.id

      if (userId && note.author_id === userId) {
        await deleteNote(note.id)
      } else {
        const editToken = getEditToken(note.slug)
        if (!editToken) {
          toast.error(t('share.noPermission'))
          return false
        }

        const deleted = await deleteNoteByToken(note.slug, editToken)
        if (!deleted) {
          toast.error(t('dashboard.deleteFailed'))
          return false
        }

        clearEditToken(note.slug)
      }

      toast.success(t('dashboard.noteDeleted'))
      await onSuccess?.()
      return true
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('dashboard.deleteFailed'))
      return false
    } finally {
      deletingSlug.value = null
    }
  }

  return {
    canDelete,
    isDeleting,
    confirmAndDelete,
  }
}
