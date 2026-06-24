<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/entities/user/model/authStore'
import UiButton from '@/shared/ui/Button/Button.vue'

const authStore = useAuthStore()
</script>

<template>
  <section :class="$style.panel">
    <div :class="$style.icon" aria-hidden="true">◑</div>
    <h2 :class="$style.title">Sign in to open your dashboard</h2>
    <p :class="$style.description">
      Notes work without an account — write one and share the link right away. Sign in to keep
      every note in one place: list, edit, and manage links.
    </p>
    <div :class="$style.actions">
      <UiButton @click="authStore.signInWithGitHub()">Continue with GitHub</UiButton>
      <UiButton variant="secondary" @click="authStore.signInWithGoogle()">
        Continue with Google
      </UiButton>
    </div>
    <RouterLink to="/write" :class="$style.anonLink">or write a note without signing in →</RouterLink>
  </section>
</template>

<style module lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(4rem, 8vw, 6.75rem) var(--space-s) clamp(5rem, 10vw, 8.125rem);
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
