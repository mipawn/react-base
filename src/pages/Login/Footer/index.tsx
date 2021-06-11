// import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-layout'
import { FC } from 'types/index'

const Footer: FC = () => {
  return (
    <DefaultFooter
      copyright="Copyright © 2020 BA Inc. All rights reserved"
      links={[
        {
          key: 'icp',
          title: '浙ICP备19025601号',
          href: 'http://beian.miit.gov.cn/',
          blankTarget: true,
        },
        // {
        //   key: 'github',
        //   title: <GithubOutlined />,
        //   href: 'https://github.com/ant-design/ant-design-pro',
        //   blankTarget: true,
        // },
        {
          key: 'gongwang',
          title: '浙公网安备 33011002014295号',
          href: 'http://www.beian.gov.cn/portal/registerSystemInfo',
          blankTarget: true,
        },
      ]}
    />
  )
}

export default Footer
