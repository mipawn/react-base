import type { RouteProps } from './type'

const menus: RouteProps[] = [
  {
    path: '/', name: 'dashboard', title: '仪表盘', icon: 'Dashboard',
  },
  {
    path: '/file',
    name: 'file',
    title: '文件柜',
    icon: 'File',
    children: [
      {
        path: '/all', name: 'fileAll', title: '全部',
      },
      {
        path: '/hot', name: 'fileHot', title: '常温区',
      },
      {
        path: '/freezer', name: 'filefreezer', title: '冷冻区',
      },
    ],
  },
]
export default menus
