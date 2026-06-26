<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/entities/theme'
import { CoreButton } from '@/shared/ui/Button'

const themeStore = useThemeStore()
const { t } = useI18n()

const modeLabel = computed(() => t(`theme.${themeStore.preference}`))

const icon = computed(() => {
  if (themeStore.preference === 'system') return '◑'
  if (themeStore.preference === 'light') return '☀'
  return '☽'
})
</script>

<template>
  <CoreButton
    type="button"
    :class="$style.toggle"
    :title="t('theme.toggleTitle', { mode: modeLabel })"
    :aria-label="t('theme.toggleAria', { mode: modeLabel })"
    @click="themeStore.cyclePreference()"
  >
    {{ icon }}
  </CoreButton>
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
