import { RouteComponent } from 'types/index'

const NotFound: RouteComponent = (props) => {
  console.log(props)
  const { location, history } = props
  if (location.pathname !== '/404') {
    history.replace('/404')
  }
  return (
    <div>404</div>
  )
}

export default NotFound
