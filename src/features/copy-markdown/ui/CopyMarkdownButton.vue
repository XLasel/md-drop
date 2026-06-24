<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCopyToClipboard } from '@/shared/lib/useCopyToClipboard'
import UiButton from '@/shared/ui/Button/UiButton.vue'

const props = defineProps<{
  content: string
}>()

const { t } = useI18n()
const { copyText } = useCopyToClipboard()

function handleCopy() {
  copyText(props.content, t('clipboard.markdownCopied'))
}
</script>

<template>
  <UiButton variant="secondary" size="sm" :aria-label="t('common.copyMarkdown')" @click="handleCopy">
    <template #icon>MD</template>
    {{ t('common.copyMarkdown') }}
  </UiButton>
</template>
