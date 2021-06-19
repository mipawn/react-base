import { FC } from 'types/index'
import { useLocation } from 'react-router-dom'
import { PageHeader, PageHeaderProps } from 'antd'
import menus from 'router/menu'

const Header: FC<PageHeaderProps> = (props) => {
  const location = useLocation()
  const pathArray = location.pathname.split('/').slice(1)
  const menu = pathArray.length > 1
    ? menus
      .find(item => item.path === `/${pathArray[0]}`)
      ?.children
      ?.find(item => item.path === `/${pathArray[1]}`)
    : menus.find(item => item.path === `/${pathArray[0]}`)
  const { children, ...otherProps } = props
  return (
    <PageHeader ghost={false} {...menu} {...otherProps}>{children}</PageHeader>
  )
}

export default Header
