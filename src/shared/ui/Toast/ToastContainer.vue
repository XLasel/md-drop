<script setup lang="ts">
import { useToast } from '@/shared/lib/toast'
import type { ToastType } from '@/shared/lib/toast'

const { toasts, remove } = useToast()

const typeClass: Record<ToastType, string> = {
  success: 'success',
  error: 'error',
  info: 'info',
}
</script>

<template>
  <TransitionGroup name="toast" tag="div" aria-live="polite" :class="$style.container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[$style.toast, $style[typeClass[toast.type]]]"
      role="status"
    >
      <span>{{ toast.message }}</span>
      <button type="button" :class="$style.close" @click="remove(toast.id)">×</button>
    </div>
  </TransitionGroup>
</template>

<style module lang="scss">
.container {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: min(360px, calc(100vw - 2rem));

  @include mobile {
    bottom: var(--site-nav-offset);
  }
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--line);
  background: var(--panel);
  box-shadow: var(--shadow);
  color: var(--ink);
  font-size: var(--text-sm);
}

.success {
  border-color: var(--success-color);
  background: var(--success-bg);
}

.error {
  border-color: var(--danger-color);
  background: var(--danger-bg);
}

.info {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.close {
  border: none;
  background: transparent;
  color: inherit;
  font-size: var(--text-lg);
  line-height: 1;
  padding: 0;
}
</style>
