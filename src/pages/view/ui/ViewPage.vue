<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  estimateReadingMinutes,
  fetchNoteBySlug,
  formatNoteDateShort,
  getNoteExcerpt,
  hasEditAccess,
} from '@/entities/note'
import type { Note } from '@/entities/note'
import { useLocaleStore } from '@/entities/locale'
import { useAuthStore } from '@/entities/user'
import { CopyLinkButton } from '@/features/copy-link'
import { CopyMarkdownButton } from '@/features/copy-markdown'
import { renderMarkdown } from '@/shared/lib/markdown/renderMarkdown'
import { NoteActionsBar } from '@/widgets/note-actions'
import { resetPageMeta, setPageMeta } from '@/shared/lib/seo'
import ErrorState from '@/shared/ui/ErrorState/ErrorState.vue'
import SkeletonLoader from '@/shared/ui/Skeleton/SkeletonLoader.vue'
import { UiButton } from '@/shared/ui/Button'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const localeStore = useLocaleStore()
const { locale } = storeToRefs(localeStore)

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
const readingMinutes = computed(() =>
  note.value ? estimateReadingMinutes(note.value.content) : 1,
)

async function loadNote() {
  loading.value = true
  error.value = null
  note.value = null
  html.value = ''

  try {
    const result = await fetchNoteBySlug(slug.value)

    if (!result) {
      error.value = t('view.noteNotFound')
      return
    }

    note.value = result
    html.value = await renderMarkdown(result.content)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('view.loadFailed')
  } finally {
    loading.value = false
  }
}

function goToEdit() {
  router.push({ path: '/write', query: { edit: slug.value } })
}

watch(note, (currentNote) => {
  if (!currentNote) {
    resetPageMeta()
    return
  }

  setPageMeta({
    title: t('meta.noteTitle', { title: currentNote.title }),
    description: getNoteExcerpt(currentNote.content, 120, currentNote.title),
    indexable: currentNote.indexable,
  })
})

onMounted(loadNote)
onUnmounted(resetPageMeta)
</script>

<template>
  <div :class="$style.container">
      <div v-if="loading" :class="$style.loading">
        <SkeletonLoader :lines="8" />
      </div>

      <ErrorState
        v-else-if="error"
        :title="t('view.unableToLoad')"
        :message="error"
        @retry="loadNote"
      />

      <article v-else-if="note">
        <NoteActionsBar max-width="reader">
          <template #start>
            <div :class="$style.start">
              <span :class="$style.status">
                <span :class="$style.statusDot" />
                {{ t('view.published') }}
              </span>
              <CopyLinkButton :slug="slug" variant="inline" />
            </div>
          </template>
          <CopyMarkdownButton :content="note.content" />
          <UiButton
            v-if="canEdit"
            variant="primary"
            size="sm"
            :aria-label="t('common.edit')"
            @click="goToEdit"
          >
            <template #icon>✎</template>
            {{ t('common.edit') }}
          </UiButton>
        </NoteActionsBar>

        <div :class="$style.meta">
          <time :datetime="note.created_at">{{ formatNoteDateShort(note.created_at, locale) }}</time>
          <span :class="$style.metaSep" aria-hidden="true">·</span>
          <span>{{ t('view.readingTime', readingMinutes) }}</span>
        </div>

        <h1 :class="$style.title">{{ note.title }}</h1>

        <div
          class="markdown-body markdown-body--reader"
          :class="$style.body"
          v-html="html"
        />

        <footer :class="$style.footer">
          {{ t('view.footerShared') }}
          <strong>md·drop</strong> —
          <button type="button" :class="$style.footerLink" @click="router.push('/write')">
            {{ t('view.footerCta') }}
          </button>
        </footer>
      </article>
  </div>
</template>

<style module lang="scss">
.container {
  @include layout-shell(var(--reader-max-width));
  padding-block: var(--page-pad-top-lg) var(--page-pad-bottom);
  padding-inline: var(--page-pad-x);
  animation: fade-up 0.5s ease both;

  @media (min-width: 52rem) {
    padding-inline: 0;
  }
}

.start {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex-wrap: wrap;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--step--2);
  color: var(--faint);
  white-space: nowrap;
  flex: none;
}

.statusDot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--success-color);
  flex: none;
}

.loading {
  padding: 2rem 0;
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
  margin-top: 0.25rem;
  font-size: var(--step--1);
  color: var(--faint);
}

.metaSep {
  color: var(--line);
}

.title {
  margin: 0 0 1.75rem;
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  line-height: 1.02;
  font-weight: 600;
  letter-spacing: -0.045em;
}

.body {
  margin-bottom: 3rem;
}

.footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--line2);
  font-size: 0.8125rem;
  color: var(--faint);

  strong {
    color: var(--accent);
    font-weight: 600;
  }
}

.footerLink {
  border: none;
  padding: 0;
  background: transparent;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  font: inherit;

  &:hover {
    color: var(--ink);
  }
}
</style>
