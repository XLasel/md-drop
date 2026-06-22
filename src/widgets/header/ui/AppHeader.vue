<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AuthButton from '@/features/auth/ui/AuthButton.vue'

defineProps<{
  showAuth?: boolean
}>()
</script>

<template>
  <header :class="$style.header">
    <div :class="$style.inner">
      <RouterLink to="/" :class="$style.logo">
        <span :class="$style.logoMark">MD</span>
        <span :class="$style.logoText">Drop</span>
      </RouterLink>

      <div :class="$style.actions">
        <slot />
        <AuthButton v-if="showAuth !== false" />
      </div>
    </div>
  </header>
</template>

<style module lang="scss">
.header {
  height: var(--header-height);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
  position: sticky;
  top: 0;
  z-index: 100;
}

.inner {
  max-width: var(--content-max-width);
  margin: 0 auto;
  height: 100%;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
}

.logoMark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
  background: var(--accent-bg);
  color: var(--accent-color);
  font-size: 0.75rem;
  font-weight: 700;
}

.logoText {
  font-size: 1.125rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
