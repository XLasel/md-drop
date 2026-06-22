<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  deleteNote,
  fetchUserNotes,
  formatNoteDate,
  getNoteExcerpt,
} from '@/entities/note/api/noteRepository'
import type { Note } from '@/entities/note/model/types'
import { useAuthStore } from '@/entities/user/model/authStore'
import { useToast } from '@/shared/lib/toast'
import EmptyState from '@/shared/ui/EmptyState/EmptyState.vue'
import ErrorState from '@/shared/ui/ErrorState/ErrorState.vue'
import SkeletonLoader from '@/shared/ui/Skeleton/SkeletonLoader.vue'
import UiButton from '@/shared/ui/Button/Button.vue'
import AppHeader from '@/widgets/header/ui/AppHeader.vue'

const authStore = useAuthStore()
const toast = useToast()

const notes = ref<Note[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const deletingId = ref<string | null>(null)

async function loadNotes() {
  if (!authStore.user) {
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    notes.value = await fetchUserNotes(authStore.user.id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load notes'
  } finally {
    loading.value = false
  }
}

async function handleDelete(note: Note) {
  if (!confirm(`Delete "${note.title}"?`)) return

  deletingId.value = note.id

  try {
    await deleteNote(note.id)
    notes.value = notes.value.filter((item) => item.id !== note.id)
    toast.success('Note deleted')
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Failed to delete note')
  } finally {
    deletingId.value = null
  }
}

onMounted(async () => {
  await authStore.init()
  await loadNotes()
})
</script>

<template>
  <div :class="$style.page">
    <AppHeader />

    <main :class="$style.main">
      <div :class="$style.top">
        <h1 :class="$style.heading">Dashboard</h1>
        <RouterLink to="/">
          <UiButton>New note</UiButton>
        </RouterLink>
      </div>

      <div v-if="authStore.loading || loading" :class="$style.list">
        <SkeletonLoader :lines="5" />
      </div>

      <ErrorState
        v-else-if="error"
        title="Unable to load dashboard"
        :message="error"
        @retry="loadNotes"
      />

      <EmptyState
        v-else-if="!authStore.user"
        title="Sign in required"
        description="Sign in with GitHub or Google to manage your notes."
      />

      <EmptyState
        v-else-if="notes.length === 0"
        title="No notes yet"
        description="Create your first Markdown note and share it with a link."
      >
        <RouterLink to="/">
          <UiButton>Create note</UiButton>
        </RouterLink>
      </EmptyState>

      <ul v-else :class="$style.list">
        <li v-for="note in notes" :key="note.id" :class="$style.item">
          <div :class="$style.info">
            <RouterLink :to="`/v/${note.slug}`" :class="$style.noteTitle">
              {{ note.title }}
            </RouterLink>
            <span :class="$style.slug">/v/{{ note.slug }}</span>
            <p :class="$style.preview">{{ getNoteExcerpt(note.content) }}</p>
            <time :class="$style.date">{{ formatNoteDate(note.created_at) }}</time>
          </div>

          <div :class="$style.actions">
            <RouterLink :to="`/v/${note.slug}`">
              <UiButton variant="secondary" size="sm">Open</UiButton>
            </RouterLink>
            <RouterLink :to="{ path: '/', query: { edit: note.slug } }">
              <UiButton variant="ghost" size="sm">Edit</UiButton>
            </RouterLink>
            <UiButton
              variant="danger"
              size="sm"
              :loading="deletingId === note.id"
              @click="handleDelete(note)"
            >
              Delete
            </UiButton>
          </div>
        </li>
      </ul>
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

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.heading {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
}

.info {
  flex: 1;
  min-width: 200px;
}

.noteTitle {
  display: block;
  color: var(--text-primary);
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 0.25rem;

  &:hover {
    color: var(--accent-color);
  }
}

.slug {
  display: block;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  margin-bottom: 0.5rem;
}

.preview {
  margin: 0 0 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.date {
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
