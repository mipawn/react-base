import type { RouteComponentProps, FC } from 'types/index'
import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout'
import ProLayout from '@ant-design/pro-layout'
import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { GlobalDispatch } from 'store/global/type'

import Logo from 'assets/img/logo/logo.png'

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={(
      <Button type="primary">
        <Link to="/login">Go Login</Link>
      </Button>
    )}
  />
)

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings
} & ProLayoutProps
const BasicLayout: FC<BasicLayoutProps> = (props) => {
  const { children, settings, ...others } = props
  const dispatch = useDispatch<GlobalDispatch>()

  const handleMenuCollapse = (payload: boolean): void => {
    dispatch({
      type: 'GLOBAL/CHNAGE_COLLAPSED',
      payload,
    })
  }

  return (
    <ProLayout
      logo={Logo}
      {...others}
      {...settings}
      onCollapse={handleMenuCollapse}
    >
      {children}
    </ProLayout>
  )
}

export default BasicLayout
