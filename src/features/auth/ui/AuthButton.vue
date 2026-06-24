<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities/user/model/authStore'
import { isSupabaseConfigured } from '@/shared/api/supabase'
import UiButton from '@/shared/ui/Button/Button.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { t } = useI18n()

const displayName = computed(() => authStore.getUserDisplayName())
const initial = computed(() => displayName.value?.charAt(0).toUpperCase() ?? '?')
</script>

<template>
  <div v-if="user" :class="$style.auth">
    <RouterLink to="/dashboard">
      <UiButton variant="ghost" size="sm">{{ t('common.dashboard') }}</UiButton>
    </RouterLink>
    <button
      type="button"
      :class="$style.avatar"
      :title="user.email ?? t('common.signOut')"
      @click="authStore.signOut()"
    >
      {{ initial }}
    </button>
  </div>

  <RouterLink v-else-if="isSupabaseConfigured()" to="/dashboard" :class="$style.signInLink">
    <UiButton variant="secondary" size="sm">{{ t('common.signIn') }}</UiButton>
  </RouterLink>
</template>

<style module lang="scss">
.auth {
  display: flex;
  align-items: center;
  gap: 6px;
}

.signInLink {
  text-decoration: none;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  flex: none;

  &:hover {
    background: color-mix(in oklch, var(--accent-soft) 70%, var(--accent));
  }
}
</style>
