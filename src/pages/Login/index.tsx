import { useState } from 'react'
import history from 'router/history'
import { getQueryByName } from 'lib/function'
import { login, LoginParams } from 'api/user'
import { useDispatch } from 'react-redux'
import { UserAction } from 'store/user'

import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form'
import {
  Alert,
  Space,
  message,
  Tabs,
} from 'antd'

import { Link } from 'react-router-dom'
import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons'

import type { RouteComponent, FC } from 'types/index'

// import Link from 'components/Link'
import Logo from 'img/logo/logo.png'
import Footer from './Footer'

import styles from './index.module.less'

interface LoginResult {
  status?: string;
  type?: string;
  currentAuthority?: string;
}

const LoginMessage: FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
)
/** 此方法会跳转到 redirect 参数所在的位置 */
const goto = () => {
  if (!history) return
  setTimeout(() => {
    const redirect = getQueryByName('redirect', history.location.search)
    history.push(redirect || '/')
  }, 1000)
}

const Login: RouteComponent = () => {
  const [submitting, setSubmitting] = useState(false)
  const [type, setType] = useState<string>('account')
  const [loginRes, setLoginRes] = useState<LoginResult>({})
  const dispatch = useDispatch()

  const { type: loginType, status } = loginRes

  const handleSubmit = (values: LoginParams): void => {
    setLoginRes({
      status: '',
      type,
    })
    setSubmitting(true)
    const { accessKey, secretKey, autoLogin } = values
    login({
      accessKey,
      secretKey,
      autoLogin,
    })
      .then((res: any) => {
        const loginAction: UserAction = {
          type: 'USER/USER_SAVE',
          isLogin: true,
          user: accessKey,
          token: res.sessionId,
        }
        dispatch(loginAction)
        accessKey && window.localStorage.setItem('userLoggedIn', window.btoa(accessKey))
        message.success('登录成功！')
        goto()
      })
      .catch(() => {
        setLoginRes({
          status: 'error',
        })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {/* {SelectLang && <SelectLang />} */}
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={Logo} />
              <span className={styles.title}>Console</span>
            </Link>
          </div>
          <div className={styles.desc}>
            Console 是 byteark cs技术部 出品的存储项目
          </div>
        </div>
        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: '登录',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values: LoginParams) => handleSubmit(values)}
          >

            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab="账户密码登录"
              />
              {/* <Tabs.TabPane
                key="mobile"
                tab="手机号登录"
              /> */}
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content="账户或密码错误"
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="accessKey"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="输入账户"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="secretKey"
                  placeholder="输入密码"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  rules={[
                    {
                      required: true,
                      message: '请输入密码!',
                    },
                  ]}
                />
              </>
            )}
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
              {/* <Link style={{ float: 'right' }} to="/">
                忘记密码 ？
              </Link> */}
            </div>
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login
