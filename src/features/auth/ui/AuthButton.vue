<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities/user/model/authStore'
import { isSupabaseConfigured } from '@/shared/api/supabase'
import CoreButton from '@/shared/ui/Button/CoreButton.vue'
import UiButton from '@/shared/ui/Button/UiButton.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { t } = useI18n()

const menuOpen = ref(false)
const menuRoot = ref<HTMLElement | null>(null)

const displayName = computed(() => authStore.getUserDisplayName())
const initial = computed(() => displayName.value?.charAt(0).toUpperCase() ?? '?')
const showEmail = computed(
  () => user.value?.email && displayName.value !== user.value.email,
)

function closeMenu() {
  menuOpen.value = false
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

async function handleSignOut() {
  closeMenu()
  await authStore.signOut()
}

onClickOutside(menuRoot, closeMenu)
onKeyStroke('Escape', () => {
  if (menuOpen.value) closeMenu()
})
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

    <div ref="menuRoot" :class="$style.menuWrap">
      <CoreButton
        type="button"
        :class="$style.avatar"
        :aria-expanded="menuOpen"
        aria-haspopup="menu"
        :aria-label="displayName ?? t('common.signOut')"
        @click="toggleMenu"
      >
        {{ initial }}
      </CoreButton>

      <div v-if="menuOpen" :class="$style.menu" role="menu">
        <div :class="$style.menuHeader">
          <span v-if="displayName" :class="$style.menuName">{{ displayName }}</span>
          <span v-if="showEmail" :class="$style.menuEmail">{{ user.email }}</span>
        </div>
        <div :class="$style.menuSeparator" role="separator" />
        <button
          type="button"
          role="menuitem"
          :class="$style.menuItem"
          @click="handleSignOut"
        >
          {{ t('common.signOut') }}
        </button>
      </div>
    </div>
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

.menuWrap {
  position: relative;
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
    background: color-mix(in srgb, var(--accent-soft) 70%, var(--accent));
  }

  &[aria-expanded='true'] {
    background: color-mix(in srgb, var(--accent-soft) 55%, var(--accent));
  }
}

.menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 50;
  min-width: 12rem;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--panel);
  box-shadow: var(--shadow-sm);
}

.menuHeader {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
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

.menuSeparator {
  height: 1px;
  margin: 4px 0;
  background: var(--line);
}

.menuItem {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: calc(var(--radius-md) - 2px);
  background: transparent;
  color: var(--ink);
  font-size: var(--step--1);
  text-align: left;
  cursor: pointer;

  &:hover {
    background: var(--panel2);
  }

  &:focus-visible {
    @include focus-ring;
  }
}
</style>
