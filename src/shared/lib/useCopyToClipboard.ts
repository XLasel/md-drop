import { useClipboard } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/lib/toast'

export function useCopyToClipboard() {
  const { copy, copied } = useClipboard()
  const toast = useToast()
  const { t } = useI18n()

  async function copyText(text: string, successMessage?: string) {
    await copy(text)

    if (copied.value) {
      toast.success(successMessage ?? t('clipboard.copied'))
    } else {
      toast.error(t('clipboard.failed'))
    }
  }

  return { copyText, copied }
}
