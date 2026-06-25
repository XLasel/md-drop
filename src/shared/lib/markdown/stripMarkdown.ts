export function stripMarkdown(source: string): string {
  if (!source.trim()) return ''

  let text = source

  text = text.replace(/^```[^\n]*\n[\s\S]*?```$/gm, ' ')
  text = text.replace(/^\[\^[^\]]+\]:[\s\S]*?(?=\n\[|\n*$)/gm, ' ')
  text = text.replace(/^[-*_]{3,}\s*$/gm, ' ')

  const lines = text.split('\n').map(stripMarkdownLine).filter(Boolean)

  return lines.join(' ').replace(/\s+/g, ' ').trim()
}

export function stripMarkdownLine(line: string): string {
  let text = line.trim()

  if (!text) return ''
  if (/^[-*_]{3,}$/.test(text)) return ''
  if (/^```/.test(text)) return ''
  if (/^\[\^[^\]]+\]:/.test(text)) return ''

  text = text.replace(/^#{1,6}\s+/, '')
  text = text.replace(/^>\s?/, '')
  text = text.replace(/^[-*+]\s+\[[ xX]\]\s+/, '')
  text = text.replace(/^[-*+]\s+/, '')
  text = text.replace(/^\d+\.\s+/, '')

  text = stripMarkdownInline(text)

  return text.trim()
}

function stripMarkdownInline(text: string): string {
  let result = text

  result = result.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  result = result.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  result = result.replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
  result = result.replace(/<(https?:\/\/[^>]+)>/g, '$1')
  result = result.replace(/\[\^[^\]]+\]/g, '')
  result = result.replace(/\^\[([^\]]*)\]/g, '$1')
  result = result.replace(/~~([^~]+)~~/g, '$1')
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1')
  result = result.replace(/__([^_]+)__/g, '$1')
  result = result.replace(/\*([^*]+)\*/g, '$1')
  result = result.replace(/_([^_\s][^_]*[^_\s])_/g, '$1')
  result = result.replace(/_([^_\s])_/g, '$1')
  result = result.replace(/`([^`]+)`/g, '$1')
  result = result.replace(/<[^>]+>/g, '')

  return result
}
