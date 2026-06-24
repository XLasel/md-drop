<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities/user/model/authStore'
import { isSupabaseConfigured } from '@/shared/api/supabase'
import CoreButton from '@/shared/ui/Button/CoreButton.vue'
import UiButton from '@/shared/ui/Button/UiButton.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { t } = useI18n()

const displayName = computed(() => authStore.getUserDisplayName())
const initial = computed(() => displayName.value?.charAt(0).toUpperCase() ?? '?')
</script>

<template>
  <div v-if="user" :class="$style.auth">
    <UiButton
      to="/dashboard"
      variant="ghost"
      size="sm"
      compact
      :aria-label="t('common.dashboard')"
    >
      <template #icon>▦</template>
      {{ t('common.dashboard') }}
    </UiButton>
    <CoreButton
      type="button"
      :class="$style.avatar"
      :title="user.email ?? t('common.signOut')"
      @click="authStore.signOut()"
    >
      {{ initial }}
    </CoreButton>
  </div>

  <UiButton
    v-else-if="isSupabaseConfigured()"
    to="/dashboard"
    variant="secondary"
    size="sm"
    compact
    :aria-label="t('common.signIn')"
    :class="$style.signIn"
  >
    <template #icon>→</template>
    {{ t('common.signIn') }}
  </UiButton>
</template>

<style module lang="scss">
.auth {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
}

.signIn {
  flex: none;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--control-h-sm);
  height: var(--control-h-sm);
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
