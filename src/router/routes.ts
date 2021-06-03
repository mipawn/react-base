import { IRouteProps } from './type'


import About from '../pages/About'
import Index from '../pages/Index'
import NotFound from '../pages/404'



export const routes:IRouteProps[] = [
  {
    path: '/',
    component: Index,
    exact: true
  },
  {
    path: '/about',
    component: About,
    exact: true
  },
  {
    path: '/404',
    component: NotFound,
    exact: true
  },
  {
    from: '/ooo',
    to: '/404',
    push: true,
    path: '/cccc'
  }
]

export default routes
