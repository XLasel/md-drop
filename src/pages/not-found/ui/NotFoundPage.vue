<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { UiButton } from '@/shared/ui/Button'

const { t } = useI18n()
</script>

<template>
  <div :class="$style.content">
    <div :class="$style.code">404</div>
    <h1 :class="$style.title">{{ t('notFound.title') }}</h1>
    <p :class="$style.description">
      {{ t('notFound.description') }}
    </p>
    <UiButton to="/">{{ t('notFound.goHome') }}</UiButton>
  </div>
</template>

<style module lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - var(--header-height) - var(--site-nav-offset));
  padding: var(--space-l) var(--page-pad-x);
  text-align: center;
  max-width: 28rem;
  margin: 0 auto;
}

.code {
  font-size: 4rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 1rem;
}

.title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: var(--ink);
}

.description {
  margin: 0 0 1.5rem;
  color: var(--muted);
}
</style>
