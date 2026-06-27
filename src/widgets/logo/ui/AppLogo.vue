<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  to?: string
}>()
</script>

<template>
  <component :is="to ? RouterLink : 'div'" :to="to" :class="$style.logo">
    <span :class="$style.mark">#</span>
    <span :class="$style.text">md<span :class="$style.dot">·</span>drop</span>
  </component>
</template>

<style module lang="scss">
.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  font-weight: 600;
  font-size: var(--text-base);
  letter-spacing: -0.03em;
  color: var(--ink);
  text-decoration: none;
}

.mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5625rem;
  height: 1.5625rem;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: var(--on-accent);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  flex: none;
}

.text {
  line-height: 1;
}

.dot {
  color: var(--accent);
}
</style>
