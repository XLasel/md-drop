<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatMarkdown } from '@/features/format-markdown/api/formatMarkdown'
import { useEditorStore } from '@/entities/note/model/editorStore'
import { useToast } from '@/shared/lib/toast'
import { validateNoteContent } from '@/shared/lib/validation'
import UiButton from '@/shared/ui/Button/UiButton.vue'

const editorStore = useEditorStore()
const { content } = storeToRefs(editorStore)
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const previousContent = ref<string | null>(null)

async function handleFormat() {
  const validationError = validateNoteContent(content.value)
  if (validationError) {
    toast.error(validationError)
    return
  }

  if (content.value.length > 10_000) {
    toast.error(t('format.tooLong'))
    return
  }

  loading.value = true
  previousContent.value = content.value

  try {
    content.value = await formatMarkdown(content.value)
    toast.success(t('format.success'))
  } catch (error) {
    previousContent.value = null
    const message = error instanceof Error ? error.message : t('format.failed')
    toast.error(message)
  } finally {
    loading.value = false
  }
}

function handleUndo() {
  if (previousContent.value !== null) {
    content.value = previousContent.value
    previousContent.value = null
    toast.info(t('format.reverted'))
  }
}
</script>

<template>
  <div :class="$style.actions">
    <UiButton
      v-if="previousContent !== null"
      variant="secondary"
      size="sm"
      compact
      :aria-label="t('common.undo')"
      @click="handleUndo"
    >
      <template #icon>↩</template>
      {{ t('common.undo') }}
    </UiButton>
    <UiButton
      variant="accent-outline"
      size="sm"
      compact
      :loading="loading"
      :aria-label="t('common.improve')"
      @click="handleFormat"
    >
      <template #icon>✦</template>
      {{ t('common.improve') }}
    </UiButton>
  </div>
</template>

<style module lang="scss">
.actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
}
</style>
