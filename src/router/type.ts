import type { RouteProps, RedirectProps } from 'react-router-dom'

export type IRouteProps = RouteProps | RedirectProps

export function isRedirect(arg: IRouteProps): arg is RedirectProps {
  return (arg as RedirectProps).to !== undefined
}
