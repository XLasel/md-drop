import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string
    header?: {
      maxWidth?: 'default' | 'narrow' | 'wide'
      showAuth?: boolean
    }
  }
}
