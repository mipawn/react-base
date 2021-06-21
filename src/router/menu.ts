import type { RouteProps } from './type'

const menus: RouteProps[] = [
  {
    path: '/', name: 'dashboard', title: '仪表盘', icon: 'Dashboard',
  },
  {
    path: '/file',
    name: 'file',
    title: '文件柜',
    icon: 'Folder',
    breadcrumbName: '文件柜',
    children: [
      {
        path: '/all', name: 'fileAll', title: '全部', breadcrumbName: '全部',
      },
      {
        path: '/hot', name: 'fileHot', title: '常温区', breadcrumbName: '常温区',
      },
      {
        path: '/freezer', name: 'fileFreezer', title: '冷冻区', breadcrumbName: '冷冻区',
      },
      {
        path: '/recycle', name: 'fileRecycle', title: '回收区', breadcrumbName: '回收区',
      },
    ],
  },
]
export default menus
