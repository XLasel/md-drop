<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { UiButton } from '@/shared/ui/Button'

defineProps<{
  title?: string
  message: string
}>()

defineEmits<{
  retry: []
}>()

const { t } = useI18n()
</script>

<template>
  <div :class="$style.error">
    <div :class="$style.icon" aria-hidden="true">⚠️</div>
    <h2 v-if="title" :class="$style.title">{{ title }}</h2>
    <p :class="$style.message">{{ message }}</p>
    <UiButton variant="secondary" @click="$emit('retry')">{{ t('common.tryAgain') }}</UiButton>
  </div>
</template>

<style module lang="scss">
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1.5rem;
  gap: 0.75rem;
}

.icon {
  font-size: 2rem;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--ink);
}

.message {
  margin: 0;
  max-width: 28rem;
  color: var(--muted);
}
</style>
