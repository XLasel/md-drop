<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/entities/user/model/authStore'
import { isSupabaseConfigured } from '@/shared/api/supabase'
import UiButton from '@/shared/ui/Button/Button.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const displayName = computed(() => authStore.getUserDisplayName())
</script>

<template>
  <div v-if="user" :class="$style.auth">
    <span :class="$style.name" :title="user.email ?? undefined">{{ displayName }}</span>
    <RouterLink to="/dashboard">
      <UiButton variant="ghost" size="sm">Dashboard</UiButton>
    </RouterLink>
    <UiButton variant="ghost" size="sm" @click="authStore.signOut()">Sign out</UiButton>
  </div>

  <div v-else-if="isSupabaseConfigured()" :class="$style.auth">
    <UiButton variant="ghost" size="sm" @click="authStore.signInWithGitHub()">
      GitHub
    </UiButton>
    <UiButton variant="ghost" size="sm" @click="authStore.signInWithGoogle()">
      Google
    </UiButton>
  </div>
</template>

<style module lang="scss">
.auth {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.name {
  max-width: 8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  padding: 0 0.25rem;
}
</style>
