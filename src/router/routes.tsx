import { lazy } from 'react'
import NotFound from 'pages/404'
import type { RouteProps } from './type'

const Login = lazy(() => import(/* webpackChunkName: 'Login' */ '../pages/Login'))
const Layout = lazy(() => import(/* webpackChunkName: 'Layout' */ '../layout/AuthLayout'))

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
  },
]

export default routes
