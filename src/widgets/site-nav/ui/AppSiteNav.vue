<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CoreButton, UiButton } from '@/shared/ui/Button'
import { useNewNote } from '@/features/new-note'

const { t } = useI18n()
const { startNewNote } = useNewNote()

const items = computed(() => [
  { label: t('nav.landing'), name: 'landing' as const },
  { label: t('nav.write'), name: 'create' as const },
  { label: t('nav.dashboard'), name: 'dashboard' as const },
])
</script>

<template>
  <nav :class="$style.nav" :aria-label="t('nav.ariaLabel')">
    <div :class="$style.inner">
      <CoreButton
        v-for="item in items"
        :key="item.name"
        :to="{ name: item.name }"
        :class="$style.item"
        :active-class="$style.active"
      >
        {{ item.label }}
      </CoreButton>
      <span :class="$style.divider" aria-hidden="true" />
      <UiButton size="sm" :aria-label="t('nav.new')" animated @click="startNewNote">
        <template #icon>+</template>
        {{ t('nav.new') }}
      </UiButton>
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
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;

  @include transition;

  &:hover {
    color: var(--ink);
  }
}

.active {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 500;

  &:hover {
    color: var(--accent);
  }
}

.divider {
  width: 1px;
  height: 1.25em;
  margin: 0 var(--space-3xs);
  background: var(--line2);
  flex: none;
}
</style>
