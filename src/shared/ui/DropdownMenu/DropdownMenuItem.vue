<script setup lang="ts">
import { inject } from 'vue'
import { CoreButton } from '@/shared/ui/Button'
import { dropdownMenuCloseKey } from './dropdownMenuContext'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'danger'
    disabled?: boolean
  }>(),
  {
    variant: 'default',
    disabled: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const close = inject(dropdownMenuCloseKey, () => {})

function handleClick(event: MouseEvent) {
  if (props.disabled) return
  emit('click', event)
  close()
}
</script>

<template>
  <CoreButton
    type="button"
    role="menuitem"
    :disabled="disabled"
    :class="[$style.item, variant === 'danger' && $style.danger]"
    @click="handleClick"
  >
    <slot />
  </CoreButton>
</template>

<style module lang="scss">
.item {
  display: block;
  width: 100%;
  padding: var(--space-2xs);
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: var(--text-sm);
  text-align: left;
  cursor: pointer;
  @include transition;

  &:hover:not(:disabled) {
    background: var(--panel2);
  }

  &:focus-visible {
    @include focus-ring;
  }

  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }
}

.danger {
  color: var(--danger-color);

  &:hover:not(:disabled) {
    background: var(--danger-bg);
  }
}
</style>
