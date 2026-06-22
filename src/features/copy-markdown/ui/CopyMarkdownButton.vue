<script setup lang="ts">
import { useCopyToClipboard } from '@/shared/lib/useCopyToClipboard'
import UiButton from '@/shared/ui/Button/Button.vue'

const props = defineProps<{
  content: string
}>()

const { copyText } = useCopyToClipboard()

function handleCopy() {
  copyText(props.content, 'Markdown copied')
}
</script>

<template>
  <UiButton variant="secondary" size="sm" @click="handleCopy">
    Copy Markdown
  </UiButton>
</template>
