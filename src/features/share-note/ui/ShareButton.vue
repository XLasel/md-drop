<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import IndexableCheckbox from '@/features/share-note/ui/IndexableCheckbox.vue'
import {
  createNote,
  fetchNoteBySlug,
  getEditToken,
  getNoteUrl,
  updateNoteAsAuthor,
  updateNoteByToken,
} from '@/entities/note/api/noteRepository'
import { useEditorStore } from '@/entities/note/model/editorStore'
import { useAuthStore } from '@/entities/user/model/authStore'
import { isSupabaseConfigured } from '@/shared/api/supabase'
import { useToast } from '@/shared/lib/toast'
import { validateNoteContent } from '@/shared/lib/validation'
import UiButton from '@/shared/ui/Button/Button.vue'

const router = useRouter()
const toast = useToast()
const editorStore = useEditorStore()
const authStore = useAuthStore()
const { title, content, indexable, editingSlug } = storeToRefs(editorStore)

const loading = ref(false)

async function handleShare() {
  const validationError = validateNoteContent(content.value)
  if (validationError) {
    toast.error(validationError)
    return
  }

  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Add credentials to .env')
    return
  }

  loading.value = true

  try {
    if (editingSlug.value) {
      const editToken = getEditToken(editingSlug.value)

      if (editToken) {
        const updated = await updateNoteByToken({
          slug: editingSlug.value,
          title: title.value,
          content: content.value,
          editToken,
          indexable: indexable.value,
        })

        if (!updated) {
          toast.error('Failed to update note')
          return
        }
      } else if (authStore.user) {
        const note = await fetchNoteBySlug(editingSlug.value)
        if (!note || note.author_id !== authStore.user.id) {
          toast.error('You do not have permission to edit this note')
          return
        }

        await updateNoteAsAuthor(
          editingSlug.value,
          title.value,
          content.value,
          authStore.user.id,
          indexable.value,
        )
      } else {
        toast.error('Edit token not found')
        return
      }

      toast.success('Note updated')
      await router.push(`/v/${editingSlug.value}`)
      return
    }

    const { note } = await createNote({
      title: title.value,
      content: content.value,
      authorId: authStore.user?.id ?? null,
      indexable: indexable.value,
    })

    toast.success('Link copied to clipboard')
    await navigator.clipboard.writeText(getNoteUrl(note.slug))
    await router.push(`/v/${note.slug}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to share note'
    toast.error(message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div :class="$style.share">
    <IndexableCheckbox v-model="indexable" />
    <UiButton :loading="loading" @click="handleShare">
      {{ editingSlug ? 'Update' : 'Share' }}
    </UiButton>
  </div>
</template>

<style module lang="scss">
.share {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>
