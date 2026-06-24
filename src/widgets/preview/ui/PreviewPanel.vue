<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useThemeStore } from '@/entities/theme/model/themeStore'
import { renderMarkdown } from '@/shared/lib/markdown/renderMarkdown'
import SkeletonLoader from '@/shared/ui/Skeleton/SkeletonLoader.vue'

const props = defineProps<{
  content: string
}>()

const themeStore = useThemeStore()
const { resolved } = storeToRefs(themeStore)

const html = ref('')
const loading = ref(false)

watch(
  () => [props.content, resolved.value] as const,
  async ([content, theme]) => {
    loading.value = true

    try {
      html.value = content ? await renderMarkdown(content, theme) : ''
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div :class="$style.panel">
    <div :class="$style.label">
      <span>preview</span>
      <span :class="$style.live">● live</span>
    </div>
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
  border: 1px solid var(--line2);
  border-radius: var(--radius-lg);
  background: var(--panel2);
  overflow: hidden;
}

.label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 18px;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--faint);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.live {
  color: var(--accent2);
}

.content {
  flex: 1;
  overflow: auto;
  min-height: 320px;
  padding: 24px 36px 36px;
}

.markdown {
  max-width: none;
}

.placeholder {
  margin: 0;
  padding-top: 2rem;
  text-align: center;
  color: var(--faint);
}
</style>
