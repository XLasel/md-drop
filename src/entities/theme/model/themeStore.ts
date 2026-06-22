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

function getSystemResolved(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const preference = ref<AppTheme>('system')
  const systemDark = ref(getSystemResolved() === 'dark')

  const resolved = computed<ResolvedTheme>(() => {
    if (preference.value === 'system') {
      return systemDark.value ? 'dark' : 'light'
    }
    return preference.value
  })

  function init() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && isAppTheme(stored)) {
      preference.value = stored
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = media.matches
    media.addEventListener('change', (event) => {
      systemDark.value = event.matches
    })
  }

  async function setPreference(theme: AppTheme) {
    preference.value = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)

    const authStore = useAuthStore()
    if (authStore.user) {
      await updateProfileTheme(authStore.user.id, theme)
    }
  }

  function syncFromProfile(themePreference: string) {
    if (!isAppTheme(themePreference)) return
    preference.value = themePreference
    localStorage.setItem(THEME_STORAGE_KEY, themePreference)
  }

  return {
    preference,
    resolved,
    init,
    setPreference,
    syncFromProfile,
  }
})
