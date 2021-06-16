import { FC } from 'types/index'
import { Fragment } from 'react'
import { Inspector } from 'react-dev-inspector'

const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : Fragment
const Layout: FC = ({ children }) => {
  return (
    <InspectorWrapper>{children}</InspectorWrapper>
  )
}

export default Layout
