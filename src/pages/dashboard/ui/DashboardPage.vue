<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import {
  deleteNote,
  fetchUserNotes,
  formatNoteDate,
  getNoteExcerpt,
} from '@/entities/note'
import type { Note } from '@/entities/note'
import { useLocaleStore } from '@/entities/locale'
import { useAuthStore } from '@/entities/user'
import { useToast } from '@/shared/lib/toast'
import EmptyState from '@/shared/ui/EmptyState/EmptyState.vue'
import ErrorState from '@/shared/ui/ErrorState/ErrorState.vue'
import SkeletonLoader from '@/shared/ui/Skeleton/SkeletonLoader.vue'
import { UiButton } from '@/shared/ui/Button'
import { SignInPanel } from '@/widgets/sign-in'

const authStore = useAuthStore()
const localeStore = useLocaleStore()
const { t } = useI18n()
const toast = useToast()
const { locale } = storeToRefs(localeStore)

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
    error.value = err instanceof Error ? err.message : t('dashboard.loadFailed')
  } finally {
    loading.value = false
  }
}

async function handleDelete(note: Note) {
  if (!confirm(t('dashboard.deleteConfirm', { title: note.title }))) return

  deletingId.value = note.id

  try {
    await deleteNote(note.id)
    notes.value = notes.value.filter((item) => item.id !== note.id)
    toast.success(t('dashboard.noteDeleted'))
  } catch (err) {
    toast.error(err instanceof Error ? err.message : t('dashboard.deleteFailed'))
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
  <div :class="$style.container">
      <div v-if="authStore.loading || loading" :class="$style.loading">
        <SkeletonLoader :lines="5" />
      </div>

      <ErrorState
        v-else-if="error"
        :title="t('dashboard.unableToLoad')"
        :message="error"
        @retry="loadNotes"
      />

      <SignInPanel v-else-if="!authStore.user" />

      <template v-else>
        <div :class="$style.top">
          <h1 :class="$style.heading">{{ t('dashboard.heading') }}</h1>
          <p v-if="notes.length" :class="$style.subheading">
            {{ t('dashboard.noteCount', notes.length) }}
          </p>
          <p v-else :class="$style.subheading">{{ t('dashboard.emptySubheading') }}</p>
        </div>

        <EmptyState
          v-if="notes.length === 0"
          icon="#"
          :title="t('dashboard.emptyTitle')"
          :description="t('dashboard.emptyDescription')"
        >
          <UiButton to="/write" size="lg" icon-position="end" animated>
            <template #icon>→</template>
            {{ t('dashboard.emptyCta') }}
          </UiButton>
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
                <p :class="$style.preview">{{ getNoteExcerpt(note.content, 120, note.title) }}</p>
                <time :class="$style.date">{{ formatNoteDate(note.created_at, locale) }}</time>
              </div>
            </div>

            <div :class="$style.actions">
              <UiButton :to="`/v/${note.slug}`" variant="secondary" size="sm">{{ t('common.view') }}</UiButton>
              <UiButton
                :to="{ path: '/write', query: { edit: note.slug } }"
                variant="secondary"
                size="sm"
              >
                {{ t('common.edit') }}
              </UiButton>
              <UiButton
                variant="danger"
                size="sm"
                :loading="deletingId === note.id"
                @click="handleDelete(note)"
              >
                {{ t('common.delete') }}
              </UiButton>
            </div>
          </li>
        </ul>
      </template>
  </div>
  </div>
</template>

<style module lang="scss">
.root {
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - var(--header-height) - var(--site-nav-offset));
}

.container {
  @include layout-shell;
  padding-bottom: var(--page-pad-bottom);
}

.loading {
  padding-top: var(--page-pad-top-lg);
}

.top {
  padding: var(--page-pad-top-lg) 0 var(--space-m);
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

  @include transition(background-color);

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

  @include transition(color);

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
