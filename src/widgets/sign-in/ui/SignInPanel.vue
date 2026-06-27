<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities/user'
import { CoreButton, UiButton } from '@/shared/ui/Button'

const authStore = useAuthStore()
const { t } = useI18n()
</script>

<template>
  <section :class="$style.panel">
    <div :class="$style.icon" aria-hidden="true">◑</div>
    <h2 :class="$style.title">{{ t('auth.signInTitle') }}</h2>
    <p :class="$style.description">
      {{ t('auth.signInDescription') }}
    </p>
    <div :class="$style.actions">
      <UiButton @click="authStore.signInWithGitHub()">{{ t('auth.continueGitHub') }}</UiButton>
      <UiButton variant="secondary" @click="authStore.signInWithGoogle()">
        {{ t('auth.continueGoogle') }}
      </UiButton>
    </div>
    <CoreButton to="/write" :class="$style.anonLink">{{ t('auth.writeAnonymously') }}</CoreButton>
  </section>
</template>

<style module lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - var(--header-height) - var(--site-nav-offset));
  text-align: center;
  padding: var(--space-l) var(--page-pad-x);
  animation: fade-up 0.5s ease both;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 78px;
  height: 78px;
  margin-bottom: var(--space-m);
  border-radius: var(--radius-xl);
  background: var(--accent-soft);
  font-size: var(--heading-sm);
  color: var(--accent);
}

.title {
  margin: 0 0 var(--space-xs);
  font-size: var(--heading-sm);
  font-weight: 600;
  letter-spacing: -0.035em;
  color: var(--ink);
}

.description {
  margin: 0 0 var(--space-m);
  max-width: 25rem;
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
  justify-content: center;
}

.anonLink {
  margin-top: var(--space-m);
  font-size: var(--text-sm);
  color: var(--faint);
  text-decoration: none;
  border-bottom: 1px solid var(--line);

  @include transition((color));

  &:hover {
    color: var(--muted);
  }
}
</style>
