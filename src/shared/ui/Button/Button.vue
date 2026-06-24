<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent-outline'
  size?: 'sm' | 'md' | 'lg'
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
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s,
    transform 0.15s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    @include focus-ring;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
}

.sm {
  min-height: var(--control-h-sm);
  padding: 0.4em 0.9em;
  font-size: var(--step--1);
}

.md {
  min-height: var(--control-h);
  padding: 0.45em 1.1em;
  font-size: var(--step-0);
}

.lg {
  min-height: var(--control-h);
  padding: 0.65em 1.35em;
  font-size: var(--step-0);
}

.primary {
  background: var(--accent);
  color: #fff;

  &:hover:not(:disabled) {
    background: var(--accent-hover);
  }
}

.secondary {
  background: var(--panel);
  color: var(--muted);
  border-color: var(--line);

  &:hover:not(:disabled) {
    color: var(--ink);
    background: var(--panel2);
  }
}

.ghost {
  background: transparent;
  color: var(--muted);

  &:hover:not(:disabled) {
    background: var(--panel2);
    color: var(--ink);
  }
}

.accent-outline {
  background: transparent;
  color: var(--accent);
  border-color: var(--accent);

  &:hover:not(:disabled) {
    background: var(--accent-soft);
  }
}

.danger {
  background: transparent;
  color: var(--faint);

  &:hover:not(:disabled) {
    color: var(--danger-color);
    background: var(--danger-bg);
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
