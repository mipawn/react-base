import { RouteComponent } from 'types/index'
import { Fragment } from 'react'
import { Inspector } from 'react-dev-inspector'
import type { RouteProps } from 'router/type'
import BasicLayout from '../BasicLayout'

const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : Fragment

const Layout: RouteComponent<RouteProps> = (props) => {
  const { route } = props
  return (
    <InspectorWrapper>
      <BasicLayout route={(route && route.children) || []} />
    </InspectorWrapper>
  )
}

export default Layout
