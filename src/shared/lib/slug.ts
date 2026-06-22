const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

export function generateSlug(length = 8): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => SLUG_CHARS[byte % SLUG_CHARS.length]).join('')
}

export function generateEditToken(length = 32): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
