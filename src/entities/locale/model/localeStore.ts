import { defineStore } from 'pinia'
import { ref } from 'vue'
import { updateProfileLocale } from '@/entities/user/api/profileRepository'
import { useAuthStore } from '@/entities/user/model/authStore'
import { i18n } from '@/shared/i18n'
import router from '@/app/router'
import {
  type AppLocale,
  detectBrowserLocale,
  isAppLocale,
  isLocalePreference,
  LOCALE_STORAGE_KEY,
  resolveLocalePreference,
} from './types'

function applyDomLocale(locale: AppLocale) {
  document.documentElement.lang = locale
  i18n.global.locale.value = locale
}

function updateDocumentTitle() {
  const route = router.currentRoute.value
  const titleKey = route.meta.titleKey as string | undefined

  if (titleKey) {
    document.title = i18n.global.t(titleKey)
    return
  }

  document.title = i18n.global.t('meta.default')
}

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<AppLocale>('en')

  function applyLocale(next: AppLocale) {
    locale.value = next
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
    applyDomLocale(next)
    updateDocumentTitle()
  }

  function init() {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)

    if (stored && isAppLocale(stored)) {
      locale.value = stored
    } else {
      locale.value = detectBrowserLocale()
    }

    applyDomLocale(locale.value)
  }

  function toggleLocale() {
    applyLocale(locale.value === 'en' ? 'ru' : 'en')
    void persistToProfile()
  }

  async function persistToProfile() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    await updateProfileLocale(authStore.user.id, locale.value)
  }

  function syncFromProfile(localePreference: string) {
    if (isLocalePreference(localePreference)) {
      applyLocale(resolveLocalePreference(localePreference))
    }
  }

  return {
    locale,
    init,
    toggleLocale,
    syncFromProfile,
  }
})
