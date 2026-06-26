<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { usePageTransition } from '@/app/lib/usePageTransition'
import { useAuthStore } from '@/entities/user'
import { NewNoteButton } from '@/features/new-note'
import ToastContainer from '@/shared/ui/Toast/ToastContainer.vue'
import { AppHeader, PAGE_HEADER_ACTIONS_ID, PAGE_HEADER_START_ID } from '@/widgets/header'
import { AppSiteNav } from '@/widgets/site-nav'

const route = useRoute()
const { transitionName } = usePageTransition()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const showAuth = computed(() => {
  if (route.meta.header?.showAuth === false) return false
  if (route.name === 'dashboard') return !!user.value
  return true
})
</script>

<template>
  <div :class="$style.root">
    <AppHeader :show-auth="showAuth">
      <template #start>
        <div :id="PAGE_HEADER_START_ID" :class="$style.headerStartSlot" />
      </template>
      <NewNoteButton />
      <div :id="PAGE_HEADER_ACTIONS_ID" :class="$style.headerActionsSlot" />
    </AppHeader>

    <main :class="$style.main">
      <RouterView v-slot="{ Component, route: pageRoute }">
        <Transition :name="transitionName" :appear="false">
          <component :is="Component" :key="pageRoute.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <AppSiteNav />
    <ToastContainer />
  </div>
</template>

<style module lang="scss">
.root {
  min-height: 100%;
}

.headerStartSlot {
  display: contents;
}

.headerStartSlot > :global(*) {
  flex: none;
  min-width: 0;
}

.headerActionsSlot {
  display: contents;
}

.headerActionsSlot > :global(*) {
  flex: none;
}

.main {
  position: relative;
  overflow: visible;
  min-height: calc(100dvh - var(--header-height));
}
</style>
