export async function formatMarkdown(content: string): Promise<string> {
  const response = await fetch('/api/format', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })

  const data = (await response.json()) as { content?: string; error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to format markdown')
  }

  if (!data.content) {
    throw new Error('Empty response from formatter')
  }

  return data.content
}
