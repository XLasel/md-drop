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
import { PAGE_HEADER_ACTIONS_ID } from '@/widgets/header/lib/teleportTargets'
import EmptyState from '@/shared/ui/EmptyState/EmptyState.vue'
import ErrorState from '@/shared/ui/ErrorState/ErrorState.vue'
import SkeletonLoader from '@/shared/ui/Skeleton/SkeletonLoader.vue'
import UiButton from '@/shared/ui/Button/Button.vue'
import SignInPanel from '@/widgets/sign-in/ui/SignInPanel.vue'

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
    <Teleport :to="`#${PAGE_HEADER_ACTIONS_ID}`">
      <RouterLink to="/write">
        <UiButton size="sm">New note</UiButton>
      </RouterLink>
    </Teleport>

    <main :class="$style.main">
      <div v-if="authStore.loading || loading" :class="$style.loading">
        <SkeletonLoader :lines="5" />
      </div>

      <ErrorState
        v-else-if="error"
        title="Unable to load dashboard"
        :message="error"
        @retry="loadNotes"
      />

      <SignInPanel v-else-if="!authStore.user" />

      <template v-else>
        <div :class="$style.top">
          <h1 :class="$style.heading">Your notes</h1>
          <p v-if="notes.length" :class="$style.subheading">
            {{ notes.length }} {{ notes.length === 1 ? 'note' : 'notes' }}
          </p>
          <p v-else :class="$style.subheading">Nothing here yet.</p>
        </div>

        <EmptyState
          v-if="notes.length === 0"
          icon="#"
          title="A blank canvas"
          description="Your first note is one keystroke away. Write some markdown, hit Share, and you've got a link."
        >
          <RouterLink to="/write">
            <UiButton size="lg">Write your first note →</UiButton>
          </RouterLink>
        </EmptyState>

        <ul v-else :class="$style.list">
          <li v-for="note in notes" :key="note.id" :class="$style.item">
            <div :class="$style.info">
              <span :class="$style.dot" />
              <div :class="$style.copy">
                <div :class="$style.titleRow">
                  <RouterLink :to="`/v/${note.slug}`" :class="$style.noteTitle">
                    {{ note.title }}
                  </RouterLink>
                  <span :class="$style.slug">/v/{{ note.slug }}</span>
                </div>
                <p :class="$style.preview">{{ getNoteExcerpt(note.content) }}</p>
                <time :class="$style.date">{{ formatNoteDate(note.created_at) }}</time>
              </div>
            </div>

            <div :class="$style.actions">
              <RouterLink :to="`/v/${note.slug}`">
                <UiButton variant="secondary" size="sm">View</UiButton>
              </RouterLink>
              <RouterLink :to="{ path: '/write', query: { edit: note.slug } }">
                <UiButton variant="secondary" size="sm">Edit</UiButton>
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
      </template>
    </main>
  </div>
</template>

<style module lang="scss">
.page {
  min-height: 100vh;
  background: var(--bg);
}

.main {
  max-width: 68.75rem;
  margin: 0 auto;
  padding: 0 2rem 6.25rem;
}

.loading {
  padding-top: 3.5rem;
}

.top {
  padding: 3.5rem 0 2rem;
}

.heading {
  margin: 0 0 8px;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.04em;
}

.subheading {
  margin: 0;
  font-size: var(--step-0);
  color: var(--muted);
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 20px 22px;
  border-radius: var(--radius-md);
  transition: background 0.15s;

  &:hover {
    background: var(--panel2);
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.info {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 15px;
  align-items: start;
  min-width: 0;
}

.dot {
  width: 9px;
  height: 9px;
  margin-top: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft);
  flex: none;
}

.copy {
  min-width: 0;
}

.titleRow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 11px;
  margin-bottom: 6px;
}

.noteTitle {
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
  text-decoration: none;

  &:hover {
    color: var(--accent);
  }
}

.slug {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 3px 9px;
  border-radius: 7px;
}

.preview {
  margin: 0 0 6px;
  font-size: 0.8125rem;
  color: var(--faint);
}

.date {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--faint);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
