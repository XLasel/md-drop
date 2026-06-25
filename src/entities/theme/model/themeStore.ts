import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { updateProfileTheme } from '@/entities/user/api/profileRepository'
import { useAuthStore } from '@/entities/user/model/authStore'
import {
  type AppTheme,
  type ResolvedTheme,
  isAppTheme,
  THEME_STORAGE_KEY,
} from './types'

export type ColorMode = 'light' | 'dark'

const THEME_TRANSITION_LOCK_CLASS = 'theme-changing'

function isColorMode(value: string): value is ColorMode {
  return value === 'light' || value === 'dark'
}

function normalizePreference(value: AppTheme): ColorMode {
  if (value === 'dark') return 'dark'
  if (value === 'light') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function unlockThemeTransitions() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove(THEME_TRANSITION_LOCK_CLASS)
    })
  })
}

function applyDomTheme(next: ColorMode) {
  const root = document.documentElement
  root.classList.add(THEME_TRANSITION_LOCK_CLASS)
  root.setAttribute('data-theme', next)
  root.style.colorScheme = next
  void root.offsetHeight
  unlockThemeTransitions()
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ColorMode>('light')

  const resolved = computed<ResolvedTheme>(() => mode.value)

  function applyMode(next: ColorMode) {
    mode.value = next
    localStorage.setItem(THEME_STORAGE_KEY, next)
    applyDomTheme(next)
  }

  function init() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)

    if (stored && isColorMode(stored)) {
      mode.value = stored
    } else if (stored && isAppTheme(stored)) {
      mode.value = normalizePreference(stored)
    }

    applyDomTheme(mode.value)
  }

  function toggleMode() {
    applyMode(mode.value === 'light' ? 'dark' : 'light')
    void persistToProfile()
  }

  function setMode(next: ColorMode) {
    applyMode(next)
    void persistToProfile()
  }

  async function persistToProfile() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    await updateProfileTheme(authStore.user.id, mode.value)
  }

  function syncFromProfile(themePreference: string) {
    if (isColorMode(themePreference)) {
      applyMode(themePreference)
      return
    }

    if (isAppTheme(themePreference)) {
      applyMode(normalizePreference(themePreference))
    }
  }

  return {
    mode,
    resolved,
    init,
    toggleMode,
    setMode,
    syncFromProfile,
  }
})
