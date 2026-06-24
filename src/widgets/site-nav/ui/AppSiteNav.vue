<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/entities/user/model/authStore'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const items = [
  { label: 'Landing', name: 'landing' as const },
  { label: 'Write', name: 'create' as const },
  { label: 'Dashboard', name: 'dashboard' as const },
]
</script>

<template>
  <nav :class="$style.nav" aria-label="Site sections">
    <div :class="$style.inner">
      <RouterLink
        v-for="item in items"
        :key="item.name"
        :to="{ name: item.name }"
        :class="$style.item"
        :active-class="$style.active"
      >
        {{ item.label }}
      </RouterLink>

      <span :class="$style.divider" aria-hidden="true" />

      <button
        v-if="user"
        type="button"
        :class="[$style.meta, $style.signedIn]"
        @click="authStore.signOut()"
      >
        <span :class="$style.dot" />
        signed in
      </button>
      <RouterLink v-else :to="{ name: 'dashboard' }" :class="$style.meta">
        signed out
      </RouterLink>
    </div>
  </nav>
</template>

<style module lang="scss">
.nav {
  position: fixed;
  left: 50%;
  bottom: var(--space-s);
  z-index: 60;
  transform: translateX(-50%);
  max-width: calc(100vw - var(--space-m));
}

.inner {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: var(--space-3xs) var(--space-2xs);
  border: 1px solid var(--line2);
  border-radius: var(--radius-pill);
  background: var(--panel);
  box-shadow: var(--shadow);
  font-size: var(--step--1);
  white-space: nowrap;
  overflow-x: auto;
}

.item {
  border: none;
  background: transparent;
  color: var(--muted);
  padding: 0.45em 0.85em;
  border-radius: var(--radius-pill);
  font: inherit;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    color: var(--ink);
  }
}

.active {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 500;
}

.divider {
  width: 1px;
  height: 1.125rem;
  margin: 0 var(--space-3xs);
  background: var(--line);
  flex: none;
}

.meta {
  border: none;
  background: transparent;
  color: var(--faint);
  padding: 0.45em 0.75em;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: var(--step--2);
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: var(--muted);
  }
}

.signedIn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3xs);
  color: var(--accent);
}

.dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: var(--accent2);
}
</style>
