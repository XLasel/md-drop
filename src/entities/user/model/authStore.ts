import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { ref } from 'vue'
import { useLocaleStore } from '@/entities/locale/model/localeStore'
import { useThemeStore } from '@/entities/theme/model/themeStore'
import { fetchProfile } from '@/entities/user/api/profileRepository'
import { getSupabase } from '@/shared/api/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  async function syncProfile(userId: string) {
    const profile = await fetchProfile(userId)
    if (!profile) return

    if (profile.theme_preference) {
      useThemeStore().syncFromProfile(profile.theme_preference)
    }

    if (profile.locale_preference) {
      useLocaleStore().syncFromProfile(profile.locale_preference)
    }
  }

  async function init() {
    const supabase = getSupabase()
    if (!supabase) {
      loading.value = false
      return
    }

    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null

    if (user.value) {
      await syncProfile(user.value.id)
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null

      if (session?.user) {
        await syncProfile(session.user.id)
      }
    })

    loading.value = false
  }

  async function signInWithGitHub() {
    const supabase = getSupabase()
    if (!supabase) return

    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  async function signInWithGoogle() {
    const supabase = getSupabase()
    if (!supabase) return

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  async function signOut() {
    const supabase = getSupabase()
    if (!supabase) return

    await supabase.auth.signOut()
    user.value = null
  }

  function getUserDisplayName(): string | null {
    if (!user.value) return null

    return (
      user.value.user_metadata?.full_name ??
      user.value.user_metadata?.name ??
      user.value.user_metadata?.user_name ??
      user.value.email ??
      null
    )
  }

  return {
    user,
    loading,
    init,
    signInWithGitHub,
    signInWithGoogle,
    signOut,
    getUserDisplayName,
  }
})
