<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import CoreButton from './CoreButton.vue'

defineProps<{
  to?: RouteLocationRaw
  href?: string
  as?: 'button' | 'span'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent-outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  compact?: boolean
  ariaLabel?: string
}>()
</script>

<template>
  <CoreButton
    :to="to"
    :href="href"
    :as="as"
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    :class="[
      $style.button,
      $style[variant ?? 'primary'],
      $style[size ?? 'md'],
      compact && $style.compact,
    ]"
    :aria-label="ariaLabel"
  >
    <span v-if="loading" :class="$style.spinner" aria-hidden="true" />
    <span v-if="$slots.icon" :class="$style.icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span v-if="$slots.default" :class="$style.label">
      <slot />
    </span>
  </CoreButton>
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
  text-decoration: none;
  @include transition-interactive;

  &[aria-disabled='true'] {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    @include focus-ring;
  }

  &:active:not(:disabled):not([aria-disabled='true']) {
    transform: scale(0.98);
  }
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-family: var(--font-mono);
}

.compact {
  @include tablet {
    gap: 0;
    min-width: var(--control-h-sm);
    width: var(--control-h-sm);
    padding: 0;

    .label {
      display: none;
    }
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
  color: var(--on-accent);

  &:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--accent-hover);
  }
}

.secondary {
  background: var(--panel);
  color: var(--muted);
  border-color: var(--line2);

  &:hover:not(:disabled):not([aria-disabled='true']) {
    color: var(--ink);
    background: var(--panel2);
  }
}

.ghost {
  background: transparent;
  color: var(--muted);

  &:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--panel2);
    color: var(--ink);
  }
}

.accent-outline {
  background: transparent;
  color: var(--accent);
  border-color: var(--accent);

  &:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--accent-soft);
  }
}

.danger {
  background: transparent;
  color: var(--faint);

  &:hover:not(:disabled):not([aria-disabled='true']) {
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
