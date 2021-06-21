import { lazy } from 'react'
import type { RouteProps } from 'router/type'

import NotFound from 'pages/404'

const Dashboard = lazy(() => import(/** webpackChunkName: 'Dashboard */ 'pages/Dashboard'))

// 文件柜
const File = lazy(() => import(/** webpackChunkName: 'File' */ 'pages/File'))

const layoutRoutes: RouteProps[] = [
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
    path: '/file',
  },
  {
    path: '/file/:type',
    name: 'file',
    exact: true,
    component: File,
  },
  { component: NotFound },
]

export default layoutRoutes
