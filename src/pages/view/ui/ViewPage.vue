<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import CopyLinkButton from '@/features/copy-link/ui/CopyLinkButton.vue'
import CopyMarkdownButton from '@/features/copy-markdown/ui/CopyMarkdownButton.vue'
import {
  fetchNoteBySlug,
  formatNoteDate,
  getNoteExcerpt,
  hasEditAccess,
} from '@/entities/note/api/noteRepository'
import type { Note } from '@/entities/note/model/types'
import { useAuthStore } from '@/entities/user/model/authStore'
import { useLocaleStore } from '@/entities/locale/model/localeStore'
import { useThemeStore } from '@/entities/theme/model/themeStore'
import { renderMarkdown } from '@/shared/lib/markdown/renderMarkdown'
import { PAGE_HEADER_ACTIONS_ID, PAGE_HEADER_START_ID } from '@/widgets/header/lib/teleportTargets'
import { resetPageMeta, setPageMeta } from '@/shared/lib/seo'
import ErrorState from '@/shared/ui/ErrorState/ErrorState.vue'
import SkeletonLoader from '@/shared/ui/Skeleton/SkeletonLoader.vue'
import UiButton from '@/shared/ui/Button/Button.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const localeStore = useLocaleStore()
const themeStore = useThemeStore()
const { resolved } = storeToRefs(themeStore)
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
    html.value = await renderMarkdown(result.content, resolved.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('view.loadFailed')
  } finally {
    loading.value = false
  }
}

function goToEdit() {
  router.push({ path: '/write', query: { edit: slug.value } })
}

watch(
  () => [note.value, resolved.value] as const,
  async ([currentNote, theme]) => {
    if (!currentNote) return
    html.value = await renderMarkdown(currentNote.content, theme)
  },
)

watch(note, (currentNote) => {
  if (!currentNote) {
    resetPageMeta()
    return
  }

  setPageMeta({
    title: t('meta.noteTitle', { title: currentNote.title }),
    description: getNoteExcerpt(currentNote.content),
    indexable: currentNote.indexable,
  })
})

onMounted(loadNote)
onUnmounted(resetPageMeta)
</script>

<template>
  <div :class="$style.page">
    <Teleport :to="`#${PAGE_HEADER_START_ID}`">
      <span :class="$style.slug">/v/{{ slug }}</span>
    </Teleport>

    <Teleport :to="`#${PAGE_HEADER_ACTIONS_ID}`">
      <CopyMarkdownButton v-if="note" :content="note.content" />
      <UiButton v-if="canEdit" variant="accent-outline" size="sm" @click="goToEdit">
        ✎ {{ t('common.edit') }}
      </UiButton>
      <CopyLinkButton v-if="note" :slug="slug" />
    </Teleport>

    <main :class="$style.main">
      <div v-if="loading" :class="$style.loading">
        <SkeletonLoader :lines="8" />
      </div>

      <ErrorState
        v-else-if="error"
        :title="t('view.unableToLoad')"
        :message="error"
        @retry="loadNote"
      />

      <article v-else-if="note" :class="$style.article">
        <div :class="$style.meta">
          <time :datetime="note.created_at">{{ formatNoteDate(note.created_at, locale) }}</time>
        </div>

        <h1 :class="$style.title">{{ note.title }}</h1>

        <div
          class="markdown-body markdown-body--reader"
          :class="$style.content"
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
    </main>
  </div>
</template>

<style module lang="scss">
.page {
  min-height: 100vh;
  background: var(--bg);
}

.slug {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--faint);
}

.main {
  max-width: var(--reader-max-width);
  margin: 0 auto;
  padding: 6rem 2rem 8.125rem;
  animation: fade-up 0.5s ease both;
}

.loading {
  padding: 2rem 0;
}

.article {
  max-width: 100%;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.75rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--faint);
}

.title {
  margin: 0 0 1.75rem;
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  line-height: 1.02;
  font-weight: 600;
  letter-spacing: -0.045em;
}

.content {
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
