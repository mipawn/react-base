import { Router, Route, Switch, Redirect } from 'react-router-dom'
import history from './history'
import routes from './routes'
import { Suspense } from 'react'

import { isRedirect } from './type'

const PagesRouter = () => {
  return (
    <Router history={history}>
      <Suspense fallback={<div>loading</div>}>
        <Switch>
          { routes.map((item) => {
            item.exact = true
            return (
              isRedirect(item)
                ? <Redirect {...item} key={item.to?.toString()}></Redirect>
                : <Route {...item} key={item.path?.toString()} ></Route>
            )
          }) }

        </Switch>
      </Suspense>
    </Router>
  )
}

export default PagesRouter
