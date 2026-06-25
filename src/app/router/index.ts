import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from '@/shared/i18n'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/landing/ui/LandingPage.vue'),
      meta: {
        titleKey: 'meta.landing',
      },
    },
    {
      path: '/write',
      name: 'create',
      component: () => import('@/pages/create/ui/CreatePage.vue'),
      meta: { titleKey: 'meta.create' },
    },
    {
      path: '/v/:slug',
      name: 'view',
      component: () => import('@/pages/view/ui/ViewPage.vue'),
      meta: {
        titleKey: 'meta.view',
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/dashboard/ui/DashboardPage.vue'),
      meta: {
        titleKey: 'meta.dashboard',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/ui/NotFoundPage.vue'),
      meta: {
        titleKey: 'meta.notFound',
        header: { showAuth: false },
      },
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const titleKey = to.meta.titleKey as string | undefined
  document.title = titleKey ? i18n.global.t(titleKey) : i18n.global.t('meta.default')
})

export default router
