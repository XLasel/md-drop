<script setup lang="ts">
withDefaults(
  defineProps<{
    maxWidth?: 'content' | 'reader'
  }>(),
  {
    maxWidth: 'content',
  },
)
</script>

<template>
  <div :class="[$style.bar, $style[maxWidth]]">
    <div v-if="$slots.start" :class="$style.start">
      <slot name="start" />
    </div>
    <div :class="$style.actions">
      <slot />
    </div>
  </div>
</template>

<style module lang="scss">
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 1rem;

  @include mobile {
    gap: 0.625rem 0.75rem;
  }
}

.content {
  @include layout-shell;
}

.reader {
  @include layout-shell(var(--reader-max-width));
}

.start {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1 1 auto;
}

.actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 0 1 auto;
  justify-content: flex-end;
  margin-left: auto;

  @include mobile {
    gap: 0.375rem;
  }
}
</style>
