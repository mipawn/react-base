import { IRouteProps } from './type'

import { lazy } from 'react'
import Index from '../pages/Index'


const About = lazy(() => import(/* webpackChunkName: 'About' */ '../pages/About'))
const NotFound = lazy(() => import(/* webpackChunkName: '404' */ '../pages/404'))

/**
 * exact 默认为 true
 * to 默认为 redirect 组件
 */

export const routes:IRouteProps[] = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/about/:id',
    component: About,
  },
  {
    path: '/404',
    component: NotFound,
  },
  {
    to: '/404',
  }
]

export default routes
