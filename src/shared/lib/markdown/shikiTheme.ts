import type { ResolvedTheme } from '@/entities/theme/model/types'

const SHIKI_THEME_MAP: Record<ResolvedTheme, string> = {
  light: 'github-light',
  dark: 'dracula',
  'b-side': 'nord',
}

export type ShikiThemeKey = ResolvedTheme

export function getShikiTheme(theme: ResolvedTheme): string {
  return SHIKI_THEME_MAP[theme]
}
