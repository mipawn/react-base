import { lazy } from 'react'
import type { RouteProps } from './type'

const NotFound = lazy(() => import(/* webpackChunkName: '404' */ '../pages/404'))
const Login = lazy(() => import(/* webpackChunkName: 'Login' */ '../pages/Login'))
const Layout = lazy(() => import(/* webpackChunkName: 'Layout' */ '../layout/AuthLayout'))
const Dashboard = lazy(() => import(/** webpackChunkName: 'Dashboard */ '../pages/Dashboard'))

// 文件柜
const File = lazy(() => import(/** webpackChunkName: 'File' */ '../pages/File'))

export const routes: RouteProps[] = [
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/404',
    component: NotFound,
    exact: true,
  },
  {
    path: '/',
    component: Layout,
    children: [ // 主要页面路由
      {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        exact: true,
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        exact: true,
      },
      {
        path: '/file/:type',
        name: 'file',
        exact: true,
        component: File,
      },
      { component: NotFound },
    ],
  },
]

export default routes
