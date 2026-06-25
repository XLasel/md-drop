import { useRouter } from 'vue-router'
import { useEditorStore } from '@/entities/note'

export function useNewNote() {
  const router = useRouter()
  const editorStore = useEditorStore()

  async function startNewNote() {
    editorStore.reset()
    await router.push({ name: 'create', query: {} })
  }

  return { startNewNote }
}
