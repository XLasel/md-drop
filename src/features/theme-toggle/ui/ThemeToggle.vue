<script setup lang="ts">
import { useThemeStore } from '@/entities/theme'
import { useI18n } from 'vue-i18n'

const themeStore = useThemeStore()
const { t } = useI18n()
</script>

<template>
  <button
    type="button"
    :class="$style.toggle"
    :title="t('theme.toggleTitle')"
    :aria-label="t('theme.toggleAria')"
    @click="themeStore.toggleMode()"
  >
    ◑
  </button>
</template>

<style module lang="scss">
.toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--icon-btn);
  height: var(--icon-btn);
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: transparent;
  color: var(--muted);
  font-size: var(--step-0);
  line-height: 1;
  cursor: pointer;
  flex: none;
  @include transition;

  &:hover {
    color: var(--ink);
    border-color: var(--line2);
    background: var(--panel2);
  }

  &:focus-visible {
    @include focus-ring;
  }
}
</style>
