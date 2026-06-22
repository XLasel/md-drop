<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :class="[$style.button, $style[variant ?? 'primary'], $style[size ?? 'md']]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" :class="$style.spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style module lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-weight: 500;
  transition: background 0.15s, border-color 0.15s, color 0.15s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    @include focus-ring;
  }
}

.sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.md {
  padding: 0.5rem 1rem;
  font-size: 0.9375rem;
}

.primary {
  background: var(--accent-color);
  color: var(--bg-primary);

  &:hover:not(:disabled) {
    background: var(--accent-hover);
  }
}

.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);

  &:hover:not(:disabled) {
    background: var(--bg-tertiary);
  }
}

.ghost {
  background: transparent;
  color: var(--text-secondary);

  &:hover:not(:disabled) {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
}

.danger {
  background: var(--danger-bg);
  color: var(--danger-color);
  border-color: transparent;

  &:hover:not(:disabled) {
    background: var(--danger-color);
    color: var(--bg-primary);
  }
}

.spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
