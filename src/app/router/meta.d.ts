import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    header?: {
      maxWidth?: 'default' | 'narrow' | 'wide'
      showAuth?: boolean
    }
  }
}
