import type { RouteProps as RouteDefaultProps } from 'react-router-dom'

export interface RouteProps extends RouteDefaultProps {
  hide?: boolean,
  name?: string,
  title?: string,
  route?: RouteProps,
  icon?: string,
  children?: RouteProps[]
}
