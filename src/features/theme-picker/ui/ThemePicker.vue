<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/entities/theme/model/themeStore'
import { APP_THEMES } from '@/entities/theme/model/types'

const themeStore = useThemeStore()
const { preference } = storeToRefs(themeStore)

async function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  await themeStore.setPreference(value as typeof preference.value)
}
</script>

<template>
  <label :class="$style.picker">
    <span :class="$style.label">Theme</span>
    <select :value="preference" :class="$style.select" @change="onChange">
      <option v-for="theme in APP_THEMES" :key="theme.value" :value="theme.value">
        {{ theme.label }}
      </option>
    </select>
  </label>
</template>

<style module lang="scss">
.picker {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.select {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);

  &:focus-visible {
    @include focus-ring;
  }
}
</style>
