import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { ref } from 'vue'
import { getSupabase } from '@/shared/api/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  async function init() {
    const supabase = getSupabase()
    if (!supabase) {
      loading.value = false
      return
    }

    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
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

  return {
    user,
    loading,
    init,
    signInWithGitHub,
    signInWithGoogle,
    signOut,
  }
})
