import { onScopeDispose, ref } from 'vue'
import type { RouteRecordNameGeneric } from 'vue-router'
import router from '@/app/router'

/** landing → write → dashboard → note */
const ROUTE_ORDER = {
  landing: 0,
  create: 1,
  dashboard: 2,
  view: 3,
} as const

export type PageRouteName = keyof typeof ROUTE_ORDER

export type PageTransitionName = 'slide-forward' | 'slide-back'

function getRouteDepth(name: RouteRecordNameGeneric | null | undefined): number | null {
  if (typeof name !== 'string' || !(name in ROUTE_ORDER)) return null
  return ROUTE_ORDER[name as PageRouteName]
}

export function usePageTransition() {
  const transitionName = ref<PageTransitionName | undefined>(undefined)

  const removeGuard = router.beforeEach((to, from) => {
    if (!from.name) {
      transitionName.value = undefined
      return true
    }

    const toDepth = getRouteDepth(to.name)
    const fromDepth = getRouteDepth(from.name)

    if (toDepth === null || fromDepth === null || toDepth === fromDepth) {
      transitionName.value = undefined
      return true
    }

    transitionName.value = toDepth > fromDepth ? 'slide-forward' : 'slide-back'
    return true
  })

  onScopeDispose(removeGuard)

  return { transitionName }
}
