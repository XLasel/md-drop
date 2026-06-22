<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CopyLinkButton from '@/features/copy-link/ui/CopyLinkButton.vue'
import CopyMarkdownButton from '@/features/copy-markdown/ui/CopyMarkdownButton.vue'
import {
  fetchNoteBySlug,
  formatNoteDate,
  hasEditAccess,
} from '@/entities/note/api/noteRepository'
import type { Note } from '@/entities/note/model/types'
import { useAuthStore } from '@/entities/user/model/authStore'
import { renderMarkdown } from '@/shared/lib/markdown/renderMarkdown'
import ErrorState from '@/shared/ui/ErrorState/ErrorState.vue'
import SkeletonLoader from '@/shared/ui/Skeleton/SkeletonLoader.vue'
import AppHeader from '@/widgets/header/ui/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const note = ref<Note | null>(null)
const html = ref('')
const loading = ref(true)
const error = ref<string | null>(null)

const slug = computed(() => route.params.slug as string)
const canEdit = computed(
  () =>
    note.value !== null &&
    (hasEditAccess(slug.value) || note.value.author_id === authStore.user?.id),
)

async function loadNote() {
  loading.value = true
  error.value = null
  note.value = null
  html.value = ''

  try {
    const result = await fetchNoteBySlug(slug.value)

    if (!result) {
      error.value = 'Note not found'
      return
    }

    note.value = result
    html.value = await renderMarkdown(result.content, result.theme)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load note'
  } finally {
    loading.value = false
  }
}

function goToEdit() {
  router.push({ path: '/', query: { edit: slug.value } })
}

onMounted(loadNote)
</script>

<template>
  <div :data-theme="note?.theme ?? 'github'" :class="$style.page">
    <AppHeader :show-auth="false" />

    <main :class="$style.main">
      <div v-if="loading" :class="$style.card">
        <SkeletonLoader :lines="8" />
      </div>

      <ErrorState
        v-else-if="error"
        title="Unable to load note"
        :message="error"
        @retry="loadNote"
      />

      <article v-else-if="note" :class="$style.card">
        <header :class="$style.meta">
          <time :datetime="note.created_at">{{ formatNoteDate(note.created_at) }}</time>
          <div :class="$style.actions">
            <CopyMarkdownButton :content="note.content" />
            <CopyLinkButton :slug="note.slug" />
            <button v-if="canEdit" type="button" :class="$style.editBtn" @click="goToEdit">
              Edit
            </button>
          </div>
        </header>

        <div class="markdown-body" :class="$style.content" v-html="html" />
      </article>
    </main>
  </div>
</template>

<style module lang="scss">
.page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.main {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.card {
  max-width: var(--preview-max-width);
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.editBtn {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--accent-color);
  border-radius: var(--radius-sm);
  background: var(--accent-bg);
  color: var(--accent-color);
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: var(--accent-color);
    color: var(--bg-primary);
  }
}

.content {
  color: var(--text-primary);
}
</style>
