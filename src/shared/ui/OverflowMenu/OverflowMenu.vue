<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { onMounted, onUnmounted, ref } from 'vue'

export interface OverflowMenuItem {
  key: string
  label: string
  variant?: 'default' | 'danger'
  disabled?: boolean
}

const props = defineProps<{
  items: OverflowMenuItem[]
  ariaLabel: string
}>()

const emit = defineEmits<{
  select: [key: string]
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

onClickOutside(root, () => {
  open.value = false
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})

function toggle() {
  open.value = !open.value
}

function select(key: string, disabled?: boolean) {
  if (disabled) return
  open.value = false
  emit('select', key)
}
</script>

<template>
  <div ref="root" :class="$style.root">
    <button
      type="button"
      :class="$style.trigger"
      :aria-label="ariaLabel"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="toggle"
    >
      ⋯
    </button>

    <div v-if="open" :class="$style.menu" role="menu">
      <template v-for="(item, index) in items" :key="item.key">
        <div
          v-if="item.variant === 'danger' && index > 0"
          :class="$style.separator"
          role="separator"
        />
        <button
          type="button"
          role="menuitem"
          :class="[$style.item, item.variant === 'danger' && $style.danger]"
          :disabled="item.disabled"
          @click="select(item.key, item.disabled)"
        >
          {{ item.label }}
        </button>
      </template>
    </div>
  </div>
</template>

<style module lang="scss">
.root {
  position: relative;
  flex: none;
}

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
  font-size: var(--step-0);
  line-height: 1;
  letter-spacing: 0.08em;
  cursor: pointer;
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

.menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 50;
  min-width: 11rem;
  padding: 4px;
  border: 1px solid var(--line2);
  border-radius: var(--radius-md);
  background: var(--panel);
  box-shadow: var(--shadow);
}

.separator {
  height: 1px;
  margin: 4px 6px;
  background: var(--line2);
}

.item {
  display: block;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: var(--step--1);
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
