<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/entities/user/model/authStore'
import { isSupabaseConfigured } from '@/shared/api/supabase'
import UiButton from '@/shared/ui/Button/Button.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>

<template>
  <div v-if="user" :class="$style.auth">
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
</style>
