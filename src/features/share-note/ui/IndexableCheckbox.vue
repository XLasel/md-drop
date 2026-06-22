<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label :class="$style.label">
    <input v-model="model" type="checkbox" :class="$style.checkbox" />
    <span>Allow search engine indexing</span>
  </label>
</template>

<style module lang="scss">
.label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.checkbox {
  accent-color: var(--accent-color);
}
</style>
