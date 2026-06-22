import type { BundledLanguage, BundledTheme, Highlighter } from 'shiki'
import { createHighlighter } from 'shiki'
import type { ResolvedTheme } from '@/entities/theme/model/types'
import { getShikiTheme } from './shikiTheme'

const LANGS = ['javascript', 'typescript', 'vue', 'json', 'bash'] as const satisfies readonly BundledLanguage[]
const THEMES: BundledTheme[] = ['github-light', 'dracula', 'nord']

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: THEMES,
      langs: [...LANGS],
    })
  }

  return highlighterPromise
}

const SUPPORTED_LANGS = new Set<string>(LANGS)

export async function highlightCode(
  code: string,
  lang: string,
  theme: ResolvedTheme = 'light',
): Promise<string> {
  const highlighter = await getHighlighter()
  const shikiTheme = getShikiTheme(theme) as BundledTheme
  const language = normalizeLang(lang)

  if (!SUPPORTED_LANGS.has(language)) {
    return fallbackCodeBlock(code)
  }

  try {
    return highlighter.codeToHtml(code, {
      lang: language as BundledLanguage,
      theme: shikiTheme,
    })
  } catch {
    return fallbackCodeBlock(code)
  }
}

function normalizeLang(lang: string): string {
  const normalized = lang.trim().toLowerCase()

  const aliases: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    sh: 'bash',
    shell: 'bash',
  }

  return aliases[normalized] ?? normalized
}

function fallbackCodeBlock(code: string): string {
  return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
