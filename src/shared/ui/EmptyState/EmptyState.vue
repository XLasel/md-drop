<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div :class="$style.empty">
    <div :class="$style.icon" aria-hidden="true">📄</div>
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
  padding: 3rem 1.5rem;
  gap: 0.75rem;
}

.icon {
  font-size: 2.5rem;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.description {
  margin: 0;
  max-width: 28rem;
  color: var(--text-secondary);
}

.actions {
  margin-top: 0.5rem;
}
</style>
