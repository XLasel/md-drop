<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/entities/locale/model/localeStore'

const localeStore = useLocaleStore()
const { t } = useI18n()

const label = computed(() => localeStore.locale.toUpperCase())
</script>

<template>
  <button
    type="button"
    :class="$style.toggle"
    :title="t('language.toggleTitle')"
    :aria-label="t('language.toggleAria')"
    @click="localeStore.toggleLocale()"
  >
    {{ label }}
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
  font-family: var(--font-mono);
  font-size: var(--step--2);
  font-weight: 500;
  letter-spacing: 0.02em;
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
