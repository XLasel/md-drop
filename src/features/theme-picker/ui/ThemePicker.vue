<script setup lang="ts">
import type { NoteTheme } from '@/entities/note/model/types'
import { NOTE_THEMES } from '@/entities/note/model/types'

const model = defineModel<NoteTheme>({ required: true })
</script>

<template>
  <label :class="$style.picker">
    <span :class="$style.label">Theme</span>
    <select v-model="model" :class="$style.select">
      <option v-for="theme in NOTE_THEMES" :key="theme.value" :value="theme.value">
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
