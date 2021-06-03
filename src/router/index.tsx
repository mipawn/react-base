import { Router, Route, Switch, Redirect } from 'react-router-dom'
import history from './history'
import routes from './routes'
import { isRedirect } from './type'

const PagesRouter = () => {
  return (
    <Router history={history}>
      <Switch>
        { routes.map((item) => {
          return (
            isRedirect(item)
              ? <Redirect {...item} key={item.to?.toString()}></Redirect>
              : <Route {...item} key={item.path?.toString()}></Route>
          )
        }) }
      </Switch>
    </Router>
  )
}

export default PagesRouter
