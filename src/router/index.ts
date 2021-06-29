import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Login from '@/pages/Login/index.vue'
import Layout from '@/components/Layout/index.vue'
import notFound from '@/pages/404/index.vue'
import LayoutRoutes from './layout'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: { name: 'index' },
    meta: {
      title: 'index',
    },
    children: LayoutRoutes,
  },
  {
    path: '/404',
    name: '404',
    component: notFound,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
