<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: string
}>()
</script>

<template>
  <div :class="$style.empty">
    <div v-if="icon" :class="$style.icon" aria-hidden="true">{{ icon }}</div>
    <h2 :class="$style.title">{{ title }}</h2>
    <p v-if="description" :class="$style.description">{{ description }}</p>
    <div v-if="$slots.default" :class="$style.actions">
      <slot />
    </div>
  </div>
</template>

<style module lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 1.25rem 7.5rem;
  gap: 0.75rem;
  animation: fade-up 0.5s ease both;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6rem;
  height: 6rem;
  margin-bottom: 0.5rem;
  border: 2px dashed var(--line);
  border-radius: var(--radius-xl);
  font-family: var(--font-mono);
  font-size: var(--heading-md);
  color: var(--faint);
}

.title {
  margin: 0;
  font-size: var(--heading-sm);
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--ink);
}

.description {
  margin: 0;
  max-width: 22.5rem;
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--muted);
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
