const RUSSIAN_SHORT_WORDS = [
  'а',
  'без',
  'бы',
  'в',
  'во',
  'да',
  'до',
  'за',
  'и',
  'из',
  'к',
  'ко',
  'ли',
  'на',
  'не',
  'ни',
  'но',
  'о',
  'об',
  'от',
  'по',
  'под',
  'при',
  'про',
  'с',
  'со',
  'у',
  'же',
]

const RUSSIAN_SHORT_WORD_RE = new RegExp(
  `(^|[^А-Яа-яЁё])(${RUSSIAN_SHORT_WORDS.join('|')})([ \\t]+)(?=[А-Яа-яЁёA-Za-z0-9«])`,
  'giu',
)

export function formatRussianText(text: string): string {
  return text.replace(RUSSIAN_SHORT_WORD_RE, (_match, prefix: string, word: string) => {
    return `${prefix}${word}\u00a0`
  })
}
