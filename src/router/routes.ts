import { lazy } from 'react'
import type { IRouteProps } from './type'

import Index from '../pages/Index'

const NotFound = lazy(() => import(/* webpackChunkName: '404' */ '../pages/404'))
const Login = lazy(() => import(/* webpackChunkName: 'Login' */ '../pages/Login'))

/**
 * exact 默认为 true
 * to 默认为 redirect 组件
 */

export const routes: IRouteProps[] = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/404',
    component: NotFound,
  },
  {
    to: '/404',
  },
]

export default routes
