import {
  Router, Route, Switch, Redirect,
} from 'react-router-dom'
import { Suspense } from 'react'
import { FC } from 'types/index'
import Loading from '../components/Loading'

import history from './history'
import routes from './routes'

import { isRedirect } from './type'

const PagesRouter: FC = () => (
  <Router history={history}>
    <Suspense fallback={<Loading tip="加载中..." delay={300} />}>
      <Switch>
        { routes.map((item) => {
          item.exact = true
          return (
            isRedirect(item)
              ? <Redirect {...item} key={item.to?.toString()} />
              : <Route {...item} key={item.path?.toString()} />
          )
        }) }

      </Switch>
    </Suspense>
  </Router>
)

export default PagesRouter
