<template>
  <div :class="$style.header">
    <slot />
  </div>
</template>

<style module lang="scss">
.header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-2xs);
}
</style>
