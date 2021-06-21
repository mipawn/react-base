import { FC } from 'types/index'
import { useLocation, Link } from 'react-router-dom'
import { RouteProps } from 'router/type'

import { Fragment } from 'react'
import { PageHeader, PageHeaderProps } from 'antd'
import menus from 'router/menu'

import styles from './index.module.scss'

function getBreadcrumb(pathArray: string[]) {
  const breadcrumb: RouteProps[] = []
  pathArray.forEach(pathItem => {
    const route = {
      ...(breadcrumb.length
        ? breadcrumb[breadcrumb.length - 1]
          ?.children
          ?.find(item => item.path === `/${pathItem}`)
        : menus.find(item => item.path === `/${pathItem}`)),
    }
    if (route && breadcrumb.length) {
      route.path = `${breadcrumb[breadcrumb.length - 1].path}${route.path}`
    }
    route && breadcrumb.push(route)
  })
  return breadcrumb.map(breadcrumbItem => {
    const { path, title } = breadcrumbItem
    return {
      path,
      title,
    }
  })
}

const Header: FC<PageHeaderProps> = (props) => {
  const location = useLocation()
  const pathArray = location.pathname.split('/').slice(1)

  const breadcrumb = getBreadcrumb(pathArray)

  const breadcrumbRender = () => {
    return breadcrumb.map((item, index) => {
      return index === breadcrumb.length - 1
        ? (
          <Link
            to={`${item.path}`}
            key={`${item.path}${index}`}
          >
            {item.title}
          </Link>
        )
        : (
          <Fragment key={`${index}`}>
            <Link
              key={`${item.path}${index}`}
              to={`${item.path}`}
            >
              {item.title}

            </Link>
            <span key={`${item.path}${item.title}${index}`}> / </span>
          </Fragment>
        )
    })
  }
  const { children, ...otherProps } = props
  return (
    <PageHeader
      className={styles.header}
      ghost={false}
      breadcrumbRender={breadcrumbRender}
      {...otherProps}
    >
      {children}

    </PageHeader>
  )
}

export default Header
