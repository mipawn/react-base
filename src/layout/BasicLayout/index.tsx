import type { FC } from 'types/index'
import {
  Button, Layout, Menu, Dropdown, Avatar,
} from 'antd'
import Header from 'components/Header'
import Icon from 'components/Icon'

import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { getSession } from 'api/user'
import { logout } from 'lib/user'
import { renderRoutes } from 'react-router-config'
import menus from 'router/menu'
import { RouteProps } from 'router/type'

import MenuLogo from './logo'

import styles from './index.module.scss'

const {
  Header: LayoutHeader, Content, Sider,
} = Layout
const { SubMenu } = Menu

interface BasicProps {
  route: any
}

function getDefaultKeys() {
  const { pathname } = useLocation()

  const pathArray = pathname.split('/').slice(1)
  pathArray.reverse()
  return pathArray.map(item => `/${item}`)
}

const BasicLayout: FC<BasicProps> = (props) => {
  const { route } = props
  const [allowedRoutes, setAllowedRoutes] = useState([]) // 后面更新权限的时候再制定方案
  const [collapsed, setCollapsed] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()

  const defaultKeys = getDefaultKeys()

  useEffect(() => {
    getSession()
      .then((res: any) => {
        // console.log(res)
        setAllowedRoutes(res.data.pages)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  const onCollapse = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed)
  }

  const Menus = menus.map(menu => {
    return menu.children
      ? (
        <SubMenu key={`${menu.path}`} icon={<Icon type={menu.icon} />} title={menu.title}>
          {(menu.children as RouteProps[]).map(subMenu => {
            return <Menu.Item key={`${subMenu.path}`} icon={<Icon type={subMenu.icon} />}>{subMenu.title}</Menu.Item>
          })}
        </SubMenu>
      )
      : <Menu.Item key={`${menu.path}`} icon={<Icon type={menu.icon} />}>{menu.title}</Menu.Item>
  })

  const onSelect = (selected: any) => {
    const path = selected.keyPath.reverse().join('')
    history.push({ pathname: path })
  }

  return (
    <div className={styles.layout}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
        >
          <MenuLogo collapsed={collapsed} />
          <Menu
            className={styles.menu}
            theme="dark"
            defaultSelectedKeys={defaultKeys}
            defaultOpenKeys={defaultKeys}
            mode="inline"
            style={{
              paddingTop: 0,
            }}
            onSelect={onSelect}
          >
            {Menus}
          </Menu>
        </Sider>
        <Layout>
          <LayoutHeader className={styles['page-header']}>
            {/* 预留 */}
            <div className={styles['header-start ']} />
            <div className={styles['header-end']}>
              <Dropdown
                key="dropdown"
                overlay={(
                  <Menu>
                    <Menu.Item key="1" onClick={logout}>退出登录</Menu.Item>
                  </Menu>
                )}
              >
                <div className={styles.user}>
                  <Avatar />
                  <span style={{ marginLeft: '10px' }}>admin</span>
                </div>
              </Dropdown>
              <Dropdown
                overlay={(
                  <Menu>
                    <Menu.Item key="1">🇨🇳&nbsp;&nbsp;&nbsp;简体中文</Menu.Item>
                    <Menu.Item key="2">🇺🇸&nbsp;&nbsp;&nbsp;en-US</Menu.Item>
                  </Menu>
                )}
                placement="bottomRight"
              >
                <span className={styles.globalIconClassName}>
                  <i className="anticon" title="切换语言">
                    <svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z "
                        className="css-c4d79v"
                      />
                    </svg>
                  </i>
                </span>
              </Dropdown>
            </div>
          </LayoutHeader>
          <Content>
            <Header />
            { renderRoutes(route) }
          </Content>

        </Layout>
      </Layout>
    </div>
  )
}

export default BasicLayout
