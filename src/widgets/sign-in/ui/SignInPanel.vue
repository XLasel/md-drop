<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities/user/model/authStore'
import UiButton from '@/shared/ui/Button/UiButton.vue'

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
    <RouterLink to="/write" :class="$style.anonLink">{{ t('auth.writeAnonymously') }}</RouterLink>
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
  padding: var(--space-l) var(--header-pad-x);
  animation: fade-up 0.5s ease both;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 78px;
  height: 78px;
  margin-bottom: 28px;
  border-radius: 24px;
  background: var(--accent-soft);
  font-size: 32px;
  color: var(--accent);
}

.title {
  margin: 0 0 13px;
  font-size: var(--step-3);
  font-weight: 600;
  letter-spacing: -0.035em;
  color: var(--ink);
}

.description {
  margin: 0 0 32px;
  max-width: 25rem;
  font-size: var(--step-0);
  line-height: 1.6;
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.anonLink {
  margin-top: 26px;
  font-size: var(--step--1);
  color: var(--faint);
  text-decoration: none;
  border-bottom: 1px solid var(--line);

  &:hover {
    color: var(--muted);
  }
}
</style>
