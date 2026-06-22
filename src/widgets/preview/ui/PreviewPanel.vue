<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NoteTheme } from '@/entities/note/model/types'
import { renderMarkdown } from '@/shared/lib/markdown/renderMarkdown'
import SkeletonLoader from '@/shared/ui/Skeleton/SkeletonLoader.vue'

const props = defineProps<{
  content: string
  theme?: NoteTheme
}>()

const html = ref('')
const loading = ref(false)

watch(
  () => [props.content, props.theme] as const,
  async ([content, theme]) => {
    loading.value = true

    try {
      html.value = content ? await renderMarkdown(content, theme ?? 'github') : ''
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div :class="$style.panel">
    <div :class="$style.label">Preview</div>
    <div :class="$style.content">
      <SkeletonLoader v-if="loading && content" :lines="6" />
      <div
        v-else-if="html"
        class="markdown-body"
        :class="$style.markdown"
        v-html="html"
      />
      <p v-else :class="$style.placeholder">Preview will appear here</p>
    </div>
  </div>
</template>

<style module lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  background: var(--bg-secondary);
}

.label {
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-tertiary);
}

.content {
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
  min-height: 320px;
}

.markdown {
  max-width: var(--preview-max-width);
  margin: 0 auto;
}

.placeholder {
  margin: 0;
  color: var(--text-muted);
  text-align: center;
  padding-top: 2rem;
}
</style>
