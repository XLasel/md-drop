<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities/user'
import { isSupabaseConfigured } from '@/shared/api/supabase'
import { CoreButton, UiButton } from '@/shared/ui/Button'
import {
  DropdownMenu,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/shared/ui/DropdownMenu'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { t } = useI18n()

const displayName = computed(() => authStore.getUserDisplayName())
const initial = computed(() => displayName.value?.charAt(0).toUpperCase() ?? '?')
const showEmail = computed(() => user.value?.email && displayName.value !== user.value.email)

async function handleSignOut() {
  await authStore.signOut()
}
</script>

<template>
  <div v-if="user" :class="$style.auth">
    <UiButton
      to="/dashboard"
      variant="ghost"
      size="sm"
      compact
      :class="$style.dashboard"
      :aria-label="t('common.dashboard')"
    >
      <template #icon>▦</template>
      {{ t('common.dashboard') }}
    </UiButton>

    <DropdownMenu>
      <template #trigger="{ open, toggle }">
        <CoreButton
          type="button"
          :class="$style.avatar"
          :aria-expanded="open"
          aria-haspopup="menu"
          :aria-label="displayName ?? t('common.signOut')"
          @click="toggle"
        >
          {{ initial }}
        </CoreButton>
      </template>

      <DropdownMenuHeader>
        <span v-if="displayName" :class="$style.menuName">{{ displayName }}</span>
        <span v-if="showEmail" :class="$style.menuEmail">{{ user.email }}</span>
      </DropdownMenuHeader>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleSignOut">
        {{ t('common.signOut') }}
      </DropdownMenuItem>
    </DropdownMenu>
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

.dashboard {
  @include mobile {
    display: none;
  }
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

  @include transition;

  &:hover {
    background: color-mix(in srgb, var(--accent-soft) 70%, var(--accent));
  }

  &[aria-expanded='true'] {
    background: color-mix(in srgb, var(--accent-soft) 55%, var(--accent));
  }
}

.menuName {
  font-size: var(--step--1);
  font-weight: 500;
  color: var(--ink);
  line-height: 1.3;
}

.menuEmail {
  font-size: var(--step--2);
  color: var(--muted);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
