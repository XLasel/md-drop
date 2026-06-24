<script setup lang="ts">
import { RouterLink } from 'vue-router'
import UiButton from '@/shared/ui/Button/Button.vue'
</script>

<template>
  <div :class="$style.page">
    <main :class="$style.main">
      <div :class="$style.content">
        <div :class="$style.code">404</div>
        <h1 :class="$style.title">Page not found</h1>
        <p :class="$style.description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <RouterLink to="/">
          <UiButton>Go home</UiButton>
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<style module lang="scss">
.page {
  min-height: 100vh;
  background: var(--bg);
}

.main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-height));
  padding: 2rem 1rem;
}

.content {
  text-align: center;
  max-width: 28rem;
}

.code {
  font-size: 4rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 1rem;
}

.title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: var(--ink);
}

.description {
  margin: 0 0 1.5rem;
  color: var(--muted);
}
</style>
