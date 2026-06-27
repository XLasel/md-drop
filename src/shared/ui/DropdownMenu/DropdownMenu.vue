<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { provide, ref } from 'vue'
import { dropdownMenuCloseKey } from './dropdownMenuContext'

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function close() {
  open.value = false
}

function toggle() {
  open.value = !open.value
}

provide(dropdownMenuCloseKey, close)

onClickOutside(root, close)
onKeyStroke('Escape', () => {
  if (open.value) close()
})

defineExpose({ open, toggle, close })
</script>

<template>
  <div ref="root" :class="$style.root">
    <slot name="trigger" :open="open" :toggle="toggle" :close="close" />
    <div v-if="open" :class="$style.panel" role="menu">
      <slot :close="close" />
    </div>
  </div>
</template>

<style module lang="scss">
.root {
  position: relative;
  flex: none;
}

.panel {
  position: absolute;
  top: calc(100% + var(--space-3xs));
  right: 0;
  z-index: 50;
  min-width: 11rem;
  padding: var(--space-3xs);
  border: 1px solid var(--line2);
  border-radius: var(--radius-md);
  background: var(--panel);
  box-shadow: var(--shadow);
}
</style>
