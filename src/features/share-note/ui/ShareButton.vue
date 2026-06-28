<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ShareSuccessModal from './ShareSuccessModal.vue'
import {
  createNote,
  fetchNoteBySlug,
  getEditToken,
  getNoteUrl,
  updateNoteAsAuthor,
  updateNoteByToken,
  useEditorStore,
} from '@/entities/note'
import { useAuthStore } from '@/entities/user'
import { isSupabaseConfigured } from '@/shared/api/supabase'
import { useToast } from '@/shared/lib/toast'
import { validateNoteContent } from '@/shared/lib/validation'
import { UiButton } from '@/shared/ui/Button'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const editorStore = useEditorStore()
const authStore = useAuthStore()
const { title, content, indexable, editingSlug } = storeToRefs(editorStore)

const loading = ref(false)
const modalOpen = ref(false)
const successSlug = ref<string | null>(null)
const successEditToken = ref<string | null>(null)
const successAuthorId = ref<string | null>(null)
const successExpiresAt = ref<string | null>(null)

async function showSuccessModal() {
  await nextTick()
  modalOpen.value = true
  document.documentElement.classList.add('scroll-locked')
}

function closeSuccessModal() {
  modalOpen.value = false
}

function onModalAfterLeave() {
  successSlug.value = null
  successEditToken.value = null
  successAuthorId.value = null
  successExpiresAt.value = null
  document.documentElement.classList.remove('scroll-locked')
}

async function handleShare() {
  const validationError = validateNoteContent(content.value)
  if (validationError) {
    toast.error(validationError)
    return
  }

  if (!isSupabaseConfigured()) {
    toast.error(t('share.supabaseNotConfigured'))
    return
  }

  if (loading.value) return

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
          toast.error(t('share.updateFailed'))
          return
        }
      } else if (authStore.user) {
        const note = await fetchNoteBySlug(editingSlug.value)
        if (!note || note.author_id !== authStore.user.id) {
          toast.error(t('share.noPermission'))
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
        toast.error(t('share.editTokenNotFound'))
        return
      }

      toast.success(t('share.noteUpdated'))
      await router.push(`/v/${editingSlug.value}`)
      return
    }

    const { note, editToken } = await createNote({
      title: title.value,
      content: content.value,
      authorId: authStore.user?.id ?? null,
      indexable: indexable.value,
    })

    editorStore.startEditing(note.slug, note.title, content.value, indexable.value)

    await navigator.clipboard.writeText(getNoteUrl(note.slug))
    successSlug.value = note.slug
    successEditToken.value = editToken
    successAuthorId.value = note.author_id
    successExpiresAt.value = note.expires_at
    await showSuccessModal()
  } catch (error) {
    const message = error instanceof Error ? error.message : t('share.shareFailed')
    toast.error(message)
  } finally {
    loading.value = false
  }
}

function onIndexableChange(value: boolean) {
  editorStore.setIndexable(value)
}
</script>

<template>
  <UiButton
    size="sm"
    :loading="loading"
    animated
    :aria-label="editingSlug ? t('common.update') : t('common.share')"
    @click="handleShare"
  >
    <template #icon>{{ editingSlug ? '↻' : '↗' }}</template>
    {{ editingSlug ? t('common.update') : t('common.share') }}
  </UiButton>

  <Teleport to="body">
    <Transition
      name="modal-overlay"
      appear
      :duration="{ enter: 650, leave: 440 }"
      @after-leave="onModalAfterLeave"
    >
      <ShareSuccessModal
        v-if="modalOpen"
        :key="successSlug ?? 'success-modal'"
        :slug="successSlug!"
        :title="title"
        :content="content"
        :indexable="indexable"
        :edit-token="successEditToken"
        :author-id="successAuthorId"
        :expires-at="successExpiresAt"
        @close="closeSuccessModal"
        @indexable-change="onIndexableChange"
      />
    </Transition>
  </Teleport>
</template>
