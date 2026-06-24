export type AppTheme = 'system' | 'light' | 'dark'

export type ResolvedTheme = 'light' | 'dark'

export const APP_THEMES: { value: AppTheme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export const THEME_STORAGE_KEY = 'md-drop:theme'

export function isAppTheme(value: string): value is AppTheme {
  return APP_THEMES.some((theme) => theme.value === value)
}
