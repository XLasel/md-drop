<script setup lang="ts">
defineProps<{
  lines?: number
}>()
</script>

<template>
  <div :class="$style.skeleton" aria-hidden="true">
    <div
      v-for="line in lines ?? 4"
      :key="line"
      :class="[$style.line, line === 1 ? $style.short : '']"
    />
  </div>
</template>

<style module lang="scss">
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.line {
  height: 1rem;
  border-radius: var(--radius-sm);
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;

  &.short {
    width: 60%;
    height: 1.5rem;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
