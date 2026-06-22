import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'create',
      component: () => import('@/pages/create/ui/CreatePage.vue'),
      meta: { title: 'Create — MD-Drop' },
    },
    {
      path: '/v/:slug',
      name: 'view',
      component: () => import('@/pages/view/ui/ViewPage.vue'),
      meta: { title: 'View — MD-Drop' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/dashboard/ui/DashboardPage.vue'),
      meta: { title: 'Dashboard — MD-Drop' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/ui/NotFoundPage.vue'),
      meta: { title: 'Not Found — MD-Drop' },
    },
  ],
})

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? 'MD-Drop'
  document.title = title
})

export default router
