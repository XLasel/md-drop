import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { highlightCode } from './highlightCode'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

export async function renderMarkdown(source: string): Promise<string> {
  const rendered = md.render(source)
  const withHighlight = await applyCodeHighlight(rendered)
  return DOMPurify.sanitize(withHighlight, {
    ADD_ATTR: ['class', 'style', 'target', 'rel'],
  })
}

async function applyCodeHighlight(html: string): Promise<string> {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const blocks = doc.querySelectorAll('pre > code')

  for (const block of blocks) {
    const code = block.textContent ?? ''
    const className = block.className
    const langMatch = className.match(/language-(\w+)/)
    const lang = langMatch?.[1] ?? 'text'
    const highlighted = await highlightCode(code, lang)
    const wrapper = doc.createElement('div')
    wrapper.innerHTML = highlighted
    const pre = block.parentElement

    if (pre && wrapper.firstElementChild) {
      pre.replaceWith(wrapper.firstElementChild)
    }
  }

  return doc.body.innerHTML
}
