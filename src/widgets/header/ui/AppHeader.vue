<script setup lang="ts">
import AuthButton from '@/features/auth/ui/AuthButton.vue'
import LanguageToggle from '@/features/language-toggle/ui/LanguageToggle.vue'
import ThemeToggle from '@/features/theme-toggle/ui/ThemeToggle.vue'
import AppLogo from '@/widgets/logo/ui/AppLogo.vue'

withDefaults(
  defineProps<{
    showAuth?: boolean
  }>(),
  {
    showAuth: true,
  },
)
</script>

<template>
  <header :class="$style.header">
    <div :class="$style.inner">
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
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--header-height);
  background: var(--header-blur-bg);
  backdrop-filter: blur(16px) saturate(1.1);
}

.inner {
  @include layout-shell;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-2xs);
  flex-wrap: nowrap;
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
