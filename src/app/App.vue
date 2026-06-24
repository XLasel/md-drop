<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/entities/user/model/authStore'
import {
  PAGE_HEADER_ACTIONS_ID,
  PAGE_HEADER_START_ID,
} from '@/widgets/header/lib/teleportTargets'
import ToastContainer from '@/shared/ui/Toast/ToastContainer.vue'
import AppHeader from '@/widgets/header/ui/AppHeader.vue'
import AppSiteNav from '@/widgets/site-nav/ui/AppSiteNav.vue'

const route = useRoute()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const headerMaxWidth = computed(
  () => route.meta.header?.maxWidth ?? 'default',
)

const showAuth = computed(() => {
  if (route.meta.header?.showAuth === false) return false
  if (route.name === 'dashboard') return !!user.value
  return true
})
</script>

<template>
  <div :class="$style.root">
    <AppHeader :max-width="headerMaxWidth" :show-auth="showAuth">
      <template #start>
        <div :id="PAGE_HEADER_START_ID" :class="$style.headerStartSlot" />
      </template>
      <div :id="PAGE_HEADER_ACTIONS_ID" :class="$style.headerActionsSlot" />
    </AppHeader>

    <main :class="$style.main">
      <RouterView />
    </main>

    <AppSiteNav />
    <ToastContainer />
  </div>
</template>

<style module lang="scss">
.root {
  min-height: 100%;
  padding-bottom: var(--site-nav-offset);
}

.headerStartSlot {
  display: flex;
  align-items: center;
  gap: var(--gap-s);
  min-width: 0;
}

.headerActionsSlot {
  display: flex;
  align-items: center;
  gap: var(--gap-xs);
  flex-wrap: wrap;
}

.main {
  min-height: 0;
}
</style>
