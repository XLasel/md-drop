import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditorStore = defineStore('editor', () => {
  const title = ref('')
  const content = ref('')
  const indexable = ref(false)
  const editingSlug = ref<string | null>(null)

  function setTitle(value: string) {
    title.value = value
  }

  function setContent(value: string) {
    content.value = value
  }

  function setIndexable(value: boolean) {
    indexable.value = value
  }

  function startEditing(
    slug: string,
    noteTitle: string,
    noteContent: string,
    noteIndexable = false,
  ) {
    editingSlug.value = slug
    title.value = noteTitle
    content.value = noteContent
    indexable.value = noteIndexable
  }

  function reset() {
    title.value = ''
    content.value = ''
    indexable.value = false
    editingSlug.value = null
  }

  return {
    title,
    content,
    indexable,
    editingSlug,
    setTitle,
    setContent,
    setIndexable,
    startEditing,
    reset,
  }
})
