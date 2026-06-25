<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNewNote } from '../lib/useNewNote'
import { UiButton } from '@/shared/ui/Button'

withDefaults(
  defineProps<{
    variant?: 'header' | 'ribbon'
  }>(),
  {
    variant: 'header',
  },
)

const { t } = useI18n()
const { startNewNote } = useNewNote()
</script>

<template>
  <UiButton
    :variant="variant === 'ribbon' ? 'secondary' : 'primary'"
    size="sm"
    :compact="variant === 'header'"
    animated
    :aria-label="t('common.newNote')"
    @click="startNewNote"
  >
    <template #icon>+</template>
    {{ t('common.newNote') }}
  </UiButton>
</template>
