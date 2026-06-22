<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/entities/theme/model/themeStore'
import ToastContainer from '@/shared/ui/Toast/ToastContainer.vue'

const themeStore = useThemeStore()
const { resolved } = storeToRefs(themeStore)

const dataTheme = computed(() => resolved.value)

themeStore.init()
</script>

<template>
  <div :data-theme="dataTheme" :class="$style.root">
    <RouterView />
    <ToastContainer />
  </div>
</template>

<style module lang="scss">
.root {
  min-height: 100%;
  transition: background-color 0.2s ease, color 0.2s ease;
}
</style>
