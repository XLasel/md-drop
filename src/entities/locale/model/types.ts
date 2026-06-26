export type AppLocale = 'en' | 'ru'

export type LocalePreference = 'system' | AppLocale

export const APP_LOCALES: { value: AppLocale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
]

export const LOCALE_STORAGE_KEY = 'md-drop:locale'

export function isAppLocale(value: string): value is AppLocale {
  return APP_LOCALES.some((locale) => locale.value === value)
}

export function isLocalePreference(value: string): value is LocalePreference {
  return value === 'system' || isAppLocale(value)
}

export function detectBrowserLocale(): AppLocale {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]

  for (const lang of languages) {
    const code = lang.toLowerCase()
    if (code.startsWith('ru')) return 'ru'
    if (code.startsWith('en')) return 'en'
  }

  return 'en'
}

export function resolveLocalePreference(preference: LocalePreference): AppLocale {
  if (preference === 'system') return detectBrowserLocale()
  return preference
}
