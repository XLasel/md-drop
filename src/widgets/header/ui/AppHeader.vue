<script setup lang="ts">
import AuthButton from '@/features/auth/ui/AuthButton.vue'
import LanguageToggle from '@/features/language-toggle/ui/LanguageToggle.vue'
import ThemeToggle from '@/features/theme-toggle/ui/ThemeToggle.vue'
import AppLogo from '@/widgets/logo/ui/AppLogo.vue'

withDefaults(
  defineProps<{
    showAuth?: boolean
    maxWidth?: 'default' | 'narrow' | 'wide'
  }>(),
  {
    showAuth: true,
  },
)
</script>

<template>
  <header :class="$style.header">
    <div :class="[$style.inner, $style[maxWidth ?? 'default']]">
      <div :class="$style.start">
        <AppLogo to="/" />
        <slot name="start" />
      </div>

      <div :class="$style.actions">
        <slot />
        <AuthButton v-if="showAuth" />
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style module lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--header-blur-bg);
  backdrop-filter: blur(16px) saturate(1.1);
  padding: var(--header-pad-y) var(--header-pad-x);
}

.inner {
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-2xs);
  flex-wrap: nowrap;
}

.default,
.wide {
  max-width: var(--content-max-width);
}

.narrow {
  max-width: min(72.5rem, 100%);
}

.start {
  display: flex;
  align-items: center;
  gap: var(--gap-2xs);
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-3xs);
  flex: none;
  justify-content: flex-end;

  @include tablet {
    --icon-btn: var(--control-h-sm);
    gap: 0.25rem;
  }
}
</style>
