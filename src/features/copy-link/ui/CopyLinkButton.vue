<script setup lang="ts">
import { getNoteUrl } from '@/entities/note/api/noteRepository'
import { useCopyToClipboard } from '@/shared/lib/useCopyToClipboard'
import UiButton from '@/shared/ui/Button/Button.vue'

const props = defineProps<{
  slug: string
}>()

const { copyText } = useCopyToClipboard()

function handleCopy() {
  copyText(getNoteUrl(props.slug), 'Link copied')
}
</script>

<template>
  <UiButton variant="secondary" size="sm" @click="handleCopy">
    Copy Link
  </UiButton>
</template>
