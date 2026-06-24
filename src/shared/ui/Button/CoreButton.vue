<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    href?: string
    as?: 'button' | 'span'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    type: 'button',
  },
)

const attrs = useAttrs()

const forwardedAttrs = computed(() => {
  const { onClick: _onClick, ...rest } = attrs as Record<string, unknown> & {
    onClick?: unknown
  }
  return rest
})

const tag = computed(() => {
  if (props.to != null) return RouterLink
  if (props.href != null) return 'a'
  return props.as ?? 'button'
})

const rootBind = computed(() => {
  if (props.to != null) {
    return {
      to: props.to,
      'aria-disabled': props.disabled || undefined,
      tabindex: props.disabled ? -1 : undefined,
    }
  }

  if (props.href != null) {
    return {
      href: props.href,
      'aria-disabled': props.disabled || undefined,
      tabindex: props.disabled ? -1 : undefined,
    }
  }

  if (props.as === 'span') {
    return {
      role: 'button',
      tabindex: props.disabled ? -1 : 0,
      'aria-disabled': props.disabled || undefined,
    }
  }

  return {
    type: props.type,
    disabled: props.disabled,
  }
})

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  const handler = attrs.onClick as
    | ((event: MouseEvent) => void)
    | Array<(event: MouseEvent) => void>
    | undefined

  if (!handler) return

  if (Array.isArray(handler)) {
    handler.forEach((listener) => listener(event))
    return
  }

  handler(event)
}
</script>

<template>
  <component :is="tag" v-bind="{ ...rootBind, ...forwardedAttrs }" @click="onClick">
    <slot />
  </component>
</template>
