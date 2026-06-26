import { createI18n } from 'vue-i18n'
import { formatRussianText } from '@/shared/lib/typography'
import en from './locales/en.json'
import ru from './locales/ru.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
  },
  postTranslation: (translated) => {
    if (typeof translated !== 'string') return translated
    return formatRussianText(translated)
  },
})
