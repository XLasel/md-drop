import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/landing/ui/LandingPage.vue'),
      meta: {
        title: 'MD-Drop — Write it. Drop a link.',
        header: { maxWidth: 'narrow' },
      },
    },
    {
      path: '/write',
      name: 'create',
      component: () => import('@/pages/create/ui/CreatePage.vue'),
      meta: { title: 'Write — MD-Drop' },
    },
    {
      path: '/v/:slug',
      name: 'view',
      component: () => import('@/pages/view/ui/ViewPage.vue'),
      meta: {
        title: 'View — MD-Drop',
        header: { maxWidth: 'narrow' },
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/dashboard/ui/DashboardPage.vue'),
      meta: {
        title: 'Dashboard — MD-Drop',
        header: { maxWidth: 'narrow' },
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/ui/NotFoundPage.vue'),
      meta: {
        title: 'Not Found — MD-Drop',
        header: { maxWidth: 'narrow', showAuth: false },
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
  const title = (to.meta.title as string | undefined) ?? 'MD-Drop'
  document.title = title
})

export default router
