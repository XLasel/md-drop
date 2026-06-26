import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { updateProfileTheme } from '@/entities/user/api/profileRepository'
import { useAuthStore } from '@/entities/user/model/authStore'
import {
  type AppTheme,
  type ResolvedTheme,
  isThemePreference,
  resolveThemePreference,
  THEME_CYCLE_ORDER,
  THEME_STORAGE_KEY,
} from './types'

const THEME_TRANSITION_LOCK_CLASS = 'theme-changing'

let mediaQuery: MediaQueryList | null = null
let mediaListener: ((event: MediaQueryListEvent) => void) | null = null

function resolveStoredPreference(stored: string | null): AppTheme {
  if (stored && isThemePreference(stored)) return stored
  return 'system'
}

function unlockThemeTransitions() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove(THEME_TRANSITION_LOCK_CLASS)
    })
  })
}

function applyDomTheme(next: ResolvedTheme) {
  const root = document.documentElement
  root.classList.add(THEME_TRANSITION_LOCK_CLASS)
  root.setAttribute('data-theme', next)
  root.style.colorScheme = next
  void root.offsetHeight
  unlockThemeTransitions()
}

export const useThemeStore = defineStore('theme', () => {
  const preference = ref<AppTheme>('system')

  const resolved = computed<ResolvedTheme>(() => resolveThemePreference(preference.value))

  function unbindSystemListener() {
    if (mediaQuery && mediaListener) {
      mediaQuery.removeEventListener('change', mediaListener)
    }
    mediaQuery = null
    mediaListener = null
  }

  function bindSystemListener() {
    unbindSystemListener()
    if (preference.value !== 'system') return

    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaListener = () => {
      if (preference.value === 'system') {
        applyDomTheme(resolveThemePreference('system'))
      }
    }
    mediaQuery.addEventListener('change', mediaListener)
  }

  function applyPreference(next: AppTheme) {
    preference.value = next
    localStorage.setItem(THEME_STORAGE_KEY, next)
    applyDomTheme(resolveThemePreference(next))
    bindSystemListener()
  }

  function init() {
    preference.value = resolveStoredPreference(localStorage.getItem(THEME_STORAGE_KEY))
    applyDomTheme(resolveThemePreference(preference.value))
    bindSystemListener()
  }

  function cyclePreference() {
    const index = THEME_CYCLE_ORDER.indexOf(preference.value)
    const next = THEME_CYCLE_ORDER[(index + 1) % THEME_CYCLE_ORDER.length]
    applyPreference(next)
    void persistToProfile()
  }

  async function persistToProfile() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    await updateProfileTheme(authStore.user.id, preference.value)
  }

  function syncFromProfile(themePreference: string) {
    if (isThemePreference(themePreference)) {
      applyPreference(themePreference)
    }
  }

  return {
    preference,
    resolved,
    init,
    cyclePreference,
    syncFromProfile,
  }
})
