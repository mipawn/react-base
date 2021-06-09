import type { RouteComponent } from 'types/index'

import { Link } from 'react-router-dom'

const Index: RouteComponent = () => (
  <div>
    {/* <Link className="App-link" to='/'>首页</Link> */}
    <Link className="App-link" to="/about/1">about</Link>
    {/* <Route path="/11" component={About}></Route> */}
  </div>
)

export default Index
