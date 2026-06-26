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
  padding: 8px 10px;
}
</style>
