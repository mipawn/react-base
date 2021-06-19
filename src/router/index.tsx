import {
  Router, Switch,
} from 'react-router-dom'
import { Suspense } from 'react'
import { FC } from 'types/index'
import { renderRoutes } from 'react-router-config'
import Loading from '../components/Loading'

import history from './history'
import routes from './routes'

const PagesRouter: FC = () => (
  <Router history={history}>
    <Suspense fallback={<Loading tip="加载中..." delay={300} />}>
      <Switch>
        { renderRoutes(routes as any)}
      </Switch>
    </Suspense>
  </Router>
)

export default PagesRouter
