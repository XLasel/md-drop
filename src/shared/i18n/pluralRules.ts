/** Slavic plural rule (vue-i18n): 0 | one | few | many */
export function russianPluralRule(choice: number, choicesLength: number): number {
  const n = Math.abs(choice)

  if (n === 0) return 0

  const teen = n > 10 && n < 20
  const endsWithOne = n % 10 === 1

  if (choicesLength === 2) {
    return !teen && endsWithOne ? 0 : 1
  }

  if (!teen && endsWithOne) return 1
  if (!teen && n % 10 >= 2 && n % 10 <= 4) return 2

  return choicesLength < 4 ? 2 : 3
}
