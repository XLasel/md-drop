export const config = {
  runtime: 'edge',
}

const MAX_CONTENT_LENGTH = 10_000
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 10

const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS)

  if (timestamps.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, timestamps)
    return true
  }

  timestamps.push(now)
  requestLog.set(ip, timestamps)
  return false
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return Response.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 })
  }

  let body: { content?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const content = body.content?.trim()
  if (!content) {
    return Response.json({ error: 'Content is required' }, { status: 400 })
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return Response.json({ error: 'Content is too long (max 10 KB)' }, { status: 400 })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'AI formatting is not configured. Set OPENROUTER_API_KEY.' },
      { status: 503 },
    )
  }

  const model = process.env.OPENROUTER_MODEL ?? 'google/gemini-2.0-flash-001'

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.VERCEL_URL ?? 'http://localhost:5173',
      'X-Title': 'MD-Drop',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'Improve markdown structure: headings, lists, code blocks. Do not change meaning. Return only markdown.',
        },
        { role: 'user', content },
      ],
      temperature: 0.2,
    }),
  })

  if (!response.ok) {
    return Response.json({ error: 'AI provider request failed' }, { status: 502 })
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }

  const formatted = data.choices?.[0]?.message?.content?.trim()
  if (!formatted) {
    return Response.json({ error: 'Empty AI response' }, { status: 502 })
  }

  return Response.json({ content: formatted })
}
