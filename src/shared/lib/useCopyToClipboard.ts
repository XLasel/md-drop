import { useClipboard } from '@vueuse/core'
import { useToast } from '@/shared/lib/toast'

export function useCopyToClipboard() {
  const { copy, copied } = useClipboard()
  const toast = useToast()

  async function copyText(text: string, successMessage = 'Copied to clipboard') {
    await copy(text)

    if (copied.value) {
      toast.success(successMessage)
    } else {
      toast.error('Failed to copy')
    }
  }

  return { copyText, copied }
}
