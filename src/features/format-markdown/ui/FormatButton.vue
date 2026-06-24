<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { formatMarkdown } from '@/features/format-markdown/api/formatMarkdown'
import { useEditorStore } from '@/entities/note/model/editorStore'
import { useToast } from '@/shared/lib/toast'
import { validateNoteContent } from '@/shared/lib/validation'
import UiButton from '@/shared/ui/Button/Button.vue'

const editorStore = useEditorStore()
const { content } = storeToRefs(editorStore)
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
    toast.error('Text is too long for AI formatting (max 10 KB)')
    return
  }

  loading.value = true
  previousContent.value = content.value

  try {
    content.value = await formatMarkdown(content.value)
    toast.success('Markdown formatted')
  } catch (error) {
    previousContent.value = null
    const message = error instanceof Error ? error.message : 'Formatting failed'
    toast.error(message)
  } finally {
    loading.value = false
  }
}

function handleUndo() {
  if (previousContent.value !== null) {
    content.value = previousContent.value
    previousContent.value = null
    toast.info('Reverted formatting')
  }
}
</script>

<template>
  <div :class="$style.actions">
    <UiButton
      v-if="previousContent !== null"
      variant="secondary"
      size="sm"
      @click="handleUndo"
    >
      ↩ Undo
    </UiButton>
    <UiButton variant="accent-outline" size="sm" :loading="loading" @click="handleFormat">
      <span :class="$style.spark">✦</span>
      Improve
    </UiButton>
  </div>
</template>

<style module lang="scss">
.actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.spark {
  font-family: var(--font-mono);
}
</style>
