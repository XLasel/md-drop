import { getSupabase } from '@/shared/api/supabase'
import type { AppLocale, LocalePreference } from '@/entities/locale/model/types'
import { isAppLocale } from '@/entities/locale/model/types'
import type { AppTheme } from '@/entities/theme/model/types'
import { isAppTheme } from '@/entities/theme/model/types'

export interface Profile {
  id: string
  theme_preference: AppTheme
  locale_preference: LocalePreference
  updated_at: string
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('id, theme_preference, locale_preference, updated_at')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data) return null

  return data as Profile
}

export async function updateProfileTheme(userId: string, theme: AppTheme): Promise<void> {
  const supabase = getSupabase()
  if (!supabase || !isAppTheme(theme)) return

  await supabase.from('profiles').upsert({
    id: userId,
    theme_preference: theme,
    updated_at: new Date().toISOString(),
  })
}

export async function updateProfileLocale(userId: string, locale: AppLocale): Promise<void> {
  const supabase = getSupabase()
  if (!supabase || !isAppLocale(locale)) return

  await supabase.from('profiles').upsert({
    id: userId,
    locale_preference: locale,
    updated_at: new Date().toISOString(),
  })
}
