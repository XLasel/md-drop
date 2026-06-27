<script setup lang="ts">
import { CoreButton } from '@/shared/ui/Button'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/shared/ui/DropdownMenu'

export interface OverflowMenuItem {
  key: string
  label: string
  variant?: 'default' | 'danger'
  disabled?: boolean
}

defineProps<{
  items: OverflowMenuItem[]
  ariaLabel: string
}>()

const emit = defineEmits<{
  select: [key: string]
}>()

function handleSelect(key: string, disabled?: boolean) {
  if (disabled) return
  emit('select', key)
}
</script>

<template>
  <DropdownMenu>
    <template #trigger="{ open, toggle }">
      <CoreButton
        type="button"
        :class="$style.trigger"
        :aria-label="ariaLabel"
        :aria-expanded="open"
        aria-haspopup="menu"
        @click="toggle"
      >
        ⋯
      </CoreButton>
    </template>

    <template v-for="(item, index) in items" :key="item.key">
      <DropdownMenuSeparator v-if="item.variant === 'danger' && index > 0" />
      <DropdownMenuItem
        :variant="item.variant"
        :disabled="item.disabled"
        @click="handleSelect(item.key, item.disabled)"
      >
        {{ item.label }}
      </DropdownMenuItem>
    </template>
  </DropdownMenu>
</template>

<style module lang="scss">
.trigger {
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
  font-size: var(--text-base);
  line-height: 1;
  letter-spacing: 0.08em;
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

  &[aria-expanded='true'] {
    color: var(--ink);
    border-color: var(--line2);
    background: var(--panel2);
  }
}
</style>
