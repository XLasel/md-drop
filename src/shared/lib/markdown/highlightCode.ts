import type { BundledLanguage, Highlighter } from 'shiki'
import { createHighlighter } from 'shiki'

const CORE_LANGS = [
  'javascript',
  'typescript',
  'vue',
  'json',
  'bash',
  'css',
  'html',
] as const satisfies readonly BundledLanguage[]

const ON_DEMAND_LANGS = [
  'python',
  'scss',
  'yaml',
  'sql',
  'markdown',
  'diff',
  'rust',
  'go',
  'ruby',
  'xml',
  'docker',
  'toml',
  'php',
  'java',
  'csharp',
  'cpp',
  'kotlin',
  'swift',
] as const satisfies readonly BundledLanguage[]

const THEMES = ['github-light', 'dracula'] as const

const LANG_ALIASES: Record<string, BundledLanguage | 'text'> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  rs: 'rust',
  rb: 'ruby',
  cs: 'csharp',
  dockerfile: 'docker',
  htm: 'html',
  text: 'text',
  plain: 'text',
  txt: 'text',
  plaintext: 'text',
}

const BUNDLED_LANGS = new Set<string>([...CORE_LANGS, ...ON_DEMAND_LANGS])

let highlighterPromise: Promise<Highlighter> | null = null
const loadingLangs = new Map<string, Promise<void>>()

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [...THEMES],
      langs: [...CORE_LANGS],
    })
  }

  return highlighterPromise
}

export async function highlightCode(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter()
  const language = normalizeLang(lang)

  if (language === 'text') {
    return highlightPlain(highlighter, code)
  }

  if (!BUNDLED_LANGS.has(language)) {
    return fallbackCodeBlock(code)
  }

  try {
    await ensureLanguageLoaded(highlighter, language)

    return highlighter.codeToHtml(code, {
      lang: language as BundledLanguage,
      themes: {
        light: 'github-light',
        dark: 'dracula',
      },
      defaultColor: 'light-dark()',
    })
  } catch {
    return fallbackCodeBlock(code)
  }
}

async function ensureLanguageLoaded(highlighter: Highlighter, lang: string): Promise<void> {
  const resolved = highlighter.resolveLangAlias(lang)

  if (highlighter.getLoadedLanguages().includes(resolved)) {
    return
  }

  const pending = loadingLangs.get(resolved)

  if (pending) {
    await pending
    return
  }

  const loadPromise = highlighter.loadLanguage(lang as BundledLanguage)
  loadingLangs.set(resolved, loadPromise)

  try {
    await loadPromise
  } finally {
    loadingLangs.delete(resolved)
  }
}

function highlightPlain(highlighter: Highlighter, code: string): string {
  return highlighter.codeToHtml(code, {
    lang: 'text',
    themes: {
      light: 'github-light',
      dark: 'dracula',
    },
    defaultColor: 'light-dark()',
  })
}

function normalizeLang(lang: string): string {
  const normalized = lang.trim().toLowerCase()
  return LANG_ALIASES[normalized] ?? normalized
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
