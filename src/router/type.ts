import type { RouteProps as RouteDefaultProps } from 'react-router-dom'
import type { IconType } from 'components/Icon'

export interface RouteProps extends RouteDefaultProps {
  hide?: boolean,
  name?: string,
  title?: string,
  route?: RouteProps,
  icon?: IconType,
  children?: RouteProps[],
  breadcrumbName?: string
}
