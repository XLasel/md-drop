export function setRobotsMeta(indexable: boolean): void {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]')

  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'robots'
    document.head.appendChild(meta)
  }

  meta.content = indexable ? 'index, follow' : 'noindex, nofollow'
}

export function setPageMeta(options: {
  title: string
  description?: string
  indexable: boolean
}): void {
  document.title = options.title
  setRobotsMeta(options.indexable)

  setMetaProperty('og:title', options.title)
  setMetaProperty('og:type', 'article')

  if (options.description) {
    setMetaName('description', options.description)
    setMetaProperty('og:description', options.description)
  }
}

function setMetaName(name: string, content: string): void {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)

  if (!meta) {
    meta = document.createElement('meta')
    meta.name = name
    document.head.appendChild(meta)
  }

  meta.content = content
}

function setMetaProperty(property: string, content: string): void {
  let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }

  meta.content = content
}

import { i18n } from '@/shared/i18n'

export function resetPageMeta(): void {
  document.title = i18n.global.t('meta.default')
  setRobotsMeta(false)
}
