<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import CoreButton from './CoreButton.vue'

const props = withDefaults(
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
    iconPosition?: 'start' | 'end'
    animated?: boolean
  }>(),
  {
    iconPosition: 'start',
    animated: false,
  },
)

const slots = useSlots()

const isAnimated = computed(
  () =>
    props.animated &&
    Boolean(slots.icon) &&
    !props.loading &&
    !props.disabled &&
    !props.compact,
)
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
      isAnimated && $style.animated,
      isAnimated && iconPosition === 'end' && $style.iconEnd,
      isAnimated && iconPosition === 'start' && $style.iconStart,
    ]"
    :aria-label="ariaLabel"
  >
    <span v-if="loading" :class="$style.spinner" aria-hidden="true" />

    <template v-if="isAnimated">
      <span
        :class="[$style.iconReveal, $style.revealStart]"
        aria-hidden="true"
      >
        <slot name="icon" />
      </span>
      <span v-if="$slots.default" :class="[$style.label, $style.inner]">
          <slot />
      </span>
      <span
        :class="[$style.iconReveal, $style.revealEnd]"
        aria-hidden="true"
      >
        <slot name="icon" />
      </span>
    </template>

    <template v-else>
      <span v-if="$slots.icon" :class="$style.icon" aria-hidden="true">
        <slot name="icon" />
      </span>
      <span v-if="$slots.default" :class="$style.label">
        <slot />
      </span>
    </template>
  </CoreButton>
</template>

<style module lang="scss">
.button {
  --btn-hover-duration: 0.4s;
  --btn-hover-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --btn-icon-shift: calc(1em + 0.5rem);

  --btn-shift: 1.35em;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  padding-inline: var(--btn-shift);
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

  .revealStart {
    inset-inline-start: var(--btn-shift);
  }

  .revealEnd {
    inset-inline-end: var(--btn-shift);
  }
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.animated {
  position: relative;
  overflow: hidden;
}

.inner {
  transform: translateX(0);
  transition: transform var(--btn-hover-duration) var(--btn-hover-ease);
}

.iconReveal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition:
    transform var(--btn-hover-duration) var(--btn-hover-ease),
    opacity 0.3s ease;
}

.iconStart {
  .revealEnd {
    position: absolute;
    transform: translateX(calc(100% + var(--btn-shift)));
  }
}

.iconEnd {
  .revealStart {
    position: absolute;
    transform: translateX(calc(-1 * 100% - var(--btn-shift)))
  }
}

.iconStart:hover:not(:disabled):not([aria-disabled='true']) {
  .inner {
    scale: 0.95;
    transform: translateX(calc(-1 * var(--btn-shift) * 1.35));
  }

  .revealEnd {
    transform: translate(0);
  }

  .revealStart {
    transform: translate(calc(-1 * 100% - var(--btn-shift)));
  }
}

.iconEnd:hover:not(:disabled):not([aria-disabled='true']) {
  
  .inner {
    scale: 0.95;
    transform: translateX(calc(var(--btn-shift) * 1.35));
  }

  .revealStart {
    transform: translate(0);
  }

  .revealEnd {
    transform: translate(calc(100% + var(--btn-shift)));
  }
}

@media (prefers-reduced-motion: reduce) {
  .inner,
  .iconReveal {
    transition: none;
  }

  .iconStart:hover:not(:disabled):not([aria-disabled='true']) .inner,
  .iconEnd:hover:not(:disabled):not([aria-disabled='true']) .inner {
    transform: none;
  }

  .iconStart:hover:not(:disabled):not([aria-disabled='true']) .revealStart,
  .iconEnd:hover:not(:disabled):not([aria-disabled='true']) .revealEnd {
    transform: translateY(-50%);
    opacity: 1;
  }

  .revealStart {
    transform: translateY(-50%);
    opacity: 1;
  }

  .revealEnd {
    transform: translateY(-50%);
    opacity: 1;
  }
}

.compact {
  @include mobile {
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
  --btn-shift: 0.9em;
  min-height: var(--control-h-sm);
  padding-block: 0.4em;
  font-size: var(--step--1);  
}

.md {
  --btn-shift: 1.1em;
  min-height: var(--control-h);
  padding-block: 0.45em;
  font-size: var(--step-0);

}

.lg {
  --btn-shift: 1.35em;
  min-height: var(--control-h);
  padding-block: 0.65em;
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
