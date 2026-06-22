import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NoteTheme } from './types'

export const useEditorStore = defineStore('editor', () => {
  const content = ref('')
  const theme = ref<NoteTheme>('github')
  const editingSlug = ref<string | null>(null)

  function setContent(value: string) {
    content.value = value
  }

  function setTheme(value: NoteTheme) {
    theme.value = value
  }

  function startEditing(slug: string, noteContent: string, noteTheme: NoteTheme) {
    editingSlug.value = slug
    content.value = noteContent
    theme.value = noteTheme
  }

  function reset() {
    content.value = ''
    theme.value = 'github'
    editingSlug.value = null
  }

  return {
    content,
    theme,
    editingSlug,
    setContent,
    setTheme,
    startEditing,
    reset,
  }
})
