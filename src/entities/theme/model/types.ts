export type AppTheme = 'system' | 'light' | 'dark' | 'b-side'

export type ResolvedTheme = 'light' | 'dark' | 'b-side'

export const APP_THEMES: { value: AppTheme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'b-side', label: 'B-side' },
]

export const THEME_STORAGE_KEY = 'md-drop:theme'

export function isAppTheme(value: string): value is AppTheme {
  return APP_THEMES.some((theme) => theme.value === value)
}
