<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import {
  fetchUserNotes,
  formatNoteDate,
  getNoteExcerpt,
  getNoteUrl,
} from '@/entities/note'
import type { Note } from '@/entities/note'
import { useLocaleStore } from '@/entities/locale'
import { useAuthStore } from '@/entities/user'
import { useDeleteNote } from '@/features/delete-note'
import { NOTES_PAGE_SIZE } from '@/shared/config/notes'
import { useCopyToClipboard } from '@/shared/lib/useCopyToClipboard'
import EmptyState from '@/shared/ui/EmptyState/EmptyState.vue'
import ErrorState from '@/shared/ui/ErrorState/ErrorState.vue'
import SkeletonLoader from '@/shared/ui/Skeleton/SkeletonLoader.vue'
import { CoreButton, UiButton } from '@/shared/ui/Button'
import { OverflowMenu } from '@/shared/ui/OverflowMenu'
import type { OverflowMenuItem } from '@/shared/ui/OverflowMenu'
import { SignInPanel } from '@/widgets/sign-in'

const authStore = useAuthStore()
const localeStore = useLocaleStore()
const { t } = useI18n()
const { copyText } = useCopyToClipboard()
const { confirmAndDelete, isDeleting } = useDeleteNote()
const { locale } = storeToRefs(localeStore)

const notes = ref<Note[]>([])
const totalNotes = ref(0)
const page = ref(0)
const loading = ref(true)
const error = ref<string | null>(null)

const totalPages = computed(() => Math.max(1, Math.ceil(totalNotes.value / NOTES_PAGE_SIZE)))
const showPagination = computed(() => totalNotes.value > NOTES_PAGE_SIZE)

function menuItems(note: Note): OverflowMenuItem[] {
  return [
    { key: 'copyLink', label: t('common.copyLink') },
    {
      key: 'delete',
      label: t('common.delete'),
      variant: 'danger',
      disabled: isDeleting(note.slug),
    },
  ]
}

async function loadNotes() {
  if (!authStore.user) {
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const result = await fetchUserNotes(authStore.user.id, page.value)
    notes.value = result.notes
    totalNotes.value = result.total
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.loadFailed')
  } finally {
    loading.value = false
  }
}

async function handleMenuSelect(key: string, note: Note) {
  if (key === 'copyLink') {
    copyText(getNoteUrl(note.slug), t('clipboard.linkCopied'))
    return
  }

  if (key === 'delete') {
    await confirmAndDelete(note, async () => {
      if (notes.value.length === 1 && page.value > 0) {
        page.value -= 1
      }
      await loadNotes()
    })
  }
}

function goToPage(nextPage: number) {
  page.value = nextPage
  void loadNotes()
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
          <p v-if="totalNotes" :class="$style.subheading">
            {{ t('dashboard.noteCount', totalNotes) }}
          </p>
          <p v-else :class="$style.subheading">{{ t('dashboard.emptySubheading') }}</p>
        </div>

        <EmptyState
          v-if="totalNotes === 0"
          icon="#"
          :title="t('dashboard.emptyTitle')"
          :description="t('dashboard.emptyDescription')"
        >
          <UiButton to="/write" size="lg" icon-position="end" animated>
            <template #icon>→</template>
            {{ t('dashboard.emptyCta') }}
          </UiButton>
        </EmptyState>

        <template v-else>
          <ul :class="$style.list">
            <li v-for="note in notes" :key="note.id" :class="$style.item">
              <div :class="$style.info">
                <span :class="$style.dot" />
                <div :class="$style.copy">
                  <div :class="$style.titleRow">
                    <CoreButton :to="`/v/${note.slug}`" :class="$style.noteTitle">
                      {{ note.title }}
                    </CoreButton>
                    <span :class="$style.slug">/v/{{ note.slug }}</span>
                  </div>
                  <p :class="$style.preview">{{ getNoteExcerpt(note.content, 120, note.title) }}</p>
                  <time :class="$style.date">{{ formatNoteDate(note.created_at, locale) }}</time>
                </div>
              </div>

              <div :class="$style.actions">
                <UiButton :to="`/v/${note.slug}`" variant="secondary" size="sm">{{
                  t('common.view')
                }}</UiButton>
                <UiButton
                  :to="{ path: '/write', query: { edit: note.slug } }"
                  variant="secondary"
                  size="sm"
                >
                  {{ t('common.edit') }}
                </UiButton>
                <OverflowMenu
                  :items="menuItems(note)"
                  :ariaLabel="t('common.moreActions')"
                  @select="handleMenuSelect($event, note)"
                />
              </div>
            </li>
          </ul>

          <nav
            v-if="showPagination"
            :class="$style.pagination"
            :aria-label="t('dashboard.pageOf', { current: page + 1, total: totalPages })"
          >
            <UiButton
              variant="secondary"
              size="sm"
              :disabled="page === 0"
              @click="goToPage(page - 1)"
            >
              {{ t('dashboard.prevPage') }}
            </UiButton>
            <span :class="$style.pageLabel">
              {{ t('dashboard.pageOf', { current: page + 1, total: totalPages }) }}
            </span>
            <UiButton
              variant="secondary"
              size="sm"
              :disabled="page >= totalPages - 1"
              @click="goToPage(page + 1)"
            >
              {{ t('dashboard.nextPage') }}
            </UiButton>
          </nav>
        </template>
      </template>
    </div>
  </div>
</template>

<style module lang="scss">
.page {
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
  align-items: center;
  gap: 6px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-s);
  margin-top: var(--space-m);
  padding-top: var(--space-s);
}

.pageLabel {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--muted);
}
</style>
